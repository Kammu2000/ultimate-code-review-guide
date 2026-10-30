# Anti-Patterns

A catalog of recurring anti-patterns and code smells: how to spot
them, why they're harmful, and how to fix them. Each entry should
reference the knowledge-base rule(s) it violates.

## Status

Empty — to be populated alongside `review-guidelines/`. Planned
layout mirrors the knowledge base: `general-anti-patterns.md` plus
language-specific files (e.g. `cpp-anti-patterns.md`) as sources are
added.

## Entry format (proposed)

```
### <Anti-pattern name>
- **Smell:** how to recognize it in a diff
- **Why it hurts:** correctness/efficiency/abstraction cost
- **Fix:** the preferred alternative
- **Source:** knowledge-base file/rule it violates
```
