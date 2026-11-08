# Sandboxed Execution & Security Architecture

TurboCode IDE prioritizes safety when running native C and C++ programs. Unlike interpreted environments, compiled machine code executes directly on CPU silicon. This document explains the sandboxing and quota mechanisms used to prevent host system freeze, infinite loops, and memory exhaustion.

---

## 1. Threat Vectors in Student & Experimental C/C++ Code

1. **Infinite CPU Loops**:
   ```c
   while (1) { /* runaway loop consumes 100% of a CPU core */ }
   ```
2. **Infinite Output Flooding (Console DoS)**:
   ```c
   while (1) { printf("Spamming terminal!\n"); }
   ```
3. **Runaway Memory Allocations**:
   ```c
   while (1) { malloc(1024 * 1024); }
   ```
4. **Invalid Memory Access / Exploitation**:
   - Null pointer dereferences (`*ptr = 10;`)
   - Buffer overflow / stack smashing
   - Division by zero (`int x = 5 / 0;`)

---

## 2. Multi-Tiered Defenses

### Tier 1: Isolated Build Directories
- Every build receives an isolated temporary directory:
  `/tmp/turbocode_builds/build_<timestamp>_<uuid>/`
- The user's original source file is never overwritten.
- Temporary binaries are cleaned up safely.

### Tier 2: Monotonic Timeout Enforcement
- Default timeout: **5.0 seconds** (user-configurable in Settings from 0.5s to 15s).
- Managed via Node.js high-resolution timers.
- If the timer fires before program exit:
  - POSIX: Sends `SIGKILL` to the child process and its process group.
  - Windows: Calls `TerminateJobObject(hJob, 124)` to kill the entire process tree.

### Tier 3: Output Stream Throttling
- Standard output and error streams are capped at **256 KB**.
- Once this threshold is reached, further stream data is dropped, and a truncation marker is appended.
- This prevents the browser UI from locking up under gigabytes of continuous logging.

### Tier 4: Win32 Job Objects (Windows Desktop)
On Windows desktop installations, `runner/windows-runner/restricted_runner.cpp` configures Win32 Job Objects:
```cpp
JOBOBJECT_EXTENDED_LIMIT_INFORMATION jeli = { 0 };
jeli.BasicLimitInformation.LimitFlags = 
    JOB_OBJECT_LIMIT_PROCESS_MEMORY |
    JOB_OBJECT_LIMIT_JOB_MEMORY |
    JOB_OBJECT_LIMIT_DIE_ON_UNHANDLED_EXCEPTION |
    JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;

jeli.ProcessMemoryLimit = memLimitMb * 1024 * 1024; // e.g. 128 MB
jeli.JobMemoryLimit = memLimitMb * 1024 * 1024;
```
If a student program attempts to allocate more RAM than the configured quota, the OS rejects the allocation (`malloc` returns `NULL`, or `std::bad_alloc` is thrown), protecting system stability.

---

## 3. Signal Capture & Diagnostics

When an abnormal termination occurs, the runner captures OS exit signals and translates them into understandable educational messages:
- `SIGSEGV` -> **Segmentation Fault**: Invalid memory access or null pointer dereference.
- `SIGFPE` -> **Floating Point Exception**: Integer division by zero or mathematical domain error.
- `SIGABRT` -> **Aborted**: Unhandled C++ exception or failed `assert()` check.
