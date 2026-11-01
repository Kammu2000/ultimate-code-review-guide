# Knowledge Base

Distilled, crisp notes from authoritative software-design sources. Each
file summarizes one source's principles in a scannable, numbered-list
format (not a copy of the original text) so it can quickly be mined
for review guidelines and anti-patterns.

## Sources

| File | Area | Source |
|---|---|---|
| [`clean-code.md`](clean-code.md) | General | *Clean Code*, Robert C. Martin |
| [`better-code.md`](better-code.md) | C++ | *Better Code* talk series & book, Sean Parent & David Abrahams (STLab) |
| [`design-by-contract.md`](design-by-contract.md) | General/C++ | Bertrand Meyer's Design by Contract theory (Eiffel), expanded into a 12-topic, in-depth PR-review reference: each topic has concept / why it matters / good & bad C++ examples / C++ application |
| [`cpp-core-guidelines.md`](cpp-core-guidelines.md) | C++ | *C++ Core Guidelines*, Bjarne Stroustrup & Herb Sutter (isocpp) |
| [`javascript-clean-code.md`](javascript-clean-code.md) | JS/TS | *Clean Code JavaScript* (community adaptation) & *Airbnb JavaScript Style Guide* |
| [`react-best-practices.md`](react-best-practices.md) | React | React official docs (react.dev) & *Airbnb React/JSX Style Guide* |

## Planned

- `effective-modern-cpp.md` — *Effective Modern C++*, Scott Meyers

## Conventions

- One file per source, named in kebab-case.
- Start with a one- or two-line attribution/summary, then `___` divider.
- Group rules under `##` topic headings; keep each rule to one numbered
  line (add a short clause after a period for elaboration, not a
  paragraph).
- Prefer the source's own terminology over paraphrase so the notes
  stay traceable back to the original.
