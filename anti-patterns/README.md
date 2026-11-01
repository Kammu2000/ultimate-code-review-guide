# Anti-Patterns

A catalog of named, recurring anti-patterns and code smells: what each
one looks like, why it's harmful, and how to fix it. Each entry is a
lookup reference — link to it from a PR comment ("this is an instance
of X") rather than reading it top-to-bottom. One doc per
source/ideology, kept in sync with its `knowledge-base/` counterpart.

## Catalog

| File | Derived from |
|---|---|
| [`clean-code-anti-patterns.md`](clean-code-anti-patterns.md) | `knowledge-base/clean-code.md` ("Code smells" + other named smells implied by its rules) |
| [`better-code-anti-patterns.md`](better-code-anti-patterns.md) | `knowledge-base/better-code.md` ("Core rubrics," each already phrased as a red flag) |
| [`design-by-contract-anti-patterns.md`](design-by-contract-anti-patterns.md) | `knowledge-base/design-by-contract.md` §12 Anti-Patterns |
| [`javascript-anti-patterns.md`](javascript-anti-patterns.md) | `knowledge-base/javascript-clean-code.md` |
| [`react-anti-patterns.md`](react-anti-patterns.md) | `knowledge-base/react-best-practices.md` |

## Entry format

```
## <Anti-pattern name>

**What it looks like:** how to recognize it in a diff
**Why it's harmful:** the class of problems it causes
**Example:** a minimal repro
**Fix:** the preferred alternative
```

## Planned

Once enough per-source catalogs exist, consider a single combined
`anti-patterns.md`, organized by review concern rather than by source
— matching the planned combined `review-guidelines/review-checklist.md`.
