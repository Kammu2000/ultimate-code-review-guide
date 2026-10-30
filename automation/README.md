# Automation

Linter/formatter configuration that mechanically enforces the rules
that can be enforced mechanically, plus a mapping table of which
knowledge-base rules are automated vs. require manual review.

## Status

Empty — to be populated once review-guidelines exist to drive tool
configuration. Planned layout: one directory per toolchain (e.g.
`cpp/.clang-format`, `cpp/.clang-tidy`) plus a root `mapping.md`
table: rule -> enforced by (tool + rule id) or "manual review only".

## Why this matters

Every rule we can push into a linter/formatter is a rule reviewers
never have to manually check again — automation.md's mapping table
keeps that boundary explicit so review-guidelines stays focused on
what tools can't catch.
