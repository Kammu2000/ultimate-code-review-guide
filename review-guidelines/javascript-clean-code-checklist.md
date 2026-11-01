# JavaScript Clean Code — Review Checklist

PR-review questions derived from `knowledge-base/javascript-clean-code.md`.
_____________________________________

## Variables
1. Are variable/function names meaningful and consistent in vocabulary across the diff?
2. Is `const` used by default, with `let` only where reassignment genuinely happens, and no `var`?
3. Does any variable require the reader to mentally "decode" its name into meaning?

## Functions
1. Does any function take more than two or three arguments without grouping them into an object?
2. Does the function do one thing at one level of abstraction, or does it mix concerns?
3. Is there duplicated logic across functions that should be extracted into a shared abstraction?
4. Does any function take a boolean "mode" flag that should instead be split into separate functions?
5. Are side effects (mutating an outer-scope variable, writing to a global, I/O) obvious from the function's name, or hidden?
6. Could a complex boolean expression be extracted into a well-named variable/function for clarity?
7. Is there dead/unused code left behind that should just be deleted?

## Objects and data structures
1. Is object/module composition preferred over a deep inheritance chain here?
2. Are "private" fields actually encapsulated (closures/`#private`), or just named with a `_` convention that nothing enforces?

## Classes
1. Does the class have a single, clear responsibility?
2. Is composition preferred over inheritance unless there's a genuine "is-a" relationship?

## Error handling
1. Is every caught error logged, rethrown, or otherwise handled — not silently swallowed?
2. Does every promise chain have a `.catch()`, or is every `await` inside a `try`/`catch` where failure is possible?
3. Are errors distinguished by type/class rather than by matching on `error.message` strings?

## Concurrency / async
1. Is `async`/`await` used instead of harder-to-read `.then()` chains?
2. Are independent async operations run in parallel (`Promise.all`) rather than needlessly sequential?
3. Could an unhandled promise rejection occur anywhere in this diff?

## Comments
1. Could a comment here be replaced by a better name or a small extracted function instead?
2. Is there commented-out code that should be deleted rather than kept "just in case"?
