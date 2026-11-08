# C and C++ Language Standards Guide in TurboCode IDE

TurboCode IDE allows students and engineers to configure specific ISO C and ISO C++ standards. This guide outlines standard differences, flags, and feature availability.

---

## 1. C Language Standards

Configure via **Settings -> Compiler -> C Language Standard** or toolbar options.

| Standard | GCC Flag | Release Year | Key Features |
|---|---|---|---|
| **C90 / ANSI C** | `-std=c90` | 1989/1990 | Original ANSI/ISO standardized C. Function prototypes, `const`, `volatile`, standard library `<stdio.h>`, `<stdlib.h>`. |
| **C99** | `-std=c99` | 1999 | `//` single-line comments, inline functions, variable-length arrays (VLAs), `<stdbool.h>`, `<stdint.h>` fixed-width types (`int32_t`, `uint64_t`), `long long int`. |
| **C11** | `-std=c11` | 2011 | Multi-threading support (`<threads.h>`), atomic operations (`<stdatomic.h>`), generic selections (`_Generic`), bounds-checking interfaces. |
| **C17 (Default)** | `-std=c17` | 2018 | Defect-fix release for C11. Addresses technical corrigenda without introducing breaking changes. Recommended for all modern C development. |

---

## 2. C++ Language Standards

Configure via **Settings -> Compiler -> C++ Language Standard**.

| Standard | G++ Flag | Release Year | Key Features |
|---|---|---|---|
| **C++11** | `-std=c++11` | 2011 | Modern C++ revolution: `auto` type deduction, lambda expressions, rvalue references & move semantics, range-based `for` loops, `nullptr`, `std::unique_ptr`, `std::shared_ptr`. |
| **C++14** | `-std=c++14` | 2014 | Generic lambdas, relaxed `constexpr` functions, variable templates, `std::make_unique`. |
| **C++17** | `-std=c++17` | 2017 | Structured bindings (`auto [x, y] = pair`), `std::optional`, `std::variant`, `std::string_view`, filesystem library (`<filesystem>`), `if constexpr`. |
| **C++20 (Default)** | `-std=c++20` | 2020 | Concepts (`template<typename T> requires`), Ranges (`std::ranges`), Coroutines, Spaceship operator (`<=>`), `std::format`, Modules (`import`). |

---

## 3. Practical Standard Comparison Examples

### C90 vs. C99 Variable Declarations
- **C90**: All variables in a block had to be declared at the very top:
  ```c
  int main(void) {
      int i; /* Must be declared first */
      printf("Start\n");
      for (i = 0; i < 5; i++) { ... }
  }
  ```
- **C99 / C17**: Variables can be declared anywhere, including loop headers:
  ```c
  int main(void) {
      printf("Start\n");
      for (int i = 0; i < 5; i++) { ... }
  }
  ```

### C++03 vs. C++11 vs. C++20 Traversal
- **C++03**:
  ```cpp
  for (std::vector<int>::const_iterator it = vec.begin(); it != vec.end(); ++it) { ... }
  ```
- **C++11**:
  ```cpp
  for (const auto& item : vec) { ... }
  ```
- **C++20 Ranges**:
  ```cpp
  for (const auto& item : vec | std::views::filter([](int n) { return n % 2 == 0; })) { ... }
  ```
