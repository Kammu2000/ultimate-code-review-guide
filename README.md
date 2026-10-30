# Ultimate Code Review Guide

A curated knowledge base of software design principles, distilled into
actionable review guidelines, anti-pattern checklists, and automation
rules (formatter/linter configs) that enforce what can be enforced
mechanically.

## Structure

- [`knowledge-base/`](knowledge-base/README.md) — Concise notes
  distilled from authoritative sources (Clean Code, Better Code,
  Design by Contract, Effective Modern C++, ...).
- [`review-guidelines/`](review-guidelines/README.md) — Actionable,
  checklist-style guidance for code reviewers, derived from the
  knowledge base and organized by language/topic.
- [`anti-patterns/`](anti-patterns/README.md) — Catalog of recurring
  anti-patterns and code smells, with how to spot and fix them.
- [`automation/`](automation/README.md) — Formatter/linter
  configuration that automatically enforces the rules that can be
  checked mechanically, plus a mapping of which rules are automated
  vs. require manual review.

## Workflow

1. Add/update a source's distilled notes in `knowledge-base/`.
2. Promote actionable, checkable rules from those notes into
   `review-guidelines/` and `anti-patterns/`.
3. For any rule that a tool can enforce, add it to `automation/` and
   record it in `automation/README.md`'s mapping table so manual
   review effort focuses on what tools can't catch.

See `CONTRIBUTING.md` for conventions.

[MIT](LICENSE)
