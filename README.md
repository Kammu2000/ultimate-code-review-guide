# Ultimate Code Review Guide

A curated knowledge base of software design principles, distilled into
actionable review guidelines, anti-pattern checklists, and automation
rules (formatter/linter configs) that enforce what can be enforced
mechanically.

## Structure

- [`knowledge-base/`](knowledge-base/) — Concise notes
  distilled from authoritative sources. 
- [`review-guidelines/`](review-guidelines/) — Actionable,
  checklist-style guidance for code reviewers, derived from the
  knowledge base.
- [`anti-patterns/`](anti-patterns/) — Compact, scannable
  checklists of named anti-patterns and code smells (name + red flag
  only).
- [`automation/`](automation/) — Formatter/linter
  configuration that automatically enforces the rules that can be
  checked mechanically, plus a mapping of which rules are automated
  vs. require manual review.

## Workflow

1. Add/update a source's distilled notes in `knowledge-base/`.
2. Promote actionable, checkable rules from those notes into
   `review-guidelines/` and `anti-patterns/`.
3. For a must-follow rule that a tool can enforce, add it to `automation/` and
   record it in that rule's mapping doc so manual review effort
   focuses on what tools can't catch.

See `CONTRIBUTING.md` for conventions.

[MIT](LICENSE)
