# JavaScript — Clean Code

Source: *Clean Code JavaScript* (community adaptation of Robert C.
Martin's *Clean Code* for JS, originated by Ryan McDermott) and the
*Airbnb JavaScript Style Guide*. Principles below apply to JS/TS
generally; see `react-best-practices.md` for React-specific guidance.
_____________________________________

## Variables
1. Use meaningful, pronounceable, searchable names; avoid single letters outside tight loop counters.
2. Use the same vocabulary for the same type of variable across the codebase.
3. Avoid mental mapping — don't make the reader translate `l`/`o`/`e` back into what they mean.
4. Don't add unneeded context (`car.carMake` when `car.make` is unambiguous).
5. Use default parameters instead of short-circuiting/conditionals inside the function body.
6. Prefer `const` by default; use `let` only for variables that are reassigned; never use `var`.

## Functions
1. Keep function arguments to two or fewer; group related arguments into an object.
2. A function should do one thing, at one level of abstraction.
3. Function names should say what they do (`addItemToCart`, not `item`).
4. Remove duplicate code by extracting a shared function/abstraction — don't copy-paste with minor variations.
5. Don't use flags/booleans as a parameter that switches behavior — split into separate functions.
6. Avoid side effects — if a function must have one, make it obvious in the name and localize it (no hidden global/outer-scope mutation).
7. Prefer functional, immutable patterns (`map`/`filter`/`reduce`) over imperative mutation of shared state where it keeps the code at least as clear.
8. Avoid negative conditionals (`if (!isNotValid)`); phrase checks positively.
9. Encapsulate conditionals behind a well-named function/variable rather than inlining complex boolean expressions.
10. Remove dead code — don't keep unused functions "just in case"; version control preserves history.

## Objects and data structures
1. Use getters/setters (or just plain property access consistently) rather than mixing conventions.
2. Prefer object composition over deep inheritance chains.
3. Make objects have private members via closures/`#private` fields, not by convention (`_prefix`) alone.

## Classes
1. Prefer small classes/modules over large ones with many responsibilities (SRP).
2. Maximize cohesion, minimize coupling between classes/modules.
3. Prefer composition over inheritance unless there's a genuine "is-a" relationship.
4. Use method chaining judiciously — don't let it hide what's actually being called.

## Error handling
1. Don't ignore a caught error — log, rethrow, or handle it meaningfully.
2. Don't swallow rejected promises — always `.catch()` or `await` inside a `try`/`catch`.
3. Use `Error` subclasses to distinguish error kinds, not string matching on `error.message`.

## Concurrency / async
1. Prefer `async`/`await` over raw `.then()` chains for readability.
2. Avoid unnecessary sequential `await`s for independent work — use `Promise.all` to parallelize.
3. Always handle promise rejection; an unhandled rejection should not be silently swallowed.

## Formatting
1. Use a consistent casing convention (`camelCase` for variables/functions, `PascalCase` for classes/components).
2. Keep related code physically close (declare variables near their use, group related functions).
3. Let a formatter (Prettier) own formatting — don't debate it in review.

## Comments
1. Prefer self-explanatory code (good names, small functions) over a comment explaining what code does.
2. Don't leave commented-out code in the codebase.
3. Don't use comments as a change log — that's what version control is for.

A review checklist derived from these rules lives in
`review-guidelines/javascript-clean-code-checklist.md`; a named
anti-pattern catalog lives in `anti-patterns/javascript-anti-patterns.md`.
