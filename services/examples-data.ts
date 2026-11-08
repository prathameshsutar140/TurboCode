import { ExampleProgram } from '../src/types.js';

export const EXAMPLE_PROGRAMS: ExampleProgram[] = [
  // ================= C EXAMPLES =================
  {
    id: 'c-hello-world',
    title: 'Hello World',
    category: 'C',
    subCategory: 'Basics',
    difficulty: 'Beginner',
    description: 'The canonical C program demonstrating stdio.h, main function, and printf.',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Hello World
 * Standard: C99 / C11 / C17
 */

#include <stdio.h>

int main(void) {
    printf("========================================\\n");
    printf("  Welcome to TurboCode IDE!\\n");
    printf("  Hello, World from modern C!\\n");
    printf("========================================\\n");
    return 0;
}
`,
    expectedOutput: 'Welcome to TurboCode IDE!\nHello, World from modern C!'
  },
  {
    id: 'c-addition',
    title: 'Addition of Two Numbers',
    category: 'C',
    subCategory: 'Basics',
    difficulty: 'Beginner',
    description: 'Reading two integers using scanf and calculating their sum.',
    defaultInput: '15 27',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Addition of Two Numbers
 * Demonstrates standard input with scanf and formatted output.
 */

#include <stdio.h>

int main(void) {
    int num1, num2, sum;

    printf("Enter two integers separated by space: \\n");
    if (scanf("%d %d", &num1, &num2) == 2) {
        sum = num1 + num2;
        printf("First Number  : %d\\n", num1);
        printf("Second Number : %d\\n", num2);
        printf("Sum           : %d\\n", sum);
    } else {
        printf("Error: Invalid numeric input.\\n");
        return 1;
    }

    return 0;
}
`
  },
  {
    id: 'c-odd-even',
    title: 'Odd or Even Checker',
    category: 'C',
    subCategory: 'Control Flow',
    difficulty: 'Beginner',
    description: 'Determines whether an integer is even or odd using the modulo operator.',
    defaultInput: '42',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Check Even or Odd Number
 */

#include <stdio.h>

int main(void) {
    int n;
    printf("Enter an integer: \\n");
    if (scanf("%d", &n) != 1) {
        printf("Invalid input.\\n");
        return 1;
    }

    if (n % 2 == 0) {
        printf("%d is an EVEN number.\\n", n);
    } else {
        printf("%d is an ODD number.\\n", n);
    }

    return 0;
}
`
  },
  {
    id: 'c-prime-check',
    title: 'Prime Number Test',
    category: 'C',
    subCategory: 'Control Flow',
    difficulty: 'Beginner',
    description: 'Checks if a number is prime using square root optimization.',
    defaultInput: '29',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Prime Number Verification
 */

#include <stdio.h>
#include <stdbool.h>

bool isPrime(int n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;

    for (int i = 5; i * i <= n; i += 6) {
        if (n % i == 0 || n % (i + 2) == 0) {
            return false;
        }
    }
    return true;
}

int main(void) {
    int val;
    printf("Enter a positive integer: \\n");
    if (scanf("%d", &val) == 1) {
        if (isPrime(val)) {
            printf("%d is a PRIME number.\\n", val);
        } else {
            printf("%d is NOT a prime number.\\n", val);
        }
    }
    return 0;
}
`
  },
  {
    id: 'c-factorial',
    title: 'Factorial Calculation',
    category: 'C',
    subCategory: 'Recursion',
    difficulty: 'Beginner',
    description: 'Calculates factorial of a number using iterative and recursive techniques.',
    defaultInput: '7',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Factorial using Iteration & Recursion
 */

#include <stdio.h>

unsigned long long factorialRecursive(int n) {
    if (n <= 1) return 1;
    return n * factorialRecursive(n - 1);
}

int main(void) {
    int n;
    printf("Enter a non-negative integer (0-20): \\n");
    if (scanf("%d", &n) == 1) {
        if (n < 0 || n > 20) {
            printf("Value out of range for 64-bit integer.\\n");
            return 1;
        }

        unsigned long long result = factorialRecursive(n);
        printf("Factorial of %d (%d!) = %llu\\n", n, n, result);
    }
    return 0;
}
`
  },
  {
    id: 'c-fibonacci',
    title: 'Fibonacci Series',
    category: 'C',
    subCategory: 'Loops & Arrays',
    difficulty: 'Beginner',
    description: 'Generates the first N numbers of the Fibonacci sequence.',
    defaultInput: '10',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Fibonacci Sequence Generator
 */

#include <stdio.h>

int main(void) {
    int count;
    printf("Enter number of terms to generate (1 to 45): \\n");
    if (scanf("%d", &count) != 1 || count < 1) {
        printf("Invalid term count.\\n");
        return 1;
    }

    long long first = 0, second = 1, next;
    printf("Fibonacci Sequence (%d terms):\\n", count);

    for (int i = 1; i <= count; ++i) {
        printf("%lld ", first);
        next = first + second;
        first = second;
        second = next;
    }
    printf("\\n");
    return 0;
}
`
  },
  {
    id: 'c-palindrome',
    title: 'Palindrome String Check',
    category: 'C',
    subCategory: 'Strings',
    difficulty: 'Intermediate',
    description: 'Tests whether an input word reads the same forwards and backwards.',
    defaultInput: 'racecar',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Palindrome String Checker
 */

#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void) {
    char str[128];
    printf("Enter a word to test for palindrome: \\n");
    if (scanf("%127s", str) == 1) {
        int left = 0;
        int right = (int)strlen(str) - 1;
        int isPal = 1;

        while (left < right) {
            if (tolower(str[left]) != tolower(str[right])) {
                isPal = 0;
                break;
            }
            left++;
            right--;
        }

        if (isPal) {
            printf("\\"%s\\" IS a palindrome!\\n", str);
        } else {
            printf("\\"%s\\" is NOT a palindrome.\\n", str);
        }
    }
    return 0;
}
`
  },
  {
    id: 'c-array-ops',
    title: 'Array Operations & Search',
    category: 'C',
    subCategory: 'Arrays',
    difficulty: 'Intermediate',
    description: 'Finds min, max, average, and performs binary search on a sorted array.',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Array Statistics & Binary Search
 */

#include <stdio.h>

int binarySearch(const int arr[], int size, int target) {
    int low = 0, high = size - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main(void) {
    int data[] = { 12, 24, 37, 45, 59, 68, 77, 83, 91, 105 };
    int n = sizeof(data) / sizeof(data[0]);

    int min = data[0], max = data[0], sum = 0;
    for (int i = 0; i < n; i++) {
        if (data[i] < min) min = data[i];
        if (data[i] > max) max = data[i];
        sum += data[i];
    }

    printf("Dataset: ");
    for (int i = 0; i < n; i++) printf("%d ", data[i]);
    printf("\\n");
    printf("Count  : %d\\n", n);
    printf("Min    : %d\\n", min);
    printf("Max    : %d\\n", max);
    printf("Average: %.2f\\n", (double)sum / n);

    int query = 68;
    int idx = binarySearch(data, n, query);
    printf("Binary search for %d: Index %d\\n", query, idx);

    return 0;
}
`
  },
  {
    id: 'c-matrix-add',
    title: 'Matrix Operations (2D Arrays)',
    category: 'C',
    subCategory: 'Arrays',
    difficulty: 'Intermediate',
    description: 'Demonstrates 2D array representation and matrix addition.',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Matrix Addition (3x3)
 */

#include <stdio.h>

#define ROWS 3
#define COLS 3

void printMatrix(const char *name, int mat[ROWS][COLS]) {
    printf("%s:\\n", name);
    for (int r = 0; r < ROWS; r++) {
        printf("  [ ");
        for (int c = 0; c < COLS; c++) {
            printf("%3d ", mat[r][c]);
        }
        printf("]\\n");
    }
}

int main(void) {
    int A[ROWS][COLS] = {
        { 1, 2, 3 },
        { 4, 5, 6 },
        { 7, 8, 9 }
    };

    int B[ROWS][COLS] = {
        { 9, 8, 7 },
        { 6, 5, 4 },
        { 3, 2, 1 }
    };

    int C[ROWS][COLS];

    for (int r = 0; r < ROWS; r++) {
        for (int c = 0; c < COLS; c++) {
            C[r][c] = A[r][c] + B[r][c];
        }
    }

    printMatrix("Matrix A", A);
    printMatrix("Matrix B", B);
    printMatrix("Matrix A + B", C);

    return 0;
}
`
  },
  {
    id: 'c-pointers',
    title: 'Pointers & Dynamic Memory',
    category: 'C',
    subCategory: 'Memory & Pointers',
    difficulty: 'Advanced',
    description: 'Pointer arithmetic, dereferencing, and dynamic memory allocation with malloc and free.',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Pointer Mechanics and Heap Allocation
 */

#include <stdio.h>
#include <stdlib.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 100, y = 200;
    printf("Before swap: x=%d, y=%d\\n", x, y);
    swap(&x, &y);
    printf("After swap : x=%d, y=%d\\n\\n", x, y);

    // Dynamic memory allocation
    int capacity = 5;
    int *heapArray = (int *)malloc(capacity * sizeof(int));
    if (!heapArray) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    for (int i = 0; i < capacity; i++) {
        *(heapArray + i) = (i + 1) * 10;
    }

    printf("Dynamically allocated array on Heap:\\n");
    for (int i = 0; i < capacity; i++) {
        printf("  Address: %p | Value: %d\\n", (void*)(heapArray + i), heapArray[i]);
    }

    free(heapArray);
    heapArray = NULL;
    printf("Memory safely freed.\\n");

    return 0;
}
`
  },
  {
    id: 'c-structures',
    title: 'Structures (Student Records)',
    category: 'C',
    subCategory: 'Data Structures',
    difficulty: 'Intermediate',
    description: 'Defining struct types, typedef, array of structs, and calculating statistics.',
    code: `/*
 * TurboCode IDE - C Example
 * Program: Student Grade Records using Structures
 */

#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char name[32];
    float marks[3];
    float average;
} Student;

void computeAverage(Student *s) {
    float sum = 0.0f;
    for (int i = 0; i < 3; i++) {
        sum += s->marks[i];
    }
    s->average = sum / 3.0f;
}

int main(void) {
    Student roster[3] = {
        { 101, "Alice Smith",   { 88.5f, 92.0f, 95.5f }, 0.0f },
        { 102, "Bob Jones",     { 76.0f, 81.5f, 79.0f }, 0.0f },
        { 103, "Charlie Brown", { 94.0f, 89.0f, 91.5f }, 0.0f }
    };

    printf("================ STUDENT GRADE ROSTER ================\\n");
    printf("%-5s %-16s %-6s %-6s %-6s %-7s\\n", "ID", "Name", "M1", "M2", "M3", "Average");
    printf("------------------------------------------------------\\n");

    for (int i = 0; i < 3; i++) {
        computeAverage(&roster[i]);
        printf("%-5d %-16s %-6.1f %-6.1f %-6.1f %-7.2f\\n",
               roster[i].id, roster[i].name,
               roster[i].marks[0], roster[i].marks[1], roster[i].marks[2],
               roster[i].average);
    }
    printf("======================================================\\n");
    return 0;
}
`
  },
  {
    id: 'c-file-handling',
    title: 'File I/O (File Handling)',
    category: 'C',
    subCategory: 'File System',
    difficulty: 'Intermediate',
    description: 'Writing text data to a file on disk and reading it back using fopen, fprintf, and fgets.',
    code: `/*
 * TurboCode IDE - C Example
 * Program: File Writing and Reading Demo
 */

#include <stdio.h>

int main(void) {
    const char *filename = "turbocode_demo.txt";

    // 1. Write to file
    FILE *fp = fopen(filename, "w");
    if (!fp) {
        perror("Error opening file for write");
        return 1;
    }

    fprintf(fp, "TurboCode IDE C File I/O Demonstration\\n");
    fprintf(fp, "Line 1: Borland Turbo C++ Heritage\\n");
    fprintf(fp, "Line 2: Modern Real GCC Compilation\\n");
    fclose(fp);
    printf("Data written successfully to %s\\n\\n", filename);

    // 2. Read back from file
    fp = fopen(filename, "r");
    if (!fp) {
        perror("Error opening file for read");
        return 1;
    }

    printf("Contents of %s:\\n----------------------------------\\n", filename);
    char buffer[256];
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("%s", buffer);
    }
    printf("----------------------------------\\n");
    fclose(fp);

    return 0;
}
`
  },

  // ================= C++ EXAMPLES =================
  {
    id: 'cpp-hello-world',
    title: 'Modern C++ Hello World',
    category: 'C++',
    subCategory: 'Basics',
    difficulty: 'Beginner',
    description: 'Standard modern C++ stream output with std::cout and std::format / modern concepts.',
    code: `// TurboCode IDE - C++ Example: Modern Hello World
#include <iostream>
#include <string>
#include <string_view>

void greet(std::string_view name) {
    std::cout << "Hello, " << name << "! Welcome to TurboCode IDE C++." << std::endl;
}

int main() {
    greet("Developer");
    std::cout << "C++ Standard: " << __cplusplus << std::endl;
    return 0;
}
`
  },
  {
    id: 'cpp-classes-objects',
    title: 'Classes and Objects',
    category: 'C++',
    subCategory: 'OOP',
    difficulty: 'Beginner',
    description: 'Object-oriented programming with encapsulation, methods, and member initializers.',
    code: `// TurboCode IDE - C++ Example: Classes and Objects
#include <iostream>
#include <string>

class BankAccount {
private:
    std::string accountNumber;
    std::string ownerName;
    double balance;

public:
    BankAccount(std::string accNum, std::string owner, double initialDeposit)
        : accountNumber(std::move(accNum)), ownerName(std::move(owner)), balance(initialDeposit) {}

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            std::cout << "Deposited $" << amount << ". New Balance: $" << balance << "\\n";
        }
    }

    bool withdraw(double amount) {
        if (amount > balance) {
            std::cout << "Withdrawal failed: Insufficient funds.\\n";
            return false;
        }
        balance -= amount;
        std::cout << "Withdrew $" << amount << ". New Balance: $" << balance << "\\n";
        return true;
    }

    void displayInfo() const {
        std::cout << "Account: " << accountNumber 
                  << " | Owner: " << ownerName 
                  << " | Balance: $" << balance << "\\n";
    }
};

int main() {
    BankAccount account("TC-9921", "Sarah Connor", 500.0);
    account.displayInfo();
    account.deposit(250.0);
    account.withdraw(120.0);
    account.withdraw(999.0);
    account.displayInfo();
    return 0;
}
`
  },
  {
    id: 'cpp-constructors',
    title: 'Constructors & Destructors (RAII)',
    category: 'C++',
    subCategory: 'OOP',
    difficulty: 'Intermediate',
    description: 'Demonstrates default, parameterized, copy constructors, and RAII automatic destructor cleanup.',
    code: `// TurboCode IDE - C++ Example: Constructors, Destructors, and RAII
#include <iostream>
#include <string>

class ResourceHolder {
private:
    std::string resourceName;

public:
    // Parameterized constructor
    explicit ResourceHolder(std::string name) : resourceName(std::move(name)) {
        std::cout << "[ACQUIRE] Resource '" << resourceName << "' allocated.\\n";
    }

    // Destructor
    ~ResourceHolder() {
        std::cout << "[RELEASE] Resource '" << resourceName << "' cleanly destroyed.\\n";
    }

    void use() const {
        std::cout << "  Using resource: " << resourceName << "\\n";
    }
};

int main() {
    std::cout << "Entering main scope...\\n";
    {
        ResourceHolder localRes("Database Connection Pool");
        localRes.use();
        std::cout << "Exiting inner block scope...\\n";
    }
    std::cout << "Inner block has exited. Returning from main.\\n";
    return 0;
}
`
  },
  {
    id: 'cpp-inheritance',
    title: 'Inheritance & Hierarchy',
    category: 'C++',
    subCategory: 'OOP',
    difficulty: 'Intermediate',
    description: 'Base class and derived classes showcasing code reuse and protected members.',
    code: `// TurboCode IDE - C++ Example: Single & Multiple Inheritance
#include <iostream>
#include <string>

class Vehicle {
protected:
    std::string brand;
    int year;

public:
    Vehicle(std::string b, int y) : brand(std::move(b)), year(y) {}

    void honk() const {
        std::cout << brand << " says: Beep Beep!\\n";
    }
};

class ElectricCar : public Vehicle {
private:
    int batteryCapacityKWh;

public:
    ElectricCar(std::string b, int y, int battery)
        : Vehicle(std::move(b), y), batteryCapacityKWh(battery) {}

    void printSpecs() const {
        std::cout << "Electric Car: " << year << " " << brand 
                  << " (" << batteryCapacityKWh << " kWh battery)\\n";
    }
};

int main() {
    ElectricCar tesla("CyberTruck", 2024, 123);
    tesla.printSpecs();
    tesla.honk();
    return 0;
}
`
  },
  {
    id: 'cpp-polymorphism',
    title: 'Polymorphism & Virtual Functions',
    category: 'C++',
    subCategory: 'OOP',
    difficulty: 'Intermediate',
    description: 'Runtime polymorphism via abstract base class, virtual destructor, and override methods.',
    code: `// TurboCode IDE - C++ Example: Virtual Functions & Polymorphism
#include <iostream>
#include <vector>
#include <memory>

class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0; // Pure virtual function
    virtual void draw() const = 0;
};

class Circle : public Shape {
    double radius;
public:
    explicit Circle(double r) : radius(r) {}
    double area() const override { return 3.14159265 * radius * radius; }
    void draw() const override {
        std::cout << "Circle (r=" << radius << ") -> Area: " << area() << "\\n";
    }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override { return width * height; }
    void draw() const override {
        std::cout << "Rectangle (" << width << "x" << height << ") -> Area: " << area() << "\\n";
    }
};

int main() {
    std::vector<std::unique_ptr<Shape>> shapes;
    shapes.push_back(std::make_unique<Circle>(5.0));
    shapes.push_back(std::make_unique<Rectangle>(4.0, 6.0));
    shapes.push_back(std::make_unique<Circle>(2.5));

    std::cout << "Polymorphic Shape Roster:\\n";
    for (const auto& shape : shapes) {
        shape->draw();
    }
    return 0;
}
`
  },
  {
    id: 'cpp-operator-overloading',
    title: 'Operator Overloading',
    category: 'C++',
    subCategory: 'OOP',
    difficulty: 'Intermediate',
    description: 'Overloading + and << operators for a 2D Vector coordinate class.',
    code: `// TurboCode IDE - C++ Example: Operator Overloading
#include <iostream>

class Vector2D {
public:
    double x;
    double y;

    Vector2D(double x_val = 0.0, double y_val = 0.0) : x(x_val), y(y_val) {}

    // Overload + operator
    Vector2D operator+(const Vector2D& other) const {
        return Vector2D(x + other.x, y + other.y);
    }

    // Overload == operator
    bool operator==(const Vector2D& other) const {
        return (x == other.x) && (y == other.y);
    }

    // Stream insertion operator <<
    friend std::ostream& operator<<(std::ostream& os, const Vector2D& v) {
        os << "(" << v.x << ", " << v.y << ")";
        return os;
    }
};

int main() {
    Vector2D v1(3.5, 2.0);
    Vector2D v2(1.5, 4.5);
    Vector2D v3 = v1 + v2;

    std::cout << "Vector 1 : " << v1 << "\\n";
    std::cout << "Vector 2 : " << v2 << "\\n";
    std::cout << "v1 + v2  : " << v3 << "\\n";
    return 0;
}
`
  },
  {
    id: 'cpp-templates',
    title: 'Templates (Generic Programming)',
    category: 'C++',
    subCategory: 'Generic Programming',
    difficulty: 'Intermediate',
    description: 'Function templates and class templates for type-independent data structures.',
    code: `// TurboCode IDE - C++ Example: Generic Templates
#include <iostream>
#include <string>

// Function template
template <typename T>
T findMax(T a, T b) {
    return (a > b) ? a : b;
}

// Class template
template <typename T, int Capacity = 10>
class FixedStack {
private:
    T elements[Capacity];
    int top = -1;

public:
    bool push(T item) {
        if (top >= Capacity - 1) return false;
        elements[++top] = item;
        return true;
    }

    T pop() {
        return elements[top--];
    }

    bool empty() const { return top == -1; }
};

int main() {
    std::cout << "Max of 15 and 42: " << findMax(15, 42) << "\\n";
    std::cout << "Max of 3.14 and 2.71: " << findMax(3.14, 2.71) << "\\n";

    FixedStack<std::string, 5> stringStack;
    stringStack.push("Turbo");
    stringStack.push("C++");
    stringStack.push("IDE");

    std::cout << "Popping from generic stack: ";
    while (!stringStack.empty()) {
        std::cout << stringStack.pop() << " ";
    }
    std::cout << "\\n";
    return 0;
}
`
  },
  {
    id: 'cpp-stl-vector',
    title: 'STL Vectors & Algorithms',
    category: 'C++',
    subCategory: 'Standard Template Library',
    difficulty: 'Beginner',
    description: 'Using std::vector with std::sort, std::find, and range-based for loops.',
    code: `// TurboCode IDE - C++ Example: STL Vector & Algorithms
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

int main() {
    std::vector<int> numbers = { 64, 34, 25, 12, 22, 11, 90 };

    std::cout << "Original vector: ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << "\\n";

    // Sort ascending
    std::sort(numbers.begin(), numbers.end());

    std::cout << "Sorted vector  : ";
    for (int n : numbers) std::cout << n << " ";
    std::cout << "\\n";

    // Compute sum using std::accumulate
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "Total Sum      : " << sum << "\\n";

    // Adding dynamic elements
    numbers.push_back(100);
    std::cout << "Capacity after push: " << numbers.capacity() << "\\n";
    return 0;
}
`
  },
  {
    id: 'cpp-stl-stack-queue',
    title: 'STL Stack & Queue',
    category: 'C++',
    subCategory: 'Standard Template Library',
    difficulty: 'Intermediate',
    description: 'Demonstrating LIFO stack and FIFO queue container adapters.',
    code: `// TurboCode IDE - C++ Example: STL Stack and Queue
#include <iostream>
#include <stack>
#include <queue>
#include <string>

int main() {
    // 1. Stack (LIFO)
    std::stack<std::string> undoStack;
    undoStack.push("Type 'int main()'");
    undoStack.push("Add '#include <iostream>'");
    undoStack.push("Insert return 0;");

    std::cout << "--- Undo Stack (LIFO) ---\\n";
    while (!undoStack.empty()) {
        std::cout << "Undo: " << undoStack.top() << "\\n";
        undoStack.pop();
    }

    // 2. Queue (FIFO)
    std::queue<std::string> printJobs;
    printJobs.push("Project_Proposal.pdf");
    printJobs.push("Invoice_1042.pdf");
    printJobs.push("Compiler_Log.txt");

    std::cout << "\\n--- Print Queue (FIFO) ---\\n";
    while (!printJobs.empty()) {
        std::cout << "Processing: " << printJobs.front() << "\\n";
        printJobs.pop();
    }

    return 0;
}
`
  },
  {
    id: 'cpp-exceptions',
    title: 'Exception Handling (try / catch)',
    category: 'C++',
    subCategory: 'Error Handling',
    difficulty: 'Intermediate',
    description: 'Custom exception class derived from std::exception, throwing and catching errors safely.',
    code: `// TurboCode IDE - C++ Example: Exception Handling
#include <iostream>
#include <stdexcept>
#include <string>

class DivisionByZeroException : public std::runtime_error {
public:
    DivisionByZeroException() 
        : std::runtime_error("Math Error: Attempted division by zero!") {}
};

double divide(double numerator, double denominator) {
    if (denominator == 0.0) {
        throw DivisionByZeroException();
    }
    return numerator / denominator;
}

int main() {
    double tests[][2] = { { 20.0, 4.0 }, { 15.0, 0.0 }, { 50.0, 2.0 } };

    for (const auto& test : tests) {
        try {
            std::cout << "Dividing " << test[0] << " / " << test[1] << "...\\n";
            double res = divide(test[0], test[1]);
            std::cout << "Result: " << res << "\\n\\n";
        } catch (const DivisionByZeroException& ex) {
            std::cerr << "Caught Custom Exception: " << ex.what() << "\\n\\n";
        } catch (const std::exception& ex) {
            std::cerr << "Standard Exception: " << ex.what() << "\\n\\n";
        }
    }
    return 0;
}
`
  }
];
