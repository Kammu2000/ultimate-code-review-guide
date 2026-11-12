# clang-tidy Mapping

Maps `knowledge-base/` rules to `clang-tidy` checks that can enforce
them automatically, so review comments can be replaced by CI failures
where possible. Primary source for check names:
`clang.llvm.org/extra/clang-tidy/checks/list.html`. Rationale for this
config's choices (strictness, exclusions, coverage gaps) lives in
[`clang-tidy-notes.md`](clang-tidy-notes.md).
_____________________________________

## `.clang-tidy` config

```yaml
Checks: >
  -*,
  clang-analyzer-*,
  -clang-analyzer-alpha*,

  bugprone-*,
  cert-*,
  security-*,

  modernize-*,
  -modernize-use-trailing-return-type,
  -modernize-use-nodiscard,

  performance-*,

  cppcoreguidelines-*,
  -cppcoreguidelines-non-private-member-variables-in-classes,

  readability-*,
  misc-*,
  -misc-non-private-member-variables-in-classes
WarningsAsErrors: "*"
HeaderFilterRegex: ".*"
ExcludeHeaderFilterRegex: ""
FormatStyle: file
ExtraArgs:
  - -std=c++23
```

## Mapping by check group

| Check group | Knowledge-base rule(s) |
|---|---|
| `cppcoreguidelines-*` | C++ Core Guidelines doc, all sections (P/I/F/C/R/ES/Con/E/CP) |
| `bugprone-*` / `clang-analyzer-*` | Cross-cutting correctness: Clean Code smells, Design by Contract §5 Assertions, Core Guidelines E (error handling), R (resource management) |
| `cert-*` / `security-*` | No dedicated knowledge-base doc yet — see `clang-tidy-notes.md` |
| `modernize-*` | Better Code "No raw pointers" / "No raw loops", Core Guidelines ES/F modernization idioms |
| `performance-*` | Core Guidelines Per (Performance) — see `clang-tidy-notes.md` for the measure-first caveat |
| `readability-*` | Clean Code: Names rules, Functions rules (size/complexity), Source code structure |
| `misc-*` | Clean Code: Design rules, Objects and data structures; `misc-const-correctness` ≈ Core Guidelines Con.1/Con.2 |
| Design by Contract (contract semantics, concurrency §10) | No direct check — manual review; see GSL `Expects`/`Ensures`, `-Wthread-safety` |
| Anti-patterns: Boolean Flag Argument, Over-Defensive Programming | No check (semantic) — manual review via `review-guidelines/` |

## Formatter: `.clang-format`

Style rules (naming, layout, line length) from Clean Code's "Source
code structure" section and Core Guidelines' `NL:` naming/layout
suggestions are better enforced by `clang-format` than `clang-tidy`.
Start from a base style (`Google`, `LLVM`, or `Microsoft`) and
override specifically where it conflicts with this repo's
conventions, rather than writing one from scratch.

```yaml
BasedOnStyle: Google
ColumnLimit: 100
```
