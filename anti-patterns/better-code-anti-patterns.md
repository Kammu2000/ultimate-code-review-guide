# Better Code — Anti-Patterns

Named, lookup-friendly catalog of anti-patterns, sourced from
`knowledge-base/better-code.md` (Sean Parent & David Abrahams'
*Better Code*). Each "core rubric" in that doc is itself phrased as a
red flag — this doc expands each into a recognizable anti-pattern
entry. See `review-guidelines/better-code-checklist.md` for the
corresponding review questions.
_____________________________________

## Raw Loops

**What it looks like:** A hand-written `for`/`while` loop that
reimplements something a standard/named algorithm already does
(searching, filtering, transforming, accumulating).

**Why it's harmful:** Hand-written loops hide intent behind mechanism,
are easy to get subtly wrong (off-by-one, wrong iterator invalidation,
`O(n²)` traps from in-loop erasure), and don't document themselves the
way a named algorithm call does.

**Example:**
```cpp
int count = 0;
for (auto it = v.begin(); it != v.end(); ++it) {
  if (*it > 0) ++count;
}
```

**Fix:** Replace with a named, composable algorithm:
```cpp
auto count = std::count_if(v.begin(), v.end(), [](int x) { return x > 0; });
```

## Raw Synchronization Primitives

**What it looks like:** Hand-rolled locking using mutexes/condition
variables directly in business logic, rather than building on
higher-level concurrency constructs.

**Why it's harmful:** Manual lock/unlock pairing is error-prone (easy
to forget an unlock on an exception path, easy to deadlock via
inconsistent lock ordering) and smears synchronization concerns
throughout the code instead of isolating them.

**Fix:** Build on futures/continuations or other higher-level
concurrency abstractions; where a lock is unavoidable, scope it with
RAII (`std::scoped_lock`) rather than manual `lock()`/`unlock()`.

## Raw Pointers (for Ownership)

**What it looks like:** A raw pointer used to express or transfer
ownership/lifetime, with cleanup left to manual, non-RAII bookkeeping.

**Why it's harmful:** Ownership becomes implicit tribal knowledge
instead of something the type system enforces, leading to leaks,
double-frees, and use-after-free.

**Fix:** Express ownership through types — `std::unique_ptr`,
`std::shared_ptr`, value semantics — and reserve raw pointers/
references for non-owning observation only.

## Incidental Data Structures

**What it looks like:** A set of objects that reference each other to
fake a structure (e.g., a hand-rolled linked list or tree via raw
pointers/indices) instead of using a standard container directly.

**Why it's harmful:** Reinvents invariants, iteration, and memory
management that a standard container already gets right, multiplying
the surface area for bugs without adding value.

**Fix:** Use the standard container that directly models the actual
structure needed (`std::vector`, `std::map`, `std::deque`, ...)
instead of composing one from scratch out of pointers/objects.

## Inheritance for Polymorphism

**What it looks like:** A class hierarchy used purely to get runtime
polymorphism, where every derived type must inherit mutable shared
state and an interface it may not fully honor (see also the Liskov
Substitution Principle anti-patterns in
`design-by-contract-anti-patterns.md`).

**Why it's harmful:** Inheritance couples implementation details
across the hierarchy, makes substitutability bugs easy to introduce,
and usually buys nothing that value semantics + type erasure
(concept-based polymorphism) wouldn't buy more safely.

**Fix:** Prefer a value-semantic wrapper (type erasure / "concept"
pattern) over a class hierarchy when the only need is runtime
polymorphism over an interface.

## Lying Interfaces

**What it looks like:** A function/type's documented or implied
behavior doesn't match what the code actually does — e.g., a getter
that has side effects, or a name promising atomicity the
implementation doesn't provide.

**Why it's harmful:** Callers reason about code by its interface, not
its implementation; when the two diverge, every caller is implicitly
wrong and the resulting bugs are scattered far from the lie itself.

**Fix:** Keep the interface's documented contract and its actual
behavior in lockstep; if they must diverge, change the interface
(rename/redocument), not just the implementation.

## Informal Agreements (Undocumented Contracts)

**What it looks like:** A precondition/postcondition/invariant that
exists only as tribal knowledge or a convention "everyone knows,"
never written down in the interface.

**Why it's harmful:** Tribal knowledge doesn't survive team turnover,
isn't checkable by reviewers or tools, and makes it impossible to tell
a caller's bug from a callee's bug when something breaks.

**Fix:** Get the contract in writing — preconditions, postconditions,
and invariants as part of the interface (Doxygen `\pre`/`\post`,
`assert()`, or language-level contracts), not just a comment the
author remembers to write.

## Shared Mutable References

**What it looks like:** Objects passed around and mutated through
shared references instead of being treated as independent,
value-semantic data.

**Why it's harmful:** Produces "spooky action at a distance" (a change
through one reference silently affects everything else holding it),
incidental algorithms built around tracking who-mutates-when, visibly
broken invariants, and race conditions under concurrency.

**Fix:** Prefer regular, value-semantic types (copyable,
equality-comparable, independently mutable); pass by value or use
`const&` for read-only observation, and make deliberate, explicit
copies instead of relying on implicit aliasing.
