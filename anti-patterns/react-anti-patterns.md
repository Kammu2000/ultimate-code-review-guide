# React — Anti-Patterns

Named, lookup-friendly catalog of React anti-patterns, derived from
`knowledge-base/react-best-practices.md`. See
`review-guidelines/react-best-practices-checklist.md` for the
corresponding review questions.
_____________________________________

## Array Index as `key`

**What it looks like:** Using the array index as the `key` prop for a
list that can be reordered, filtered, or have items inserted/removed.

**Why it's harmful:** React uses `key` to match list items across
renders; when the index is the key and the list order/length changes,
React can associate the wrong state/DOM node with the wrong item,
causing input focus loss, stale state, or visually wrong updates.

**Example:**
```jsx
{items.map((item, i) => <Item key={i} {...item} />)}
```

**Fix:** Use a stable, unique identifier from the data itself
(`item.id`), not the index.

## Derived State Stored and Synced via Effect

**What it looks like:** A value that could be computed directly from
props/state during render is instead stored in its own `useState` and
kept in sync with a `useEffect`.

**Why it's harmful:** Adds an extra render pass, a source of
staleness/bugs if the Effect's dependencies are wrong, and
complexity that pure derivation during render wouldn't have.

**Example:**
```jsx
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

**Fix:** Compute it directly during render:
```jsx
const fullName = `${firstName} ${lastName}`;
```

## Prop Drilling

**What it looks like:** A prop is threaded through several
intermediate components that don't use it themselves, just to reach a
deeply nested child.

**Why it's harmful:** Every intermediate component becomes coupled to
a prop it doesn't care about; adding/renaming the prop requires
touching every layer in between.

**Fix:** Restructure via composition (pass the already-rendered child
as `children`/a render prop) or, for genuinely cross-cutting data,
use context — not as a reflexive fix for every drilling case, only
where the data is truly widely shared.

## Direct State Mutation

**What it looks like:** Mutating a state array/object in place (e.g.
`state.items.push(x)`) instead of calling the setter with a new value.

**Why it's harmful:** React compares state by reference to decide
whether to re-render; a mutated-in-place object looks "unchanged" to
React, so the UI silently fails to update, or updates inconsistently.

**Example:**
```jsx
const [items, setItems] = useState([]);
function addItem(item) {
  items.push(item); // mutates in place; setItems is never even called
}
```

**Fix:** Always produce a new array/object:
```jsx
setItems(prev => [...prev, item]);
```

## Component Defined Inside Another Component

**What it looks like:** A child component function is declared inside
a parent component's body (often to "close over" local variables).

**Why it's harmful:** React treats the inner function as a brand-new
component type on every parent render, unmounting and remounting the
child (losing its state, re-running its Effects) even though nothing
conceptually changed.

**Example:**
```jsx
function Parent({ items }) {
  function Child({ item }) { return <li>{item}</li>; } // new identity every render
  return <ul>{items.map(i => <Child key={i.id} item={i} />)}</ul>;
}
```

**Fix:** Define components at module scope; pass needed values as
props instead of closing over them.

## Effect Overuse (Missing External Synchronization)

**What it looks like:** A `useEffect` whose body doesn't touch
anything outside React (no subscription, DOM API, or network call) —
it's just reacting to a prop/state change to compute or set other
state.

**Why it's harmful:** Adds an unnecessary extra render, obscures data
flow (two renders to reach the final UI instead of one), and is a
common source of infinite-loop bugs when dependencies are wrong.

**Fix:** Compute the value directly during render, or move the logic
into the event handler that caused the change, rather than reacting
to it after the fact in an Effect.
