# C++ Core Guidelines

Source: *C++ Core Guidelines*, edited by Bjarne Stroustrup and Herb
Sutter (`isocpp/CppCoreGuidelines`). The most comprehensive, actively
maintained set of modern C++ guidance; this doc summarizes the
highest-impact rules per section using their official rule IDs (e.g.
`C.7`) so you can look up the full rationale/examples/enforcement
notes in the source document by ID.
_____________________________________

## P: Philosophy
1. P.1 Express ideas directly in code.
2. P.2 Write in ISO Standard C++ (no un-encapsulated extensions).
3. P.3 Express intent — say what should be done, not just how.
4. P.4 Ideally, a program should be statically type safe.
5. P.5 Prefer compile-time checking to run-time checking.
6. P.6 What cannot be checked at compile time should be checkable at run time.
7. P.7 Catch run-time errors early.
8. P.8 Don't leak any resources.
9. P.9 Don't waste time or space.
10. P.10 Prefer immutable data to mutable data.
11. P.11 Encapsulate messy constructs, rather than spreading through the code.
12. P.12 Use supporting tools (static analyzers, sanitizers) as appropriate.
13. P.13 Use support libraries (GSL, standard library) as appropriate.

## I: Interfaces
1. I.1 Make interfaces explicit (don't rely on implicit assumptions caller/callee both "just know").
2. I.2 Avoid non-`const` global variables.
3. I.4 Make interfaces precisely and strongly typed, rather than accepting a weakly-typed blob (`void*`, raw array + length pairs).
4. I.5–I.8 State preconditions/postconditions where possible (`Expects`, `Ensures`); prefer contracts over comments.
5. I.11 Never transfer ownership by a raw pointer (`T*`) or reference (`T&`) — use `owner<T*>`/smart pointers to make ownership explicit.
6. I.13 Do not pass an array as a single pointer — use `span<T>` to carry bounds information with it.
7. I.23 Keep the number of function arguments low.
8. I.26 If you want a cross-compiler ABI, use a C-style subset.

## F: Functions
1. F.1 "Package" meaningful operations as carefully named functions.
2. F.2 A function should perform a single logical operation.
3. F.3 Keep functions short and simple.
4. F.4 If a function can be evaluated at compile time, declare it `constexpr`.
5. F.6 If your function must not throw, declare it `noexcept`.
6. F.15 Prefer simple and conventional ways of passing information (by value for small types, `const&` for larger read-only, `&` for in-out, return by value instead of out-params where possible).
7. F.16 For "in" parameters, pass cheaply-copied types by value and others by `const&`.
8. F.20 For "out" output values, prefer return values to output parameters.
9. F.42 Return a `T*` only to indicate a position (not transfer ownership).
10. F.51 Where there is a choice, prefer default arguments over overloading.
11. F.52/F.53 Prefer capturing by reference in lambdas that will be used locally/synchronously; avoid capturing by reference in lambdas that will escape the local scope (prefer capture by value/forwarding there).

## C: Classes and class hierarchies
1. C.2 Use `class` if the class has an invariant; use `struct` if the data members can vary independently.
2. C.4 Make a function a member only if it needs direct access to the representation of a class.
3. C.7 Don't define a class or enum and declare a variable of its type in the same statement.
4. C.9 Minimize exposure of members (prefer `private` + accessors over public data).
5. C.20 If you can avoid defining any default operations, do (the "rule of zero").
6. C.21 If you define or `=delete` any copy, move, or destructor function, define or `=delete` them all (the "rule of five").
7. C.35 A base class destructor should be either public and virtual, or protected and non-virtual.
8. C.67 A polymorphic class should suppress copying (prefer a virtual `clone()` if copies of polymorphic objects are needed).
9. C.128 Virtual functions should specify exactly one of `virtual`, `override`, or `final`.
10. C.131 Avoid trivial getters and setters that just forward to a member.
11. C.138 Create an overload set for a derived class and its bases with `using`.

## Enum: Enumerations
1. Enum.1 Prefer enumerations over macros.
2. Enum.2 Use enumerations to represent sets of related named constants.
3. Enum.3 Prefer `enum class` over "plain" `enum` (avoids implicit conversions and namespace pollution).
4. Enum.5 Don't use `ALL_CAPS` for enumerators (that's reserved for macros).

## R: Resource management
1. R.1 Manage resources automatically using resource handles and RAII (constructor/destructor pairs).
2. R.3 A raw pointer (`T*`) is non-owning — don't use it to transfer ownership.
3. R.5 Prefer scoped objects (stack/member) to heap-allocated, owned objects.
4. R.10 Avoid `malloc()`/`free()` in C++ code.
5. R.11 Avoid calling `new`/`delete` explicitly — let a resource handle (container, smart pointer) manage it.
6. R.12 Immediately give the result of an explicit resource allocation to a resource handle.
7. R.20 Use `unique_ptr`/`shared_ptr` to represent ownership.
8. R.21 Prefer `unique_ptr` over `shared_ptr` unless you need to share ownership.
9. R.30 Take smart pointers as parameters only if you want to manipulate the lifetime/ownership itself — otherwise take `T*`/`T&`.

## ES: Expressions and statements
1. ES.1 Prefer the standard library (or other library) to writing your own code to do the same thing.
2. ES.5 Keep scopes small.
3. ES.10 Declare one name (only) per declaration.
4. ES.20 Always initialize an object; avoid uninitialized variables.
5. ES.23 Prefer the `{}`-initializer syntax (catches narrowing conversions).
6. ES.46 Avoid lossy (narrowing) arithmetic conversions.
7. ES.48 Avoid casts; if a cast is necessary, use a named C++ cast, not a C-style cast.
8. ES.63 Don't slice (assigning/passing a derived-class object by value where a base-class object is expected).
9. ES.71 Prefer a range-`for`-statement to a plain `for`-statement where there is a choice.

## Per: Performance
1. Per.1 Don't optimize without reason / without a measured performance problem.
2. Per.2 Don't optimize prematurely, before you've measured where the actual cost is.
3. Per.7 Design to enable optimization (e.g., avoid pointer-chasing data layouts that defeat the cache).
4. Per.10 Rely on the static type system; prefer compile-time computation to run-time computation.
5. Per.19 Access memory predictably (sequential/cache-friendly access patterns beat clever "optimizations" that break locality).

## CP: Concurrency and parallelism
1. CP.1 Assume your code will run as part of a multi-threaded program.
2. CP.2 Avoid data races by design; use the type system to catch data races at compile time where possible.
3. CP.3 Minimize explicit sharing of writable data between threads.
4. CP.8 Don't try to use `volatile` for synchronization.
5. CP.20 Use RAII, never plain `lock()`/`unlock()`, to manage locks.
6. CP.21 Use `std::lock()`/`std::scoped_lock` to acquire multiple mutexes to avoid deadlock.
7. CP.42 Don't `wait` without a condition (spurious wakeups are allowed — always loop on a predicate).

## E: Error handling
1. E.2 Throw an exception to signal that a function can't perform its assigned task (the function failed its postcondition).
2. E.3 Use exceptions for error handling only (not for ordinary control flow).
3. E.6 Use RAII to prevent leaks when an exception is thrown.
4. E.14 Use purpose-designed user-defined types as exceptions (not plain `int`/`const char*`).
5. E.15 Catch exceptions from a hierarchy by reference, not by value (avoid slicing).
6. E.25 If exceptions are unavailable/disabled, simulate RAII and signal errors via error codes systematically.
7. E.28 Avoid error handling based on global state (e.g., `errno`).

## Con: Constants and immutability
1. Con.1 By default, make objects immutable (`const`).
2. Con.2 By default, make member functions `const`.
3. Con.4 Use `const` to define objects with values that do not change after construction.
4. Con.5 Use `constexpr` for values that can be computed at compile time.

## T: Templates and generic programming
1. T.1 Use templates to raise the level of abstraction of code.
2. T.3 Use templates to express containers and ranges.
3. T.10 Specify concepts for all template arguments where possible.
4. T.11 Whenever possible use standard concepts (e.g. `std::regular`, `std::invocable`) instead of inventing ad hoc ones.
5. T.60 Minimize a template's context dependencies (avoid relying on ADL-found, implicit assumptions about callers' namespaces).

## CPL / SF / SL (brief)
1. CPL.1 Prefer C++ to C (use the type-safe, resource-safe alternatives where C and C++ overlap).
2. SF.1 Use a `.cpp` suffix for code files and `.h` for interface files that are shared.
3. SF.5 A `.cpp` file must include the `.h` file(s) that define its interface.
4. SL.1 Use the standard library whenever possible, over hand-rolled equivalents.
5. SL.con.1 Prefer using `std::array`/`std::vector` over a C array.

A review checklist derived from this document lives in
`review-guidelines/cpp-core-guidelines-checklist.md`. Several of its
categories (raw pointers/ownership, RAII, `const`-correctness, no raw
loops) are directly enforceable via `clang-tidy` — see
`automation/clang-tidy-mapping.md`.
