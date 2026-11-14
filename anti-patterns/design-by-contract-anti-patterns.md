# Design by Contract — Anti-Pattern Checklist

Lookup-friendly red flags for contract violations, for linking to from
PR comments ("this is an instance of X").
_____________________________________

| Anti-pattern | Red flag |
|---|---|
| Over-Defensive Programming | A function adds a runtime check/fallback for something that's actually the caller's documented responsibility (a precondition), instead of asserting and trusting the contract. |
| Weak Contracts | A stated contract is too vague to constrain behavior ("handles errors appropriately," "works for valid input") — documented in name only. |
| Redundant Checks | The same condition is re-validated at multiple layers of a call chain, with no single layer designated as authoritative. |
