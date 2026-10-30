# Knowledge Base

Distilled, crisp notes from authoritative software-design sources. Each
file summarizes one source's principles in a scannable, numbered-list
format (not a copy of the original text) so it can quickly be mined
for review guidelines and anti-patterns.

## Sources

| File | Source |
|---|---|
| [`clean-code.md`](clean-code.md) | *Clean Code*, Robert C. Martin |
| [`better-code.md`](better-code.md) | *Better Code* talk series & book, Sean Parent & David Abrahams (STLab) |

## Planned

- `design-by-contract.md` — Bertrand Meyer's Design by Contract (Eiffel)
- `effective-modern-cpp.md` — *Effective Modern C++*, Scott Meyers

## Conventions

- One file per source, named in kebab-case.
- Start with a one- or two-line attribution/summary, then `___` divider.
- Group rules under `##` topic headings; keep each rule to one numbered
  line (add a short clause after a period for elaboration, not a
  paragraph).
- Prefer the source's own terminology over paraphrase so the notes
  stay traceable back to the original.
