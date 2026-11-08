# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.4.x   | :white_check_mark: |
| 2.0.x   | :x:                |
| < 2.0   | :x:                |

---

## Security Architecture & Threat Model

TurboCode IDE compiles and runs student and developer C and C++ code. Because native compiled binaries execute with CPU privileges, TurboCode IDE employs an isolated multi-tiered sandbox model:

### 1. Process Separation
- Student code is **never** executed inside the Electron main process, Node.js runtime, or the web renderer.
- Executables are placed into dedicated, short-lived temporary build directories.
- Working directories are isolated from application source files, configuration stores, and user private credentials.

### 2. Resource Quotas & Denial-of-Service Defense
- **Execution Timeouts**: Enforced via monotonic timers (default: 5.0 seconds). If exceeded, the runner terminates the child process and its process tree immediately.
- **Output Buffering Caps**: Standard output and error streams are restricted to a maximum buffer (256 KB) to prevent memory exhaustion and browser lockup from runaway `while(1) printf(...)` loops.
- **Memory Limits (Windows)**: When compiled as a Windows desktop application, `runner/windows-runner/restricted_runner.cpp` uses Win32 **Job Objects** (`JOB_OBJECT_LIMIT_JOB_MEMORY` and `JOB_OBJECT_LIMIT_PROCESS_MEMORY`) to enforce a hard RAM ceiling (e.g., 128 MB).

### 3. IPC & Electron Boundaries
- `contextIsolation` is explicitly enabled.
- `nodeIntegration` is disabled.
- Native filesystem access is constrained by strict dialog validation and path sanitization to prevent path traversal attacks.

---

## Reporting a Vulnerability

If you discover a security vulnerability in TurboCode IDE:

1. **Do not disclose the vulnerability in public GitHub Issues.**
2. Email a detailed vulnerability report to: `security@turbocode.dev` or use GitHub's private vulnerability reporting feature under the **Security** tab.
3. Include:
   - Detailed description of the vulnerability.
   - Proof-of-concept (PoC) code or steps to reproduce.
   - Potential impact on the host operating system.
4. We aim to acknowledge receipt within 48 hours and coordinate a patch within 14 business days.
