# ESLint Mapping — JavaScript Repos

Maps JS/React `knowledge-base/` rules to the ESLint rules that enforce
them automatically, for repos **without** TypeScript. Config file:
[`configs/eslint.javascript.config.js`](configs/eslint.javascript.config.js)
(flat config, `@eslint/js` `recommended` + manual bugprone rules to
cover what a type checker would otherwise catch). For TypeScript repos,
see [`eslint-typescript-mapping.md`](eslint-typescript-mapping.md).
Shared rationale/gaps: [`eslint-notes.md`](eslint-notes.md).
_____________________________________

## Mapping by category

| Knowledge-base rule(s) | ESLint rule |
|---|---|
| JS Clean Code: `const`/`let`, no `var` | `prefer-const`, `no-var` |
| JS Clean Code: unused/dead code | `no-unused-vars` |
| JS Clean Code: equality footguns | `eqeqeq` |
| JS Clean Code: implicit type coercion | `no-implicit-coercion` |
| JS Clean Code: variable shadowing | `no-shadow` |
| JS Clean Code: inconsistent return values | `consistent-return` |
| JS Clean Code: import/module hygiene | `import/no-cycle`, `import/no-self-import`, `import/order` |
| React: Rules of Hooks | `react-hooks/rules-of-hooks` (error), `react-hooks/exhaustive-deps` (warn) |
| React: array index as key | `react/no-array-index-key` |
| React: components defined inside components | `react/no-unstable-nested-components` |
| React: missing prop validation | `react/prop-types` (no type checker to rely on instead) |
| React: accessibility | `eslint-plugin-jsx-a11y` `recommended` |

## Formatter: Prettier

See [`.prettierrc.json`](configs/.prettierrc.json) — `eslint-config-prettier`
in the config disables ESLint's own stylistic rules so the two don't fight.
