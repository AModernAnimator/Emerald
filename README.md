<img src="emer.png" width="50" alt="logo"/> Emerald
===============
**© Copyright 2026 Emerald**

---

[![badgey badge](https://img.shields.io/badge/Emerald-Latest-rgb#0fba81)](https://github.com/AModernAnimator/Emerald/releases/tag/Emerald)

---

> Emerald is a high-level compiled programming language written in Golang, created by **@AModernAnimator** & **@Sushi-byte-glitch**. It is designed for **backend**, **frontend**, and **data**.

# Emerald Language Specification (v0.2)

Emerald is a line-oriented, interpreted scripting language with a simple syntax, stack-based VM, and support for functions, loops, variables, expressions, and built-in types.

This document defines the **surface syntax**, **keywords**, **statements**, **expressions**, and **built-in operations** for Emerald, based on the current compiler (`emeraldc.go`).

---

## 1. Files

* **Source files:** `.emer`
* **Compiled bytecode:** `.emc` (cache for VM execution)

---

## 2. Lexical Rules

* **Line-oriented:** Each statement is one line.
* **Comments:** Start with `#` or `--`, run to end of line.
* **Identifiers:** ASCII letters, digits, and `_`; must not start with a digit.
* **Strings:** Single `'...'` or double `"..."` quotes.
* **Blocks:** `{ ... }`
* **Operators:** `+`, `-`, `*`, `/`, `<`, `>`, `==`, `!=`, `and`, `or`, `not`

---

## 3. Keywords

| Emerald  | Meaning                           |
| -------- | --------------------------------- |
| `var`    | Declare a variable                |
| `fnc`    | Declare a function                |
| `return` | Return from a function            |
| `brk`    | Break loop                        |
| `cont`   | Continue loop                     |
| `for`    | For loop                          |
| `while`  | While loop                        |
| `print`  | Print value                       |
| `input`  | Read user input into `LAST_INPUT` |
| `check`  | Assert expression is truthy       |

> Note: Additional keywords like `if`, `else`, `switch`, `struct`, `const`, `type`, `use`, etc., are reserved for future expansion and are not yet implemented.

---

## 4. Data Types

Emerald supports the following types:

| Type     | Literal                           | Notes              |
| -------- | --------------------------------- | ------------------ |
| `int`    | `123`, `0`, `-42`                 | Integer numbers    |
| `string` | `"hello"`, `'world'`              | String literals    |
| `bool`   | `true`, `false`                   | Boolean            |
| `null`   | `null`                            | Null / empty value |
| `list`   | `[1, 2, 3]`                       | Ordered collection |
| `dict`   | `table("key1", 123, "key2", 456)` | Key-value map      |

Variables may be declared with optional type annotations:

```emer
var name(int)=(123)
var name(str)=("Ada")
var {a(int)=(1), b(str)=("text")}
```

> Type annotations are **stored but not enforced** by the compiler.

---

## 5. Statements

### 5.1 Variable Declaration

```emer
var x(int) = (42)
var name(str) = ("Ada")
var {a(int)=(1), b(str)=("hello")}
```

* Assignments may be omitted: `var x` → `x = null`.
* Block form `{ ... }` allows multiple declarations in one statement.

### 5.2 Function Declaration

```emer
fnc greet {
    print("Hello!")
    print(name)
    return
}

fnc add(a, b) {
    return a + b
}
```

* Functions may have zero or more parameters.
* `return` or `return expr` ends the function.

### 5.3 Function Calls

```emer
greet()
sum = add(1, 2)
```

* Arguments are pushed in order, left to right.

### 5.4 Loops

#### For Loop

```emer
for(true) { ... }
for(i < 10) { ... }
```

* `for(true)` is an infinite loop.
* Supports `brk` and `cont`.

#### While Loop

```emer
while(x < 10) { ... }
```

* Evaluates condition before each iteration.
* Supports `brk` and `cont`.

---

### 5.5 Control Flow

* `brk` → exit current loop
* `cont` → continue current loop
* `return [expr]` → exit function (with optional return value)

---

### 5.6 Built-in Operations

| Operation              | Usage                                                        |
| ---------------------- | ------------------------------------------------------------ |
| `print(expr)`          | Print value to stdout                                        |
| `input(plc("prompt"))` | Read user input; stores in `LAST_INPUT`                      |
| `wait(ms)`             | Pause execution in milliseconds                              |
| `check expr`           | Assert that `expr` is truthy; raises runtime error otherwise |

---

## 6. Expressions

Expressions support:

* Literals: integers, strings, booleans, `null`
* Arithmetic: `+`, `-`, `*`, `/`
* Comparison: `==`, `!=`, `<`, `>`
* Boolean logic: `and`, `or`, `not`
* Grouping: `(expr)`
* Lists: `[expr1, expr2, ...]`
* Function calls: `name(arg1, arg2)`

Example:

```emer
x = 1 + 2 * (3 - 4)
y = "Hello " + name
z = [1, 2, 3]
valid = true and not false
```

---

## 7. Lists and Dictionaries

### 7.1 Lists

```emer
numbers = [1, 2, 3]
combined = [1] + [2, 3]  # concatenation
```

### 7.2 Dictionaries (Maps)

```emer
person = table("name", "Ada", "age", 19)
```

* Keys are strings (or stringified values).
* Values may be any Emerald type.

---

## 8. Example Program

```emer
# Declare variables
var {name(str)=("Ada"), age(int)=(19)}

# Function declaration
fnc greet {
    print("Hello!")
    print(name)
    return
}

# Loop
for(true) {
    greet()
    check age
    brk
}

# Arithmetic and list
var nums = [1, 2, 3]
var sum = 0
for(i < len(nums)) {
    sum = sum + nums[i]
}
print(sum)
```

---

## 9. Notes

* Type annotations are **optional** and not enforced.
* Loops support `brk` and `cont` with `for` and `while`.
* Functions support local parameters and return values.
* `table` creates a dictionary; lists are native.
* Emerald uses a **stack-based VM** internally; expressions are compiled into bytecode (`.emc`).
* Reserved keywords (like `if`, `else`, `switch`) may be implemented in future versions.

---

✅ **This spec covers all currently implemented Emerald features** as of compiler v0.2.
