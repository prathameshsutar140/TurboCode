# Contributing to TurboCode IDE

Thank you for your interest in contributing to **TurboCode IDE**! We welcome contributions from developers, educators, compiler enthusiasts, and students.

To maintain high code quality and security, please review this guide before submitting contributions.

---

## Code of Conduct

All contributors and maintainers are expected to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all community members with respect and empathy.

---

## How to Contribute

### 1. Reporting Bugs
- First, check the [Issues](https://github.com/turbocode-ide/turbocode-ide/issues) tab to verify if the issue has already been reported.
- If not, open an issue using the [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).
- Include:
  - Operating system & architecture (e.g., Windows 11 x64, Ubuntu 22.04 LTS).
  - Compiler versions (`gcc --version`, `g++ --version`, `gdb --version`).
  - Minimal reproducible C/C++ source code sample.
  - Expected vs. actual behavior.

### 2. Suggesting Features
- Open an issue using the [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).
- Explain the pedagogical or practical problem the feature solves.

### 3. Submitting Pull Requests (PRs)

#### Step 1: Fork & Clone
```bash
git clone https://github.com/<your-username>/turbocode-ide.git
cd turbocode-ide
npm install
```

#### Step 2: Create a Feature Branch
Use descriptive branch naming following Git conventions:
- `feature/add-clang-format-support`
- `fix/diagnostic-regex-column-offset`
- `docs/update-msys2-troubleshooting`

```bash
git checkout -b feature/your-feature-name
```

#### Step 3: Implement & Test
- Ensure all TypeScript types are valid:
  ```bash
  npm run lint
  ```
- Build the web bundle:
  ```bash
  npm run build
  ```
- Test both themes (Classic Borland Turbo Mode and Modern Dark/Light).
- If modifying execution or compilation pipelines, test with both valid C and C++ programs as well as syntax errors.

#### Step 4: Commit Conventions
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add GDB watch expressions panel`
- `fix: resolve line number wrap on long diagnostic messages`
- `docs: clarify MSYS2 UCRT64 PATH setup instructions`
- `refactor: optimize diagnostic parsing regex`

#### Step 5: Open a Pull Request
- Push your branch and open a PR against `main`.
- Fill out the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).

---

## Architectural Guidelines

1. **Strict Process & Renderer Isolation**:
   - The renderer UI must never have direct access to `child_process`, `fs`, or native OS processes.
   - All compilation, execution, and GDB commands must route through secure backend services or validated Electron IPC channels.

2. **No Mock Compilations**:
   - Never mock or fake compiler output. All execution must interact with real local compilers.

3. **Memory & Process Safety**:
   - Any runner modifications must respect the timeout ceiling and process tree killing (`SIGKILL` / `TerminateJobObject`).
