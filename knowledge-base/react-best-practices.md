# React — Best Practices

Sources: React's official documentation (react.dev — "Rules of
Hooks," "Thinking in React," "You Might Not Need an Effect") and the
*Airbnb React/JSX Style Guide*. Assumes function components + Hooks
(the current React idiom), not legacy class components.
_____________________________________

## Component design
1. Keep components small and focused on one responsibility — split a component when its JSX or state grows unrelated concerns.
2. Prefer function components; reserve class components for code that must interoperate with pre-Hooks APIs.
3. Name components in `PascalCase`; name files to match the component they export.
4. Destructure props at the top of the component instead of repeating `props.x` throughout.
5. Keep presentational (rendering) concerns separate from container (data-fetching/state) concerns where a component does both non-trivially.
6. Prefer composition (children, render props, slots) over deeply nested conditional rendering logic in one component.

## Rules of Hooks
1. Only call Hooks at the top level — never inside loops, conditions, or nested functions.
2. Only call Hooks from React function components or custom Hooks, not plain JS functions.
3. A custom Hook's name must start with `use`, signaling to linters/readers that Hook rules apply to it.
4. `useEffect`/`useMemo`/`useCallback` dependency arrays must list every reactive value the callback reads — don't suppress the exhaustive-deps lint without understanding why.
5. Prefer deriving a value during render over storing it in state and syncing it with an Effect (see "You Might Not Need an Effect").

## State management
1. Keep state as close as possible to the components that use it — lift it up only when siblings actually need to share it.
2. Don't duplicate data in state that can be derived from props/other state during render.
3. Treat state as immutable — always create a new array/object when updating (`setState(prev => ...)`/spread), never mutate in place.
4. Prefer multiple focused `useState` calls (or `useReducer` for related, interdependent fields) over one large ad-hoc state object.
5. Reach for context only for genuinely cross-cutting, widely-shared state (theme, auth, locale) — not as a shortcut around prop drilling for a couple of levels.

## Props and composition
1. Validate/ type props (TypeScript types or `PropTypes`) — don't rely on implicit shapes.
2. Give every prop a sensible default where "not provided" has a reasonable meaning.
3. Avoid passing down more props than a child actually needs ("prop drilling") — restructure via composition or context instead.
4. Prefer explicit, named props over a generic `config`/`options` object when the shape is small and stable.

## Performance
1. Give every item in a list a stable, unique `key` — never the array index if the list can reorder/filter/insert.
2. Reach for `React.memo`/`useMemo`/`useCallback` only after profiling shows a real re-render cost — not reflexively on every component.
3. Keep objects/arrays/functions passed as props stable (memoized) when passed to a memoized child, or the memoization is defeated.
4. Avoid defining components inside another component's render body — it creates a new component type every render, remounting the child.

## Effects and side effects
1. An Effect should synchronize with an external system (subscription, DOM API, network) — if it doesn't touch anything outside React, it's probably not needed.
2. Clean up every subscription/timer/listener an Effect sets up, by returning a cleanup function.
3. Don't fetch data directly in a component's render path without an Effect/framework data-fetching mechanism — it causes request waterfalls and duplicate fetches.

## Testing
1. Test components through their rendered output and user-facing behavior (React Testing Library's philosophy), not internal implementation details/state.
2. Query by role/text/label the way a user would, not by CSS class or test-only IDs where an accessible query is possible.
3. Prefer integration-style tests of a feature's user flow over exhaustively unit-testing every internal function.

A review checklist derived from these practices lives in
`review-guidelines/react-best-practices-checklist.md`; a named
anti-pattern catalog lives in `anti-patterns/react-anti-patterns.md`.
