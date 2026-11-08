# Windows Toolchain Setup Guide (MinGW-w64 via MSYS2)

TurboCode IDE connects directly to your installed system compilers. On Windows 10 and Windows 11, the recommended toolchain is **MinGW-w64 (UCRT64)** provided through **MSYS2**.

---

## Step 1: Download & Install MSYS2

1. Download the MSYS2 installer from [msys2.org](https://www.msys2.org/).
2. Run the installer and accept the default installation path: `C:\msys64`.
3. Complete the setup and launch the **MSYS2 UCRT64** terminal.

---

## Step 2: Install GCC, G++, GDB, and Make

Inside the **MSYS2 UCRT64** terminal, update the package database and install the toolchain:

```bash
# 1. Update package database and core system
pacman -Syu

# 2. Install GCC, G++, GDB, Make, and CMake
pacman -S --needed base-devel mingw-w64-ucrt-x86_64-toolchain mingw-w64-ucrt-x86_64-gdb mingw-w64-ucrt-x86_64-cmake
```

When prompted `Enter a selection (default=all):`, press **Enter** to install all packages.

---

## Step 3: Add MinGW-w64 to the Windows System PATH

To allow TurboCode IDE (and Windows Command Prompt / PowerShell) to run `gcc` and `g++`:

1. Press `Win + R`, type `sysdm.cpl`, and press **Enter** (opens System Properties).
2. Go to the **Advanced** tab -> Click **Environment Variables...**.
3. Under **User variables** (or **System variables**), select `Path` and click **Edit...**.
4. Click **New** and add:
   ```text
   C:\msys64\ucrt64\bin
   ```
5. Click **OK** on all dialogs to save.

---

## Step 4: Verify in Windows Command Prompt

Open a new Command Prompt (`cmd`) or PowerShell window and run:

```cmd
gcc --version
g++ --version
gdb --version
make --version
```

If successful, each command will output the GNU version string (e.g. `gcc (Rev..., Built by MSYS2 project) 13.x.x`).

---

## Troubleshooting Common Windows Issues

### 1. "gcc is not recognized as an internal or external command"
- Ensure `C:\msys64\ucrt64\bin` is added to your PATH.
- Restart TurboCode IDE or your terminal after updating PATH so the environment reload takes effect.

### 2. Missing DLL errors (`libgcc_s_seh-1.dll`, `libstdc++-6.dll`)
- These runtime DLLs reside in `C:\msys64\ucrt64\bin`. As long as that directory is on your PATH, all compiled binaries can run without missing DLL warnings.
- Alternatively, compile with `-static` in TurboCode IDE Settings -> Custom Flags.

### 3. Antivirus False Positives
- Some Windows Defender heuristics flag freshly compiled student binaries. If execution fails with permission errors, add an exclusion for `/tmp/turbocode_builds/` or your project workspace folder in Windows Security settings.
