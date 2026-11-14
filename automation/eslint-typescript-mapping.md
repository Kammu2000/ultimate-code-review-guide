# ESLint Mapping — TypeScript Repos

Maps JS/TS/React `knowledge-base/` rules to the ESLint rules that
enforce them automatically, for repos using TypeScript. Config files:
[`configs/eslint.typescript.config.js`](configs/eslint.typescript.config.js)
(flat config, `typescript-eslint` `strict-type-checked` +
`stylistic-type-checked`) and [`configs/tsconfig.json`](configs/tsconfig.json)
(strict compiler options required by the config's type-aware rules).
For plain JS repos, see
[`eslint-javascript-mapping.md`](eslint-javascript-mapping.md). Shared
rationale/gaps: [`eslint-notes.md`](eslint-notes.md).
_____________________________________

## Mapping by category

| Knowledge-base rule(s) | ESLint rule |
|---|---|
| JS Clean Code: `const`/`let`, no `var` | `prefer-const`, `no-var` (covered by `strict-type-checked`) |
| JS Clean Code: unused/dead code | `@typescript-eslint/no-unused-vars` |
| JS Clean Code: swallowed errors / unhandled promise rejection | `@typescript-eslint/no-floating-promises`, `@typescript-eslint/no-misused-promises` |
| JS Clean Code: type safety at module boundaries | `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-unsafe-*` (all in `strict-type-checked`) |
| JS Clean Code: equality footguns | `eqeqeq` (covered by `strict-type-checked`) |
| JS Clean Code: import/module hygiene | `import/no-cycle`, `import/no-self-import`, `import/order` |
| React: Rules of Hooks | `react-hooks/rules-of-hooks` (error), `react-hooks/exhaustive-deps` (warn) |
| React: array index as key | `react/no-array-index-key` |
| React: components defined inside components | `react/no-unstable-nested-components` |
| React: missing prop validation | Not needed — TypeScript prop typing replaces `react/prop-types` (turned off) |
| React: accessibility | `eslint-plugin-jsx-a11y` `recommended` |

## Formatter: Prettier

See [`.prettierrc.json`](configs/.prettierrc.json) — `eslint-config-prettier`
in the config disables ESLint's own stylistic rules so the two don't fight.
