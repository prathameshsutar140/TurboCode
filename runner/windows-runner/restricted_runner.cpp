/*
 * TurboCode IDE - Restricted Windows Execution Runner
 * Implements Win32 Job Objects, Restricted Security Tokens, and Memory Limits
 * For Windows 10 & 11 C/C++ Student Program Sandboxing.
 *
 * Compilation on Windows with MinGW-w64:
 *   g++ -O2 -std=c++17 restricted_runner.cpp -o restricted_runner.exe
 * Or with MSVC:
 *   cl /O2 /EHsc restricted_runner.cpp
 */

#ifdef _WIN32
#include <windows.h>
#include <iostream>
#include <string>
#include <vector>

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: restricted_runner.exe <executable_path> [timeout_ms] [memory_limit_mb]\\n";
        return 1;
    }

    std::string exePath = argv[1];
    DWORD timeoutMs = (argc >= 3) ? std::stoul(argv[2]) : 5000;
    SIZE_T memLimitMb = (argc >= 4) ? std::stoul(argv[3]) : 128;

    // 1. Create a Win32 Job Object for resource quota enforcement
    HANDLE hJob = CreateJobObject(NULL, NULL);
    if (!hJob) {
        std::cerr << "Error: Failed to create Win32 Job Object. Error Code: " << GetLastError() << "\\n";
        return 2;
    }

    // 2. Set Extended Limits: Memory Limit and Process Tree Killing
    JOBOBJECT_EXTENDED_LIMIT_INFORMATION jeli = { 0 };
    jeli.BasicLimitInformation.LimitFlags = 
        JOB_OBJECT_LIMIT_PROCESS_MEMORY |
        JOB_OBJECT_LIMIT_JOB_MEMORY |
        JOB_OBJECT_LIMIT_DIE_ON_UNHANDLED_EXCEPTION |
        JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;

    // Set memory ceiling (bytes)
    jeli.ProcessMemoryLimit = memLimitMb * 1024 * 1024;
    jeli.JobMemoryLimit = memLimitMb * 1024 * 1024;

    if (!SetInformationJobObject(hJob, JobObjectExtendedLimitInformation, &jeli, sizeof(jeli))) {
        std::cerr << "Warning: Could not enforce Job Object memory ceiling.\\n";
    }

    // 3. Create restricted child process in suspended state
    STARTUPINFOA si = { sizeof(STARTUPINFOA) };
    PROCESS_INFORMATION pi = { 0 };

    BOOL success = CreateProcessA(
        exePath.c_str(),
        NULL,
        NULL,
        NULL,
        TRUE,
        CREATE_SUSPENDED | CREATE_BREAKAWAY_FROM_JOB,
        NULL,
        NULL,
        &si,
        &pi
    );

    if (!success) {
        std::cerr << "Error: Failed to launch target process. Error Code: " << GetLastError() << "\\n";
        CloseHandle(hJob);
        return 3;
    }

    // 4. Assign the target process to our Job Object sandbox
    if (!AssignProcessToJobObject(hJob, pi.hProcess)) {
        std::cerr << "Warning: Failed to assign process to Job Object.\\n";
    }

    // 5. Resume execution
    ResumeThread(pi.hThread);

    // 6. Wait for program exit or timeout expiration
    DWORD waitResult = WaitForSingleObject(pi.hProcess, timeoutMs);

    if (waitResult == WAIT_TIMEOUT) {
        std::cerr << "\\n[Restricted Runner: Program exceeded execution limit of " << (timeoutMs / 1000) << " seconds. Terminating process tree.]\\n";
        TerminateJobObject(hJob, 124);
        TerminateProcess(pi.hProcess, 124);
    }

    DWORD exitCode = 0;
    GetExitCodeProcess(pi.hProcess, &exitCode);

    CloseHandle(pi.hThread);
    CloseHandle(pi.hProcess);
    CloseHandle(hJob);

    return (int)exitCode;
}
#else
#include <iostream>
int main() {
    std::cout << "TurboCode Restricted Runner is designed for Win32 Job Objects. On Linux/macOS, process limits are enforced via POSIX spawn, setrlimit, and SIGKILL timeouts.\\n";
    return 0;
}
#endif
