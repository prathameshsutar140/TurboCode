# TurboCode IDE – Architecture & Technical Design Document

This document provides a comprehensive technical overview of the **TurboCode IDE** architecture, process boundaries, execution pipeline, and design choices.

---

## 1. High-Level Architecture Overview

TurboCode IDE adopts a clean decoupled client-server & Electron architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                       RENDERER PROCESS                      │
│                                                             │
│  ┌────────────────────┐ ┌────────────────────────────────┐  │
│  │ Monaco Code Editor │ │ Dual Theme Engine              │  │
│  │ (Custom TurboTheme)│ │ (Classic Turbo / Modern Dark)  │  │
│  └────────────────────┘ └────────────────────────────────┘  │
│  ┌────────────────────┐ ┌────────────────────────────────┐  │
│  │ Navigation Panels  │ │ Diagnostic Error Navigator     │  │
│  │ (Files & Examples) │ │ (Clickable line/column jump)   │  │
│  └────────────────────┘ └────────────────────────────────┘  │
└──────────────┬──────────────────────────────┬───────────────┘
               │ (Strict Context Isolation)   │ (HTTP / JSON API)
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      PRELOAD & IPC LAYER     │ │     BACKEND SERVICE LAYER  │
│  - contextBridge             │ │  - compiler-service.ts     │
│  - Dialog file open/save     │ │  - runner-service.ts       │
│  - Path sanitization         │ │  - gdb-service.ts          │
└──────────────┬───────────────┘ │  - storage-service.ts      │
               ▼                 │  - ai-service.ts           │
┌──────────────────────────────┐ └──────────────┬─────────────┘
│    ELECTRON MAIN PROCESS     │                │
│  - BrowserWindow             │                │
│  - Application Native Menu   │                ▼
│  - Single Instance Lock      │ ┌────────────────────────────┐
└──────────────────────────────┘ │    OS RUNTIME & TOOLCHAIN  │
                                 │  - GCC / G++ (Real native) │
                                 │  - GDB Debugger            │
                                 │  - Win32 Job Objects       │
                                 │  - /tmp/turbocode_builds/  │
                                 └────────────────────────────┘
```

---

## 2. Component Breakdown

### A. Frontend Layer (`src/`)
- **Monaco Editor Integration**: Hosted via `@monaco-editor/react`. Configured with custom language tokens for C and C++ (keywords, preprocessor directives, types, operators, and comments).
- **Classic Borland Turbo Engine**: Custom Monaco theme (`turbo-classic`) featuring:
  - Deep blue background (`#0000a8`)
  - Bright yellow keywords (`#ffff55`)
  - Bright green string literals (`#55ff55`)
  - Cyan comments (`#00aaaa`)
  - Retro window frames with DOS double-line ASCII glyphs (`═`, `[■]`, `[1]`).
- **Modern Theme Engine**: Slate/zinc dark theme (`#18181b`) and clean daytime light theme.
- **Diagnostic Navigation**: Subscribes to parsed compiler errors and invokes `editor.revealPositionInCenter` and `editor.setPosition` on user click.

### B. Compiler Service (`services/compiler-service.ts`)
- **Toolchain Discovery**: Dynamically scans system PATH and standard MinGW-w64/MSYS2 locations (`C:\msys64\ucrt64\bin\`, `/usr/bin/`).
- **Standard Flag Generation**:
  - C: `-std=c90`, `-std=c99`, `-std=c11`, `-std=c17` (with `-lm` math library auto-linked).
  - C++: `-std=c++11`, `-std=c++14`, `-std=c++17`, `-std=c++20`.
- **Diagnostic Regex Engine**:
  Parses GCC and Clang standard diagnostics:
  ```regexp
  /^(.*?):(\d+):(\d+):\s*(fatal error|error|warning|note):\s*(.*)$/i
  ```
  Extracts: file, line, column, severity, message, and caret snippets.

### C. Runner Service & Sandboxing (`services/runner-service.ts`)
- **Isolation Boundary**: Every compilation creates a dedicated unique subfolder `/tmp/turbocode_builds/build_<timestamp>_<uuid>/`.
- **Resource Ceilings**:
  - Time limits (default: 5.0 seconds). If exceeded, triggers `SIGKILL` on the entire child process group.
  - Standard input stream feeding: Buffered user input piped to `child.stdin.write()` followed by EOF.
  - Stream truncation: Capped at 256 KB to protect client browser memory.
  - Signal recognition: Categorizes `SIGSEGV` (Memory fault), `SIGFPE` (Zero division), and `SIGABRT` (Assertion abort).

### D. Windows Restricted Runner (`runner/windows-runner/restricted_runner.cpp`)
On Windows desktop deployments, ordinary process spawning is augmented by Win32 **Job Objects**:
- `CreateJobObject(NULL, NULL)`
- `JOB_OBJECT_LIMIT_PROCESS_MEMORY` & `JOB_OBJECT_LIMIT_JOB_MEMORY` (caps RAM to 128 MB).
- `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE` ensures that closing the IDE terminates any active child processes.
- `WaitForSingleObject(pi.hProcess, timeoutMs)` enforces the timeout ceiling.

### E. GDB Debugger Inspector (`services/gdb-service.ts`)
- Interacts non-interactively with GNU GDB:
  ```bash
  gdb -batch -ex "file <binary>" -ex "disassemble main" -ex "info registers" -ex "quit"
  ```
- Uses `nm --demangle` to provide symbols and function offsets for educational instruction on program binary layout.

### F. Local Storage & Metadata (`services/storage-service.ts` & `database/schema.sql`)
- Dual-mode persistence: SQLite table schemas (`settings`, `projects`, `recent_files`, `compilation_history`) synchronized with atomic JSON fallback files.

---

## 3. Security Principles

1. **Zero Client-Side Spawning**: The web browser never initiates child processes directly.
2. **Context Isolation**: Electron renderer runs with `contextIsolation: true` and `nodeIntegration: false`.
3. **No Private Keys in Bundles**: Optional AI assistance runs strictly through a server-side proxy route (`/api/ai/assist`) without exposing API keys or secrets to the browser.
4. **Explicit Consent**: Source code is only sent to external AI services when the user explicitly checks the consent toggle in the UI.
