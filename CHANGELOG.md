# Changelog

All notable changes to **TurboCode IDE** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.4.0] - 2026-11-08

### Added
- **Dual Visual Experience**:
  - Classic Borland Turbo C++ 3.0 authentic blue interface (`#0000a8`), retro window ornaments (`═`, `[■]`), yellow keywords (`#ffff55`), cyan comments (`#00aaaa`), and classic DOS status line.
  - Modern Dark and Light themes inspired by contemporary professional IDEs.
  - One-click theme switcher in toolbar and Options menu.
- **Real Toolchain Pipeline**:
  - Native GCC C compiler support (C90, C99, C11, C17) with auto `-lm` math linking.
  - Native G++ C++ compiler support (C++11, C++14, C++17, C++20).
  - Configurable optimization levels (`-O0`, `-O1`, `-O2`, `-O3`, `-Os`), warning flags (`-Wall`, `-Wextra`, `-Wpedantic`), and custom compiler arguments.
- **Diagnostic Engine**:
  - High-precision regex parser for GCC/Clang output (`file:line:col: severity: message`).
  - Interactive Problems panel: clicking any diagnostic jumps Monaco Editor directly to the error line and column.
- **Secure Sandboxed Execution**:
  - Isolated temporary build directories per execution (`/tmp/turbocode_builds/<build_id>/`).
  - Hard runtime timeouts (configurable 0.5s – 15s) with process tree termination (`SIGKILL`).
  - Win32 Job Object implementation (`runner/windows-runner/restricted_runner.cpp`) with 128 MB memory limit and `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE`.
  - Signal detection for `SIGSEGV` (segmentation fault), `SIGFPE` (division by zero), and `SIGABRT`.
- **Integrated Debugging**:
  - Real GDB inspector providing live x86_64 disassembly of `main()`, symbol table extraction, and register dumps.
- **Build System Generator**:
  - One-click generator for `CMakeLists.txt` and `Makefile`.
- **Educational Suite**:
  - 22+ built-in practical C and C++ programs covering basics, recursion, pointers, structs, OOP, templates, and STL containers (`vector`, `stack`, `queue`).
- **Optional AI Assistant**:
  - Server-side Gemini 3.8 Flash tutor with explicit user consent requirements, explaining code mechanics and diagnosing compiler errors.

### Fixed
- Fixed browser externalization error by cleanly decoupling server-side Node.js imports (`child_process`, `fs`) from client-side React bundles.
- Resolved type definitions for `HistoryItem` and compilation duration tracking.

---

## [2.0.0] - 2026-10-15

### Added
- Migration to Monaco Code Editor for C/C++ syntax highlighting, autocomplete, and minimap.
- Multi-tab file management with unsaved change dirty indicators (`*`).
- Buffered standard input (STDIN) console with preset test cases for `scanf` and `std::cin`.

---

## [1.0.0] - 2026-08-01

### Added
- Initial proof-of-concept Turbo C++ retro interface.
- Basic GCC command invocation and terminal output viewer.
