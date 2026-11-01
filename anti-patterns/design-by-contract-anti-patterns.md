# Design by Contract — Anti-Patterns

Named, lookup-friendly catalog of contract-related anti-patterns, for
linking to from PR comments ("this is an instance of X"). Sourced from
`knowledge-base/design-by-contract.md` §12. See that doc for the
full concept/good-example/C++-application treatment, and
`review-guidelines/design-by-contract-checklist.md` for the
corresponding review questions.
_____________________________________

## Over-Defensive Programming

**What it looks like:** A function adds a runtime check/fallback for a
condition that is actually the caller's documented responsibility (a
precondition), instead of asserting and trusting the contract.

**Why it's harmful:** Every caller up the chain tends to add the same
redundant check "just in case," doubling the code; a real caller bug
gets silently papered over with a default instead of surfacing; and
it becomes impossible to tell deliberate paranoia from a genuine
runtime-error path.

**Example:**
```cpp
void process(Widget* ptr) {
  if (ptr == nullptr) { return; } // silently no-ops on a caller bug,
                                    // and every caller up the chain
                                    // does the same null check again
  ptr->run();
}
```

**Fix:** State the precondition explicitly and `assert()` it instead
of silently handling it; prefer references over pointers where null
isn't meaningful, eliminating the check entirely. Reserve `if`-based
runtime handling for genuine runtime errors the callee cannot prevent
(I/O, resource exhaustion), not caller-contract violations.

## Weak Contracts

**What it looks like:** A stated contract so vague it fails to
actually constrain behavior — "handles errors appropriately," "works
for valid input" — technically documented, practically useless.

**Why it's harmful:** It gives false confidence: the function *looks*
documented, so reviewers stop asking questions, but no one can
actually reason about correctness or safely refactor the
implementation against it.

**Example:**
```cpp
/// Converts a percent to a fraction. Handles edge cases properly.
double to_fraction(int percent); // which edge cases? what's "properly"?
```

**Fix:** Replace adjectives with checkable, `assert`-able conditions:
state the concrete precondition (e.g. `0 <= percent && percent <= 100`)
and postcondition (the exact returned range/value) in `\pre`/`\post`.
If a condition genuinely can't be stated precisely, the function's
responsibility is probably still underspecified and needs to be split.

## Redundant Checks

**What it looks like:** The same condition is re-validated at multiple
layers of a call chain, with no single layer designated as the
authoritative validator.

**Why it's harmful:** Costs performance, obscures which layer actually
"owns" the validation (compounding Weak Contracts above), and the
duplicated checks tend to drift out of sync as one layer is updated
and the others aren't.

**Example:**
```cpp
// Every layer re-validates the same already-validated data,
// independently, with slightly different (and drifting) rules.
Config load_config(const std::string& raw) {
  if (!looks_valid(raw)) throw std::runtime_error("bad");
  auto parsed = parse(raw);
  if (!parsed.is_valid()) throw std::runtime_error("still bad");
  auto config = build_config(parsed);
  if (!config.is_valid()) throw std::runtime_error("bad again");
  return config;
}
```

**Fix:** Validate once, at the system's external trust boundary
(deserialization, user input, network). Internally, use `assert()` to
cheaply document and verify the data is still valid rather than
re-running the full validation logic at every layer.
