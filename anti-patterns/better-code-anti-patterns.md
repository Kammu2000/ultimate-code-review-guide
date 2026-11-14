# Better Code — Anti-Pattern Checklist

Lookup-friendly red flags from Sean Parent & David Abrahams' *Better Code*. 
This list is for spotting the pattern fast.
_____________________________________

| Anti-pattern | Red flag |
|---|---|
| Raw Loops | Hand-written `for`/`while` reimplements a named algorithm (search/filter/transform/accumulate). |
| Raw Synchronization Primitives | Business logic directly locks/unlocks mutexes or waits on condition variables instead of using higher-level concurrency constructs. |
| Raw Pointers (for Ownership) | A raw pointer expresses or transfers ownership, with cleanup left to manual bookkeeping instead of RAII. |
| Incidental Data Structures | Objects reference each other to fake a structure (hand-rolled list/tree) instead of using a standard container. |
| Inheritance for Polymorphism | A class hierarchy exists only to get runtime polymorphism, forcing shared mutable state on every derived type. |
| Lying Interfaces | A function/type's name or docs promise behavior (e.g. a pure getter, atomicity) the implementation doesn't actually provide. |
| Informal Agreements (Undocumented Contracts) | A precondition/postcondition/invariant exists only as tribal knowledge, never written into the interface. |
| Shared Mutable References | Objects are mutated through shared references instead of being treated as independent, value-semantic data. |
