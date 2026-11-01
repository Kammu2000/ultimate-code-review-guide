# Review Guidelines

Actionable, checklist-style guidance for code reviewers, derived from
`knowledge-base/`. Each source/ideology gets its own checklist doc
here, kept in sync with (and cross-referenced from) its
knowledge-base counterpart.

## Checklists

| File | Derived from |
|---|---|
| [`clean-code-checklist.md`](clean-code-checklist.md) | `knowledge-base/clean-code.md` |
| [`better-code-checklist.md`](better-code-checklist.md) | `knowledge-base/better-code.md` |
| [`design-by-contract-checklist.md`](design-by-contract-checklist.md) | `knowledge-base/design-by-contract.md` (organized by the same 12 sections/sub-topics) |
| [`cpp-core-guidelines-checklist.md`](cpp-core-guidelines-checklist.md) | `knowledge-base/cpp-core-guidelines.md` |
| [`javascript-clean-code-checklist.md`](javascript-clean-code-checklist.md) | `knowledge-base/javascript-clean-code.md` |
| [`react-best-practices-checklist.md`](react-best-practices-checklist.md) | `knowledge-base/react-best-practices.md` |

## Planned

Once enough per-source checklists exist, combine them into a single,
deduplicated `review-checklist.md` covering all ideologies — organized
by review concern (naming, contracts, concurrency, error handling,
...) rather than by source, so a reviewer can pull up one list for a
given concern regardless of which book/talk it came from.
