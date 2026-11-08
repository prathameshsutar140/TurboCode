# TurboCode IDE – Professional Windows C/C++ Development Environment

TurboCode IDE is a professional C and C++ programming environment inspired by the classic **Borland Turbo C++ 3.0** aesthetic, augmented with modern compilation pipelines, Monaco code editor, sandboxed process execution, and educational tools.

---

## 1. System Requirements & Architecture

- **Operating Systems**: Windows 10 & Windows 11 (Desktop), Linux (Development & Web Container)
- **Compilers Supported**: GCC (C90, C99, C11, C17), G++ (C++11, C++14, C++17, C++20), LLVM/Clang
- **Core Stack**: Electron, Node.js v20+, TypeScript, Monaco Editor, Win32 Job Objects Runner

---

## 2. Windows Toolchain Installation (MSYS2 MinGW-w64)

To compile and run real C and C++ applications on Windows:

### Step 1: Install MSYS2
1. Download the MSYS2 installer from [msys2.org](https://www.msys2.org/).
2. Run the installer and complete the setup wizard.

### Step 2: Install the UCRT64 GCC & G++ Toolchain
Open the **MSYS2 UCRT64** terminal and run:
```bash
pacman -Syu
pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain mingw-w64-ucrt-x86_64-gdb mingw-w64-ucrt-x86_64-cmake
```

### Step 3: Add MinGW-w64 to your Windows PATH
1. In Windows Search, type `Environment Variables` and select **Edit the system environment variables**.
2. Click **Environment Variables...** -> Select `Path` under User variables -> Click **Edit**.
3. Add: `C:\msys64\ucrt64\bin`.
4. Open Windows Command Prompt (`cmd`) and verify:
   ```cmd
   gcc --version
   g++ --version
   gdb --version
   ```

---

## 3. Project Installation & Development

### A. Install Node.js
Download and install Node.js (v20 or v22 LTS) from [nodejs.org](https://nodejs.org/).

### B. Install Dependencies
Clone the repository and install packages:
```bash
git clone https://github.com/turbocode-ide/turbocode-ide.git
cd turbocode-ide
npm install
```

### C. Run the Application in Development
Start the full-stack development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

To run inside Electron desktop mode:
```bash
npm run electron:dev
```

---

## 4. How to Test C and C++ Programs

### Testing a C Program:
1. Open TurboCode IDE.
2. In the Left Sidebar, select **Examples** -> **C** -> **Prime Number Test** or **Array Operations**.
3. Press **F2** (or click **Compile**). Check the **Problems** tab to ensure 0 errors.
4. If the program expects input (such as `scanf`), navigate to the **STDIN Input** tab and enter test numbers (e.g., `29`).
5. Press **F5** (or click **Run**). The Output Console displays:
   ```
   29 is a PRIME number.
   [Exit Code: 0 | Duration: 4ms]
   ```
6. Alternatively, press **F6** for **Compile & Run** in a single stroke!

### Testing a C++ Program:
1. Select **New C++ File** (+ .cpp) or open **C++** -> **Classes and Objects** or **STL Vector**.
2. Press **F6** (Compile & Run).
3. View the program's output, memory statistics, and runtime duration in the console.

---

## 5. Building the Windows Desktop Installer

TurboCode IDE uses `electron-builder` to produce both NSIS installers and standalone portable executables.

### Building NSIS Installer (.exe):
```bash
# 1. Build frontend and server assets
npm run build

# 2. Package Windows 64-bit installer
npm run dist:win
```
The output will be generated inside the `dist-electron/` folder:
- `TurboCode IDE Setup 2.4.0.exe` (Windows Installer)
- `TurboCode IDE 2.4.0.exe` (Portable executable)

---

## 6. Restricted Execution Runner & Sandboxing

Student programs must not execute unrestricted on the host OS. TurboCode IDE provides a dedicated sandboxing architecture:

- **Windows Runner (`runner/windows-runner/restricted_runner.cpp`)**:
  - Employs Win32 **Job Objects** (`CreateJobObject`, `SetInformationJobObject`).
  - Limits process memory ceiling (default: 128 MB).
  - Enforces hard execution timeouts (default: 5.0 seconds).
  - Auto-terminates child process trees upon timeout or crash (`JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE`).
- **Linux / Container Runner (`services/runner-service.ts`)**:
  - Sandboxes execution in separate `/tmp/turbocode_builds/<build_id>/` working directories.
  - Prevents denial-of-service through output stream caps (256 KB max stdout).
  - Captures `SIGSEGV` (Segmentation Fault), `SIGFPE` (Division by zero), and `SIGABRT` signals.

---

## 7. Keyboard Shortcuts Guide

| Shortcut | Description |
|---|---|
| **F2** or **Alt+F9** | Compile active source file with GCC/G++ |
| **F5** or **Ctrl+F9** | Run compiled executable |
| **F6** | Compile & Run (All-in-One) |
| **Shift + F5** | Stop running execution & kill process tree |
| **Ctrl + S** | Save current active file |
| **Ctrl + N** | Create new C source file |
| **Ctrl + W** | Close active editor tab |
| **Ctrl + `** | Toggle Bottom Output / Diagnostics Panel |
| **F1** | Open Keyboard Shortcuts Reference |
