# Clean Code — Anti-Patterns

Named, lookup-friendly catalog of anti-patterns, sourced from
`knowledge-base/clean-code.md`'s "Code smells" section plus other
named smells implied by its rules (Robert C. Martin's *Clean Code*).
See `review-guidelines/clean-code-checklist.md` for the corresponding
review questions.
_____________________________________

## Rigidity

**What it looks like:** A small, localized change requires edits to
cascade through many unrelated files/modules to keep the system
consistent.

**Why it's harmful:** Makes every change expensive and risky, which in
turn discourages needed refactoring and lets the design decay further.

**Fix:** Reduce coupling between modules (dependency injection,
interfaces at seams that actually vary); keep each module's concerns
and the things that change together within it.

## Fragility

**What it looks like:** A single change in one place breaks unrelated
functionality elsewhere, often in ways not caught until runtime.

**Why it's harmful:** Erodes confidence in the codebase; developers
become afraid to touch code they don't fully understand, which again
discourages cleanup.

**Fix:** Reduce hidden coupling (shared mutable state, logical
dependencies between methods — see "Hidden Temporal Coupling" below);
add tests that pin down the behavior being changed before changing it.

## Immobility

**What it looks like:** A useful piece of logic can't be reused in
another project/context because it's entangled with involved risk or
excessive effort to extract.

**Why it's harmful:** Forces reimplementation (and re-introduction of
bugs already fixed once) instead of reuse.

**Fix:** Keep components small and loosely coupled with clearly
defined dependencies, so logic can be lifted out without pulling along
unrelated context.

## Needless Complexity

**What it looks like:** Code solves a problem with more machinery
(layers, abstractions, configuration) than the actual requirement
justifies.

**Why it's harmful:** Costs every future reader comprehension time for
no corresponding benefit, and increases the surface area for bugs.

**Fix:** Apply KISS — simpler is always better; remove abstractions
that aren't paying for themselves given the real requirements.

## Needless Repetition

**What it looks like:** The same logic/knowledge is copy-pasted across
multiple places rather than factored into one.

**Why it's harmful:** Each copy can drift independently; a fix applied
to one copy is silently absent from the others.

**Fix:** Extract the shared logic into a single named function/type
and have all call sites use it.

## Opacity

**What it looks like:** Code that's hard to understand even after
careful reading — unclear names, implicit behavior, or logic that
requires tracing multiple files to follow.

**Why it's harmful:** Multiplies the cost of every future change,
since understanding must be re-derived each time instead of read
directly off the code.

**Fix:** Apply the Names, Functions, and Comments rules from
`knowledge-base/clean-code.md` directly: descriptive names, small
single-purpose functions, explanatory variables instead of comments
explaining intent that the code itself should convey.

## Primitive Obsession

**What it looks like:** A primitive type (`int`, `std::string`, `bool`)
is used to represent a concept that has its own rules/invariants (an
ID, a percentage, a currency amount, a status flag).

**Why it's harmful:** The compiler can't stop a caller from passing a
`UserId` where an `OrderId` was expected, or an out-of-range percent;
validation logic gets duplicated at every call site instead of being
centralized in a type.

**Fix:** Introduce a dedicated value type that encapsulates the
invariant once (e.g. a `Percentage` type that only ever holds `0-100`).

## Boolean Flag Argument

**What it looks like:** A function takes a `bool`/enum "mode" argument
that switches its internal behavior down two different paths.

**Why it's harmful:** The function no longer "does one thing"; call
sites become unreadable (`process(x, true)` — true *what*?); and the
two behaviors are coupled in one body, changed together even when
unrelated.

**Fix:** Split into two separate, clearly-named functions that the
caller chooses between directly.

## Hidden Temporal Coupling

**What it looks like:** A method only behaves correctly if another
method on the same object was called first, with no enforcement of
that ordering.

**Why it's harmful:** The dependency is invisible at the call site;
callers discover it only by hitting the bug, often long after the
method was written.

**Fix:** Either enforce the ordering in the type (e.g. the typestate
pattern — see `design-by-contract.md` §9.1) or eliminate the
dependency by making the method self-sufficient.

## Commented-Out Code

**What it looks like:** Dead code left in place behind a comment
marker instead of being deleted.

**Why it's harmful:** Adds noise for every future reader, who must
figure out whether it's safe to ignore; version control already
retains the history, so nothing is actually preserved by keeping it.

**Fix:** Delete it. Rely on `git log`/blame to recover it if ever
actually needed again.
