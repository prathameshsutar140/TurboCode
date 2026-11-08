# TurboCode IDE – Project Roadmap

This roadmap outlines planned features, architecture milestones, and toolchain improvements for future releases of TurboCode IDE.

---

## Current Release: v2.4 (Completed)
- [x] Classic Borland Turbo C++ 3.0 authentic blue visual mode.
- [x] Modern Dark and Light theme engines.
- [x] Monaco code editor integration with syntax highlighting for C & C++.
- [x] Real GCC & G++ compiler execution (C90–C17 and C++11–C++20).
- [x] Diagnostic parser with clickable line/column error navigation.
- [x] STDIN input stream piping with buffered test-case presets.
- [x] GDB inspector for live disassembly and register viewing.
- [x] 22+ built-in practical educational C and C++ programs.
- [x] Windows Electron architecture files & Win32 Job Object sandbox source.

---

## Release v2.5 (Upcoming)
- [ ] **Clang-Format Integration**: Automatic code formatting for C and C++ using Google, LLVM, or GNU styles.
- [ ] **Interactive GDB Debugger**: Step-over (`next`), step-into (`step`), breakpoint toggling in Monaco gutter, and variable watch expressions.
- [ ] **CMake Multi-Target GUI**: Visual target builder for shared libraries (`.so`, `.dll`), static libraries (`.a`, `.lib`), and multiple binaries.
- [ ] **Memory Leak Detection**: Integrated AddressSanitizer (`-fsanitize=address`) and Valgrind logs in the Problems panel.

---

## Release v3.0 (Long-Term Vision)
- [ ] **Clang / LLVM Toolchain Auto-Installer**: One-click download of embedded portable LLVM for Windows.
- [ ] **Remote SSH Development**: Connecting TurboCode IDE to remote Linux servers or Raspberry Pi embedded environments.
- [ ] **Docker Execution Container**: Optional rootless Docker container sandbox for multi-tenant and untrusted program execution.
- [ ] **Live Interactive WebAssembly C/C++ Engine**: Running real Clang in WebAssembly as a fallback when native compilers are missing.
