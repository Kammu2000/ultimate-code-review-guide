# JavaScript — Anti-Pattern Checklist

Lookup-friendly red flags for JS/TS review.
_____________________________________

| Anti-pattern | Red flag |
|---|---|
| Boolean Flag Argument | A function takes a `boolean`/mode argument that switches its internal behavior down two different paths. |
| Callback Hell / Unhandled Promise Rejection | Deeply nested `.then()` chains, or an `await` with no `try`/`catch` and no `.catch()` anywhere in the chain. |
| Mutating Shared State | A function mutates an object/array passed by reference (or a module-level variable) instead of returning a new value. |
| Swallowed Errors | A `catch` block is empty or only logs, without rethrowing or otherwise handling the failure. |
| God Function / God Module | A single function or file accumulates unrelated responsibilities (parsing, validation, business logic, rendering). |
