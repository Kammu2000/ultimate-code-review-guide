# ESLint Notes

Rationale behind the two ESLint configs' choices, kept out of the
mapping tables to keep those scannable.

## Why two configs, not one

TypeScript's compiler already catches a large class of bugs (wrong
types, unsafe `any` flow, unhandled promise branches) that plain
JavaScript has no equivalent static check for. Reusing one config for
both either under-lints JS repos or forces TS-only rules onto repos
that can't satisfy them (no type information available). Splitting
means each config only requires what its ecosystem can actually
provide.

## TypeScript config

- Built on `typescript-eslint`'s `strict-type-checked` +
  `stylistic-type-checked` presets — these require a `tsconfig.json`
  (via `projectService: true`) and are the most rule-complete,
  bug-catching presets the project ships (stricter than
  `recommended`).
- `configs/tsconfig.json` pairs with it: `strict: true` plus
  `noUnusedLocals`/`noUnusedParameters`/`noFallthroughCasesInSwitch`
  so the compiler itself — not just the linter — rejects the same bug
  classes. `jsx: "react-jsx"` assumes the modern JSX transform, which
  is also why `react/react-in-jsx-scope` is off.
- `react/prop-types` is turned off — redundant once props are typed.

## JavaScript config

- No type checker available, so a handful of ESLint core rules
  (`eqeqeq`, `no-shadow`, `no-implicit-coercion`, `consistent-return`)
  are added explicitly to approximate bug classes TypeScript would
  otherwise catch for free.
- `react/prop-types` stays on, since there's no type system to lean on
  instead.

## Shared across both

- React, Hooks, and accessibility rules (`eslint-plugin-react`,
  `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`) are identical
  in both configs — these concerns don't depend on TypeScript.
- `eslint-config-prettier` is always last in the config array, so
  Prettier formatting and ESLint style rules never fight each other.
- `react-hooks/exhaustive-deps` is `warn`, not `error` — it has known
  false positives; tune per-project rather than blocking CI on it.
