# React — Anti-Pattern Checklist

Lookup-friendly red flags for React review.
_____________________________________

| Anti-pattern | Red flag |
|---|---|
| Array Index as `key` | The array index is used as the `key` prop for a list that can be reordered, filtered, or have items inserted/removed. |
| Derived State Stored and Synced via Effect | A value computable from props/state during render is instead stored in its own `useState` and kept in sync with a `useEffect`. |
| Prop Drilling | A prop is threaded through several intermediate components that don't use it themselves, just to reach a deeply nested child. |
| Direct State Mutation | State is mutated in place (`state.items.push(x)`) instead of calling the setter with a new value. |
| Component Defined Inside Another Component | A child component function is declared inside a parent component's body, getting a new identity every parent render. |
| Effect Overuse (Missing External Synchronization) | A `useEffect` body doesn't touch anything outside React (no subscription/DOM API/network call) — it just reacts to a prop/state change. |
