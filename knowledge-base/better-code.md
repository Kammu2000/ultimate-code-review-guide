Source: Sean Parent's *Better Code* talk series and the *Better Code*
book (Sean Parent & David Abrahams, STLab). Better code has more of
three ingredients: **correctness, efficiency, and abstraction**.
Abstraction is the quality of code that is more reusable—and more
understandable—because inessential detail has been lifted out. Each
rubric below is phrased as a red flag to avoid, not a hard rule.
_____________________________________

## Core rubrics
1. No raw loops. Prefer named, composable algorithms over hand-written loops.
2. No raw synchronization primitives. Build on higher-level concurrency constructs (futures/continuations) instead of locks/condition variables.
3. No raw pointers. Express ownership and lifetime through types, not manual pointer management.
4. No incidental data structures. Use standard containers directly instead of objects referencing other objects to fake a structure.
5. No inheritance (for polymorphism). Prefer value semantics + type erasure / concept-based (runtime) polymorphism over class hierarchies.
6. Don't lie. Code behavior and human-interface behavior must match; never let an interface promise something the code doesn't deliver.
7. No informal agreements. Get contracts in writing (preconditions, postconditions, invariants).

## Contracts (Design by Contract)
1. A contract has a precondition (what must be true to call), a postcondition (what's guaranteed after a correct, successful call), and must be general across all intended inputs.
2. Precondition violated → bug in the caller. Precondition met but postcondition unmet → bug in the callee.
3. A function must not make promises when its precondition is violated; it has undefined behavior unless explicitly documented otherwise.
4. A type (class) invariant is a condition that holds at the type's public API boundary; it may be broken temporarily during encapsulated, private mutation.
5. Uphold invariants by: keeping stored properties private, establishing the invariant in every initializer, and restoring it before returning to the caller, passing `self` out, or calling any non-private member.
6. Favor local reasoning: a reader should understand a unit of code without having to trace how it's used elsewhere.
7. Factor out a named component whenever you'd otherwise write a comment describing what the next lines do — that comment is a sign an abstraction is waiting to be extracted.
8. Contracts are part of the interface, not just documentation; document them where the client will see them.

## Errors
1. Define error precisely: anything that prevents a function from fulfilling its postcondition.
2. Two kinds: programming error/bug (a mistake in code) vs. runtime error (postcondition fails despite a satisfied precondition, e.g., disk full).
3. There is no principled recovery from a detected bug (other than full redundancy/voting systems) — terminate the process to avoid operating on corrupted state.
4. Recovering from a runtime error means leaving the program "unscathed": invariants intact and state consistent with the valid input seen so far.
5. Release resources with `defer`/RAII immediately after acquiring them, or tie them to the lifetime (destructor) of an owning type.
6. When an error aborts an operation, any partially-mutated state must be discarded ("let it flow") — a mutating method need not restore its invariant before propagating the error, since only incorrect code could observe the broken state.
7. Exceptions to "let it flow": invariants depended on by a destructor, and invariants that guard preconditions of unsafe operations — those must always be restored before the error propagates.
8. Prefer the strong guarantee at application boundaries: mutate a copy and swap it in on success, leaving the user's data untouched on failure.

## Algorithms
1. Programming is about computing something; algorithms are the abstraction of computation — architecture and patterns only matter insofar as they help implement a correct, efficient algorithm.
2. Translate intent into mechanism via composable, named algorithms instead of ad-hoc loops; this avoids subtle bugs (e.g., O(n²) traps from naive in-loop removal) and documents intent at the call site.
3. Data structure is algorithmic leverage: imposing structure on data (e.g., sorting) unlocks more efficient algorithms (e.g., binary search) without changing the algorithm itself.
4. As your algorithmic vocabulary grows, you write less code and think in terms of transformations rather than loops.
5. Consider algorithmic tradeoffs explicitly: time, space, energy, and compute-unit cost.

## Types and values
1. Every instance should have exactly one clearly defined value, expressed through the operations available on its type.
2. Two instances are equal exactly when they have the same value; design equality around the type's documented meaning, not its raw bit layout.
3. A type's range (representable values) is often a subset of its notional (mathematical) range because of finite memory — document and guard that discrepancy.
4. The complete basis of a type is the minimal operation set needed to implement everything else; the efficient basis is the minimal set needed to implement everything else *efficiently*. Favor exposing the efficient basis.
5. Prefer regular, value-semantic types (copyable, equality-comparable, independently mutable) over shared mutable references.
6. Avoid the problems that come with references: spooky action at a distance, incidental algorithms, visibly broken invariants, race conditions, surprise/unspecifiable mutation.

## Review checklist derived from this series
1. Can every loop in this diff be replaced by a standard/named algorithm?
2. Are preconditions, postconditions, and invariants stated (in code or docs) for every non-trivial public function/type?
3. Does any function make promises despite documented precondition violations?
4. Is there a reachable path where a detected bug (not a runtime error) is "handled" instead of terminating/asserting?
5. Are resources released via RAII/`defer` rather than manual cleanup at every exit path?
6. Does a new type expose raw stored fields that should instead be encapsulated behind an invariant?
7. Is polymorphism implemented via inheritance where value semantics + type erasure would be simpler and safer?
8. Does the data's structure already provide the best available algorithmic leverage (sorted/hashed/indexed) for how it's queried?
