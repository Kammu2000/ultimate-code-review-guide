# Contributing

## Adding a knowledge-base source

1. Create `knowledge-base/<source-name>.md` (kebab-case).
2. Start with a 1-2 line attribution of the source, then a `___` divider.
3. Distill the source into numbered rules grouped under `##` topic
   headings — concise and scannable, not a copy of the original text.
4. Update `knowledge-base/README.md`'s source table.

## Promoting rules into guidelines/anti-patterns

- Once a rule is actionable and checkable in a review, add it to the
  relevant file under `review-guidelines/`, citing its knowledge-base
  source.
- If the rule describes a recurring mistake, also add an entry to
  `anti-patterns/` using the proposed entry format in its README.

## Automating a rule

- If a linter/formatter can enforce a rule, add the config under
  `automation/<toolchain>/` and record the mapping in
  `automation/README.md` (or its `mapping.md` once created).

## General conventions

- Markdown only; no generated/build artifacts committed.
- Keep file names and headings stable once referenced elsewhere (for
  linkability).
- Prefer short, numbered, imperative statements over prose.
