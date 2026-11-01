# React Best Practices — Review Checklist

PR-review questions derived from `knowledge-base/react-best-practices.md`.
_____________________________________

## Component design
1. Does this component do one coherent thing, or is it growing unrelated responsibilities?
2. Is this a function component (not a new class component, absent a specific interop reason)?
3. Are props destructured up front rather than accessed as `props.x` scattered through the body?
4. Could nested conditional-rendering logic be simplified via composition (children/render props) instead?

## Rules of Hooks
1. Are all Hooks called unconditionally at the top level (no Hooks inside `if`/loops/nested functions)?
2. Is every custom Hook named starting with `use`?
3. Does every `useEffect`/`useMemo`/`useCallback` dependency array include every reactive value it reads, with no unexplained lint-rule suppression?
4. Could a value stored in state and synced via an Effect instead just be derived during render?

## State management
1. Is state kept as local as possible, only lifted up where siblings genuinely need to share it?
2. Is any piece of state duplicating something already derivable from props/other state?
3. Is state always updated immutably (new object/array), with no direct mutation of the previous state?
4. Would `useReducer` better express this set of interdependent `useState` calls?
5. Is context being used for genuinely cross-cutting state, or as a shortcut around a couple of levels of prop drilling?

## Props and composition
1. Are props typed (TypeScript/PropTypes), with sensible defaults where "not provided" is meaningful?
2. Is this component prop-drilling data through several layers that don't use it themselves?

## Performance
1. Does every list item have a stable, unique `key` (not the array index, if the list can reorder/filter/insert)?
2. Is `memo`/`useMemo`/`useCallback` justified by a measured re-render cost, not applied reflexively?
3. If a prop is passed to a memoized child, is it referentially stable (memoized) itself?
4. Is any component defined inside another component's render body (causing remounts every render)?

## Effects and side effects
1. Does this Effect synchronize with something external to React (subscription, DOM, network), or could it be removed?
2. Does the Effect clean up every subscription/timer/listener it sets up?
3. Is data fetched via an Effect/framework mechanism rather than directly during render?

## Testing
1. Does the test exercise the component's user-facing behavior, rather than its internal state/implementation?
2. Are elements queried the way a user would (role/text/label), rather than by CSS class or test-only ID where avoidable?
