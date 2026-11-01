# JavaScript — Anti-Patterns

Named, lookup-friendly catalog of JS/TS anti-patterns, derived from
`knowledge-base/javascript-clean-code.md`. See
`review-guidelines/javascript-clean-code-checklist.md` for the
corresponding review questions.
_____________________________________

## Boolean Flag Argument

**What it looks like:** A function takes a `boolean`/mode argument
that switches its internal behavior down two different paths.

**Why it's harmful:** The function no longer does one thing; call
sites become unreadable (`createUser(data, true)` — true *what*?); and
the two behaviors stay coupled in one body even as they diverge.

**Example:**
```js
function createUser(data, isAdmin) {
  if (isAdmin) { /* ... */ } else { /* ... */ }
}
```

**Fix:** Split into two clearly-named functions (`createUser`,
`createAdminUser`) that the caller chooses between directly.

## Callback Hell / Unhandled Promise Rejection

**What it looks like:** Deeply nested `.then()` chains, or an `await`
outside any `try`/`catch` with no `.catch()` attached anywhere in the
chain.

**Why it's harmful:** Nesting obscures control flow and error
propagation; an unhandled rejection can crash a Node process or
silently swallow a failure in the browser.

**Example:**
```js
fetchUser(id).then(user => {
  fetchOrders(user.id).then(orders => {
    render(user, orders); // no .catch() anywhere in this chain
  });
});
```

**Fix:** Use `async`/`await` with a single `try`/`catch` around the
whole operation, or a `.catch()` at the end of the promise chain.

## Mutating Shared State

**What it looks like:** A function mutates an object/array passed in
by reference (or a module-level variable) instead of returning a new
value.

**Why it's harmful:** Callers holding a reference to the original
value are silently affected ("spooky action at a distance"); bugs
appear far from the mutation site and are hard to trace.

**Example:**
```js
function addItem(cart, item) {
  cart.items.push(item); // mutates the caller's object
  return cart;
}
```

**Fix:** Treat data as immutable — return a new object/array
(`[...cart.items, item]`, `{ ...cart, items: [...] }`) rather than
mutating the input.

## Swallowed Errors

**What it looks like:** A `catch` block that's empty, or only logs
without rethrowing/handling, hiding a real failure.

**Why it's harmful:** The program continues in a state the error was
trying to signal is invalid, producing confusing downstream bugs
instead of a clear, immediate failure.

**Example:**
```js
try {
  saveToDisk(data);
} catch (e) {
  // nothing here — failure is invisible
}
```

**Fix:** At minimum log with enough context to diagnose; rethrow if
the caller needs to know, or handle it meaningfully (retry, fallback,
user-facing message) rather than silently continuing.

## God Function / God Module

**What it looks like:** A single function or file accumulates
unrelated responsibilities (parsing, validation, business logic,
rendering) because it was easier to add "just one more thing" there.

**Why it's harmful:** Impossible to test or change in isolation; every
unrelated change risks breaking something else in the same function.

**Fix:** Extract each responsibility into its own named
function/module with a single, clear purpose.
