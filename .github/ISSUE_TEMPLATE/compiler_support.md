---
name: Toolchain / Compiler Request
about: Report a new compiler toolchain or diagnostic format for TurboCode
title: '[COMPILER]: '
labels: ['toolchain', 'compiler']
assignees: ''
---

## Toolchain Information
- **Compiler Name**: [e.g. Clang 18, Intel oneAPI, TinyCC, GCC 14]
- **Target OS**: [Windows 10/11, Linux, macOS]
- **Default Executable Path**: [e.g. C:\LLVM\bin\clang.exe]

## Diagnostic Sample Output
Please provide an exact terminal output sample when this compiler encounters an error:
```text
(Paste compiler error output here)
```

## Compilation Flags
- Recommended standard flag: `-std=...`
- Recommended optimization flag: `-O...`
- Mandatory libraries: [e.g. `-lm`, `-lpthread`]
