import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { detectCompilers, compileSource } from './services/compiler-service.js';
import { runExecutable, stopAllExecutions } from './services/runner-service.js';
import { inspectWithGdb } from './services/gdb-service.js';
import { EXAMPLE_PROGRAMS } from './services/examples-data.js';
import {
  getSettings,
  saveSettings,
  getHistory,
  addHistoryItem,
  clearHistory,
  getProjects,
  saveProject,
  deleteProject,
} from './services/storage-service.js';
import { askAIAssistant } from './services/ai-service.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// ================= API ENDPOINTS =================

// 1. Compiler Toolchains Detection
app.get('/api/compilers', async (_req: Request, res: Response) => {
  try {
    const compilers = await detectCompilers();
    res.json({ success: true, compilers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Real Compilation
app.post('/api/compile', async (req: Request, res: Response) => {
  try {
    const { code, fileName, language, config } = req.body;
    if (!code && code !== '') {
      return res.status(400).json({ success: false, error: 'Code is required' });
    }

    const currentSettings = getSettings();
    const effectiveConfig = { ...currentSettings.compiler, ...(config || {}) };
    const lang = (language === 'cpp' || fileName?.endsWith('.cpp')) ? 'cpp' : 'c';

    const compileResult = await compileSource(
      code,
      fileName || (lang === 'cpp' ? 'main.cpp' : 'main.c'),
      lang,
      effectiveConfig
    );

    // Record into compilation history
    const errorCount = compileResult.diagnostics.filter(d => d.severity === 'error' || d.severity === 'fatal').length;
    const warningCount = compileResult.diagnostics.filter(d => d.severity === 'warning').length;

    addHistoryItem({
      fileName: fileName || (lang === 'cpp' ? 'main.cpp' : 'main.c'),
      language: lang,
      compileSuccess: compileResult.success,
      durationMs: compileResult.durationMs,
      errorCount,
      warningCount,
      compilerOutput: compileResult.compilerOutput,
    });

    res.json(compileResult);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Secure Execution
app.post('/api/run', async (req: Request, res: Response) => {
  try {
    const { executableId, stdinInput, config } = req.body;
    if (!executableId) {
      return res.status(400).json({ success: false, error: 'Executable ID required. Please compile first.' });
    }

    const currentSettings = getSettings();
    const effectiveConfig = { ...currentSettings.runner, ...(config || {}) };

    const runResult = await runExecutable(executableId, stdinInput || '', effectiveConfig);
    res.json(runResult);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Compile and Run in one single operation
app.post('/api/compile-and-run', async (req: Request, res: Response) => {
  try {
    const { code, fileName, language, stdinInput, compilerConfig, runnerConfig } = req.body;
    const currentSettings = getSettings();
    const effCompiler = { ...currentSettings.compiler, ...(compilerConfig || {}) };
    const effRunner = { ...currentSettings.runner, ...(runnerConfig || {}) };
    const lang = (language === 'cpp' || fileName?.endsWith('.cpp')) ? 'cpp' : 'c';

    // Step 1: Compile
    const compileResult = await compileSource(
      code || '',
      fileName || (lang === 'cpp' ? 'main.cpp' : 'main.c'),
      lang,
      effCompiler
    );

    const errorCount = compileResult.diagnostics.filter(d => d.severity === 'error' || d.severity === 'fatal').length;
    const warningCount = compileResult.diagnostics.filter(d => d.severity === 'warning').length;

    if (!compileResult.success || !compileResult.executableId) {
      addHistoryItem({
        fileName: fileName || (lang === 'cpp' ? 'main.cpp' : 'main.c'),
        language: lang,
        compileSuccess: false,
        durationMs: compileResult.durationMs,
        errorCount,
        warningCount,
        compilerOutput: compileResult.compilerOutput,
      });

      return res.json({
        success: false,
        compileResult,
        runResult: null,
      });
    }

    // Step 2: Run
    const runResult = await runExecutable(compileResult.executableId, stdinInput || '', effRunner);

    addHistoryItem({
      fileName: fileName || (lang === 'cpp' ? 'main.cpp' : 'main.c'),
      language: lang,
      compileSuccess: true,
      durationMs: compileResult.durationMs,
      runDurationMs: runResult.durationMs,
      exitCode: runResult.exitCode,
      errorCount,
      warningCount,
      compilerOutput: compileResult.compilerOutput,
    });

    res.json({
      success: true,
      compileResult,
      runResult,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Stop Running Processes
app.post('/api/stop', (_req: Request, res: Response) => {
  const result = stopAllExecutions();
  res.json({ success: true, ...result });
});

// 6. GDB Inspection & Disassembly
app.post('/api/gdb/inspect', async (req: Request, res: Response) => {
  try {
    const { executableId } = req.body;
    if (!executableId) {
      return res.status(400).json({ success: false, error: 'Executable ID required' });
    }
    const result = await inspectWithGdb(executableId);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Built-in Practical Programs Library
app.get('/api/examples', (_req: Request, res: Response) => {
  res.json({ success: true, examples: EXAMPLE_PROGRAMS });
});

// 8. Settings Management
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, settings: getSettings() });
});

app.post('/api/settings', (req: Request, res: Response) => {
  try {
    const updated = saveSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Compilation History
app.get('/api/history', (_req: Request, res: Response) => {
  res.json({ success: true, history: getHistory() });
});

app.delete('/api/history', (_req: Request, res: Response) => {
  clearHistory();
  res.json({ success: true });
});

// 10. Projects Management
app.get('/api/projects', (_req: Request, res: Response) => {
  res.json({ success: true, projects: getProjects() });
});

app.post('/api/projects', (req: Request, res: Response) => {
  try {
    const saved = saveProject(req.body);
    res.json({ success: true, project: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/projects/:id', (req: Request, res: Response) => {
  const ok = deleteProject(req.params.id);
  res.json({ success: ok });
});

// 11. AI Coding Assistant (Optional Module)
app.post('/api/ai/assist', async (req: Request, res: Response) => {
  try {
    const { action, sourceCode, language, contextMessage, userConsented } = req.body;
    if (!userConsented) {
      return res.status(400).json({
        success: false,
        error: 'Explicit user consent is required before transmitting code to external AI services.',
      });
    }

    const aiRes = await askAIAssistant(action, sourceCode, language, contextMessage);
    res.json(aiRes);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Build System File Generators (CMake & Makefile)
app.post('/api/build-system/generate', (req: Request, res: Response) => {
  const { projectName = 'TurboApp', type = 'cpp', files = ['main.cpp'], standard = '20' } = req.body;
  
  const cmakeContent = `cmake_minimum_required(VERSION 3.16)
project(${projectName} LANGUAGES ${type === 'cpp' ? 'CXX' : 'C'})

set(CMAKE_${type === 'cpp' ? 'CXX' : 'C'}_STANDARD ${standard.replace(/[^0-9]/g, '') || (type === 'cpp' ? '20' : '17')})
set(CMAKE_${type === 'cpp' ? 'CXX' : 'C'}_STANDARD_REQUIRED ON)

add_executable(${projectName}
    ${files.join('\n    ')}
)
`;

  const makefileContent = `# Generated by TurboCode IDE
CC = ${type === 'cpp' ? 'g++' : 'gcc'}
CFLAGS = -Wall -Wextra -O2 -std=${type === 'cpp' ? 'c++' + standard : 'c' + standard}
TARGET = ${projectName}
SRCS = ${files.join(' ')}

all: $(TARGET)

$(TARGET): $(SRCS)
\t$(CC) $(CFLAGS) $(SRCS) -o $(TARGET) ${type === 'c' ? '-lm' : ''}

clean:
\trm -f $(TARGET) *.o
`;

  res.json({ success: true, cmake: cmakeContent, makefile: makefileContent });
});

// ================= FRONTEND / VITE MIDDLEWARE =================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`TurboCode IDE server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
