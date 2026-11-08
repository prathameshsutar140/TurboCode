import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { IDESettings, HistoryItem, ProjectFolder } from '../src/types.js';

const execPromise = promisify(exec);
const DATA_DIR = path.resolve(process.cwd(), '.turbocode_data');
const DB_FILE = path.join(DATA_DIR, 'turbocode.sqlite');
const SCHEMA_FILE = path.resolve(process.cwd(), 'database/schema.sql');
const BACKUP_JSON_FILE = path.join(DATA_DIR, 'store.json');

// Default initial settings
export const DEFAULT_SETTINGS: IDESettings = {
  theme: 'classic', // Default: Classic Turbo C++ blue!
  fontSize: 15,
  fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
  tabSize: 4,
  wordWrap: false,
  minimap: true,
  lineNumbers: true,
  autoSave: false,
  compiler: {
    cCompiler: 'gcc',
    cppCompiler: 'g++',
    cStandard: 'c17',
    cppStandard: 'c++20',
    optimization: '-O0',
    warningFlags: ['-Wall', '-Wextra'],
    customFlags: '',
    includePaths: [],
  },
  runner: {
    timeoutMs: 5000,
    memoryLimitMb: 128,
    sandboxMode: 'restricted',
  },
  confirmBeforeClose: true,
};

interface DataStore {
  settings: IDESettings;
  history: HistoryItem[];
  recentFiles: { id: string; name: string; path: string; language: string; timestamp: number }[];
  projects: ProjectFolder[];
}

let store: DataStore = {
  settings: DEFAULT_SETTINGS,
  history: [],
  recentFiles: [],
  projects: [],
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create storage dir:', err);
  }
}

// Load from backup JSON if exists
if (fs.existsSync(BACKUP_JSON_FILE)) {
  try {
    const raw = fs.readFileSync(BACKUP_JSON_FILE, 'utf-8');
    store = { ...store, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load JSON store:', err);
  }
}

function persistStore() {
  try {
    fs.writeFileSync(BACKUP_JSON_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write JSON store:', err);
  }
}

/**
 * Initialize SQLite schema
 */
export async function initDatabase(): Promise<boolean> {
  try {
    if (fs.existsSync(SCHEMA_FILE)) {
      await execPromise(`sqlite3 "${DB_FILE}" < "${SCHEMA_FILE}"`);
      return true;
    }
  } catch (err) {
    // SQLite CLI might not be present, fallback to JSON persistence
  }
  return false;
}

// Initialize on boot
initDatabase().catch(() => {});

export function getSettings(): IDESettings {
  return store.settings;
}

export function saveSettings(newSettings: Partial<IDESettings>): IDESettings {
  store.settings = {
    ...store.settings,
    ...newSettings,
    compiler: {
      ...store.settings.compiler,
      ...(newSettings.compiler || {}),
    },
    runner: {
      ...store.settings.runner,
      ...(newSettings.runner || {}),
    },
  };
  persistStore();
  return store.settings;
}

export function getHistory(): HistoryItem[] {
  return store.history.slice(0, 50);
}

export function addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const fullItem: HistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
  };
  store.history.unshift(fullItem);
  if (store.history.length > 100) {
    store.history = store.history.slice(0, 100);
  }
  persistStore();
  return fullItem;
}

export function clearHistory(): void {
  store.history = [];
  persistStore();
}

export function getRecentFiles() {
  return store.recentFiles;
}

export function addRecentFile(file: { name: string; path: string; language: string }) {
  store.recentFiles = store.recentFiles.filter(f => f.path !== file.path);
  store.recentFiles.unshift({
    id: `rf_${Date.now()}`,
    ...file,
    timestamp: Date.now(),
  });
  if (store.recentFiles.length > 20) {
    store.recentFiles = store.recentFiles.slice(0, 20);
  }
  persistStore();
}

export function getProjects(): ProjectFolder[] {
  return store.projects;
}

export function saveProject(project: ProjectFolder): ProjectFolder {
  const existingIdx = store.projects.findIndex(p => p.id === project.id);
  if (existingIdx >= 0) {
    store.projects[existingIdx] = project;
  } else {
    store.projects.push(project);
  }
  persistStore();
  return project;
}

export function deleteProject(id: string): boolean {
  const beforeLen = store.projects.length;
  store.projects = store.projects.filter(p => p.id !== id);
  persistStore();
  return store.projects.length < beforeLen;
}
