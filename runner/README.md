# TurboCode IDE - Execution Runner Architecture & Windows Sandboxing

## Overview
Student programs in C and C++ must never run in an unrestricted manner. TurboCode IDE implements a two-tier execution isolation model:

1. **Linux / POSIX Environments (Container & Web Dev)**:
   - Sandboxed working directories under `/tmp/turbocode_builds/<build_id>/`.
   - `child_process.spawn` with isolated process groups and non-inheriting environment variables.
   - Timeout enforcement using high-resolution timers and `SIGKILL` process tree termination.
   - Max output buffer capping (256 KB) to prevent denial-of-service through infinite stdout loops.
   - Signal handling for `SIGSEGV` (Segmentation fault), `SIGFPE` (Division by zero), and `SIGABRT`.

2. **Windows 10 & Windows 11 Desktop Environments**:
   - Uses `restricted_runner.cpp` compiled into `restricted_runner.exe`.
   - Leverages Win32 **Job Objects** (`CreateJobObject`, `SetInformationJobObject` with `JobObjectExtendedLimitInformation`).
   - Caps total committed memory (`ProcessMemoryLimit` and `JobMemoryLimit`, e.g. 128 MB).
   - Enforces automatic child termination on close (`JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE`).
   - Prevents student processes from lingering in the background upon IDE closure or timeout.

## Building the Windows Restricted Runner
Using MinGW-w64 (MSYS2):
```cmd
g++ -O2 -std=c++17 runner/windows-runner/restricted_runner.cpp -o runner/windows-runner/restricted_runner.exe
```
Or using Microsoft Visual C++ (MSVC Developer Command Prompt):
```cmd
cl /O2 /EHsc runner\windows-runner\restricted_runner.cpp /Fe:runner\windows-runner\restricted_runner.exe
```
