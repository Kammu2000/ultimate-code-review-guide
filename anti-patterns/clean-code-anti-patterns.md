# Clean Code — Anti-Pattern Checklist

Lookup-friendly red flags from Robert C. Martin's *Clean Code*.
This list is for spotting the pattern fast.
_____________________________________

| Anti-pattern | Red flag |
|---|---|
| Rigidity | A small, localized change forces edits to cascade through many unrelated files/modules. |
| Fragility | A change in one place breaks unrelated functionality elsewhere, often only caught at runtime. |
| Immobility | Useful logic can't be reused elsewhere because it's entangled with its current context. |
| Needless Complexity | More machinery (layers, abstractions, config) than the actual requirement justifies. |
| Needless Repetition | The same logic/knowledge is copy-pasted instead of factored into one place. |
| Opacity | Code is hard to understand even after careful reading — unclear names, implicit behavior, scattered logic. |
| Primitive Obsession | A primitive (`int`, `string`, `bool`) represents a concept that has its own rules/invariants (ID, percentage, currency). |
| Boolean Flag Argument | A `bool`/enum "mode" argument switches a function's internal behavior down two different paths. |
| Hidden Temporal Coupling | A method only behaves correctly if another method was called first, with no enforcement of that order. |
| Commented-Out Code | Dead code left behind a comment marker instead of being deleted (version control already preserves it). |
