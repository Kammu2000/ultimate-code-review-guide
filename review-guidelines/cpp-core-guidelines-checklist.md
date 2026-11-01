# C++ Core Guidelines — Review Checklist

PR-review questions derived from `knowledge-base/cpp-core-guidelines.md`
(Stroustrup & Sutter's *C++ Core Guidelines*). Organized to mirror
that doc's sections.
_____________________________________

## Philosophy
1. Does this code express intent directly, or does it require the reader to infer "why" from surrounding context/comments?
2. Is there a run-time check standing in for something the type system could enforce at compile time instead?
3. Is any resource (memory, handle, lock) acquired without a corresponding automatic release?

## Interfaces
1. Does a public function accept a weakly-typed blob (`void*`, raw pointer+length) where a strongly-typed parameter (a dedicated type, `span<T>`) would do?
2. Are preconditions/postconditions stated (`Expects`/`Ensures`/contracts/docs), not left implicit?
3. Does any function signature transfer ownership through a raw pointer or reference instead of a smart pointer/`owner<T*>`?
4. Could the number of parameters be reduced by grouping related ones into a type?

## Functions
1. Does the function do one logical thing, or does it quietly do several?
2. Could this function be `constexpr` or `noexcept`, and if not already, is that intentional?
3. Are "in" parameters passed by value (cheap types) or `const&` (expensive types), and "out" values returned rather than passed as output parameters?
4. Do any lambdas that escape their defining scope capture by reference (dangling risk), where capture-by-value/forwarding would be safe?

## Classes and class hierarchies
1. Is `class` vs `struct` chosen based on whether an invariant exists?
2. Does the type follow the rule of zero, or — if it defines one of copy/move/destructor — does it define/delete all five consistently?
3. Is the base class destructor either `public virtual` or `protected non-virtual` (not `public non-virtual` for a polymorphic base)?
4. Does every `override` declare exactly one of `virtual`/`override`/`final`?
5. Are there trivial getters/setters that just forward to a member with no behavior, where public data would be more honest?
6. Is a polymorphic class copyable in a way that risks slicing, where a virtual `clone()` would be safer?

## Resource management
1. Is every resource owned by exactly one RAII handle (smart pointer, container, lock guard), with no raw `new`/`delete`/`malloc`/`free`?
2. Is the result of an allocation handed immediately to a resource handle, with nothing executable in between that could throw/leak?
3. Is `shared_ptr` used where `unique_ptr` would suffice (i.e., there's no genuine shared ownership)?
4. Do function parameters take a smart pointer only when they need to manipulate lifetime/ownership itself, rather than just observe the pointee?

## Expressions and statements
1. Is there hand-written logic that duplicates something the standard library already provides?
2. Are all variables initialized at declaration, with no uninitialized locals?
3. Is brace `{}`-initialization used where it would have caught a narrowing conversion that plain `=`/`()` init would silently allow?
4. Are there C-style casts that should be a named C++ cast (or better, no cast at all)?
5. Is there a risk of object slicing (a derived object assigned/passed by value where a base object is expected)?
6. Could a plain `for`-loop be a range-`for` or named algorithm instead?

## Performance
1. Is this optimization justified by an actual measurement, or is it speculative/premature?
2. Does the data layout enable or defeat cache-friendly, sequential access patterns?

## Concurrency and parallelism
1. Is shared, writable data between threads minimized, with the type system (not convention) preventing accidental sharing?
2. Are locks always acquired/released via RAII (`scoped_lock`/`lock_guard`), never manual `lock()`/`unlock()`?
3. When multiple mutexes are locked together, is `std::scoped_lock`/`std::lock` used to avoid lock-order deadlocks?
4. Does every `wait`/condition-variable use loop on a predicate rather than assuming a single wakeup is sufficient?

## Error handling
1. Are exceptions used only for genuine error signaling, not as a general control-flow mechanism?
2. Is every exception type purpose-designed (not a bare `int`/C-string)?
3. Are exceptions from a hierarchy caught by reference, avoiding slicing?
4. Is RAII relied upon to prevent leaks if an exception propagates through this code?

## Constants and immutability
1. Could this object/parameter/member function be `const` but isn't?
2. Could a value computed here be `constexpr` instead of computed at run time?

## Templates and generic programming
1. Are template arguments constrained with concepts (standard ones where applicable), rather than left totally unconstrained?
2. Does the template implicitly depend on something found via ADL in the caller's namespace, in a way that could surprise instantiators?
