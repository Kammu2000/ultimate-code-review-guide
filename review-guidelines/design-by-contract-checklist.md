# Design by Contract — Review Checklist

Per-topic PR-review questions derived from `knowledge-base/design-by-contract.md`.
Each heading mirrors that doc's section/subsection numbering so you can jump straight
to the concept, good/bad C++ examples, and C++ application notes behind the matching
topic in that doc.
_____________________________________

## 1. Foundations

### 1.1 Design by Contract

- Is there a stated (not just implied) precondition and postcondition?
- Could a reader determine, from the declaration alone, what inputs are valid?

### 1.2 Caller/Callee Obligations

- When a function receives bad input, does it fail loudly
  (assert/contract) rather than silently substituting a default?
- Is it clear, for any given failure, which side (caller/callee) is
  at fault?

### 1.3 The Contract Metaphor: Client and Supplier

- If the precondition isn't met, is the response genuinely "anything
  goes" (assert/crash/UB), rather than a defensive recovery attempt
  that masks the caller's bug?
- For mutating operations, is there an `old(...)`-style way (in a
  comment, contract clause, or test) to check the state transition
  against its pre-call value, not just the post-call value in
  isolation?
- Do deferred/abstract (virtual, pure-virtual) routines carry their
  own stated precondition/postcondition, not just "implementation
  defined"?

## 2. Preconditions

### 2.1 Valid Inputs

- Are all implicit assumptions about arguments (non-null, non-empty,
  in-range, positive, normalized) written down and, where cheap,
  checked?
- Would a reviewer know, without reading the body, what inputs are
  disallowed?

### 2.2 State Requirements

- Does this method depend on an object being in a particular state
  (open/initialized/locked)? Is that stated and checked?
- Could the type be redesigned (e.g., via the typestate pattern) so
  the invalid state is unrepresentable instead of merely checked?

### 2.3 Boundary Conditions

- What happens at `size() == 0`, `size() == 1`, the first/last
  index, and at numeric limits? Is that behavior intentional and
  documented?
- Are loop bounds and index arithmetic reviewed specifically for
  off-by-one errors at the boundary the precondition describes?

## 3. Postconditions

### 3.1 Return Guarantees

- For every return value, is it clear exactly what guarantee it
  carries (which element, in what order, under what conditions)?
- Does the implementation actually deliver what's documented, not
  just "something plausible"?

### 3.2 State Transitions

- For every mutating method, is the resulting state (not just the
  return value) specified?
- Are "before" and "after" relationships (e.g., `old(size())`)
  captured where the change itself is the main guarantee?

### 3.3 Side Effects

- Does this "pure-looking" function touch global/static state, do
  I/O, or invoke callbacks? Is that disclosed?
- If a function is advertised/assumed to be side-effect-free, is
  that actually true (can it be called twice safely / in parallel)?

## 4. Invariants

### 4.1 Class Invariants

- Is the class invariant stated explicitly (comment or assertion)?
- Can every public method be called in any order/any number of times
  without breaking it? Is the invariant restored before any public
  method returns or calls another public method on `self`?

### 4.2 Data Structure Invariants

- Does this function rely on a structural property (sorted,
  unique, balanced) of its input? Is that stated as a precondition?
- If the structure is mutated elsewhere, is there any guard against
  accidentally breaking the invariant it relies on?

### 4.3 System Invariants

- Is there an invariant that spans more than one object? If so, is
  there a single component responsible for maintaining it, or can
  any code anywhere break it?
- When two pieces of state must change together, is that enforced
  atomically (one method, one transaction) rather than left to
  caller discipline?

## 5. Assertions

### 5.1 `assert` vs. Precondition Checks

- Is this check guarding a programming error (assert) or a genuine
  runtime condition the caller can't control (error handling)?
- Would this assert ever legitimately fire in a correct program? If
  yes, it's not a precondition check — it's a missed error case.

### 5.2 Runtime Checks and Contract Levels

- Is the cost of each check (O(1) vs. O(n) vs. O(n log n)) matched
  to where it runs (always / debug-only / test-only)?
- Are expensive invariant checks available for testing/fuzzing even
  if compiled out of release builds?

### 5.3 Fail-Fast

- When this function receives invalid input, does it fail
  immediately and clearly, or could it propagate corrupted state
  further into the system first?
- Does the assertion message/condition make the *actual* violated
  rule obvious to the next debugger, not just "assertion failed"?

## 6. Function Contracts (Hoare Logic)

### 6.1 Hoare Triples `{P} C {Q}`

- For this line/block, what's the precondition you're assuming, and
  what postcondition does it establish? Is that reasoning written
  down anywhere (comment, assert, test)?
- Does the diff preserve the postcondition the *next* line's
  precondition depends on (the sequencing rule)?

### 6.2 Loop Invariants

- Can you state, in one sentence, what's true at the top of every
  iteration of this loop?
- Does the loop's exit condition, combined with the invariant,
  actually establish what the surrounding code assumes?

## 7. Object-Oriented Contracts

### 7.1 Liskov Substitution Principle

- Does this override accept everything the base method's
  precondition accepted (never a narrower precondition)?
- Does this override still deliver everything the base method's
  postcondition promised (never a weaker postcondition)?
- Would code written and tested only against the base class still
  behave correctly if this override is substituted in?

### 7.2 Subcontracting Rules (Precondition/Postcondition Variance)

- List the base method's precondition and the override's
  precondition side by side: is the override's a superset (weaker
  or equal)?
- List both postconditions side by side: is the override's a
  subset (stronger or equal — i.e., implies the base's)?
- Do subclass invariants still imply their parent's invariant, not
  just hold independently?

## 8. API Contracts

### 8.1 Interface Guarantees

- For a public API change, is it clear which parts of the previous
  behavior were ever promised (and thus must be preserved) versus
  incidental (and thus free to change)?
- Is there a documented stability/versioning policy for this
  surface (enum values, wire format, ABI)?

### 8.2 Error Semantics

- Is the error-reporting mechanism for this function stated and
  consistent with the rest of the API?
- Is the return value `[[nodiscard]]` (or equivalent) so a caller
  can't silently ignore a reported error?

### 8.3 Ownership and Lifetime

- For every pointer/reference parameter and return value, is
  ownership (who deletes it) and lifetime (how long it's valid)
  explicit — ideally from the type itself, not just a comment?
- Are non-owning views (`std::string_view`, `std::span`, raw
  pointer/reference) ever stored beyond the lifetime of what they
  view?

### 8.4 Exception-Handling Responses

- For this `catch` block, which of the three legitimate responses is
  it (retry with a bounded fallback / organized panic that restores
  the invariant then re-signals / false alarm that was never really a
  violation)? If none, is this swallowing a bug?
- Does a "handle and continue" catch block leave the object's
  postcondition/invariant false while reporting success?
- Is the exception/error re-thrown or converted with enough
  information for the client to understand what failed, rather than
  losing context in a generic rethrow?

## 9. State Management

### 9.1 Valid State Transitions

- Can you draw the state machine this type implements? Are illegal
  transitions actually prevented (asserted, or unrepresentable),
  or merely assumed not to happen?
- Could the type be split (typestate pattern — a distinct type per
  state) so illegal transitions don't compile instead of merely
  asserting at runtime?

### 9.2 Transactional Guarantees

- What exception-safety guarantee does this function provide — is
  it stated, and does the implementation actually deliver it?
- On the failure path, is partially-mutated state discarded
  ("let it flow") rather than left half-applied and reachable?

## 10. Concurrency

### 10.1 Thread-Safety Contracts

- Is the thread-safety level of this type/function stated
  explicitly (not left to be inferred from "it has a mutex
  somewhere")?
- Does every shared-mutable-state access actually match the stated
  guarantee (no plain reads/writes where atomics or locks are
  required)?

### 10.2 Synchronization Contracts

- If this function acquires more than one lock, is the acquisition
  order documented and consistent with every other place that
  acquires the same locks?
- Is this function (or anything it calls) ever invoked while the
  caller already holds one of its locks (reentrancy)?

### 10.3 Linearizability

- For this concurrent data structure, is there a stated consistency
  model (linearizable, sequentially consistent, eventually
  consistent)? Does the implementation match it?
- Could two concurrent calls interleave to produce a result no
  sequential execution could have produced?

## 11. Testing

### 11.1 Property-Based Testing

- For this function's postcondition, is there a test that checks it
  as a *property* across many generated inputs, not just one example?
- Do the generated inputs actually explore the precondition's full
  valid domain, including its boundaries (§2.3)?

### 11.2 Contract Testing

- For every stated precondition, is there a test proving a
  violation is actually caught (not silently accepted)?
- For every stated postcondition, is there a test at the boundary
  of the precondition's valid domain, not just a comfortable
  mid-range example?

### 11.3 Invariant Testing (Fuzzing)

- Is there a fuzz/stress test that exercises long, randomized
  operation sequences on this stateful type and checks its
  invariant after each step?
- Are invariant checks available in a form the fuzzer/sanitizer
  build can run (not compiled out in exactly the build that fuzzes)?

## 12. Anti-Patterns

### 12.1 Over-Defensive Programming

- Is this check validating something the type system or an
  upstream precondition already guarantees? If so, is `assert`
  more appropriate than a silent `if`/early-return?
- Is the same condition checked redundantly at multiple layers,
  each one unsure whether the others already checked it?

### 12.2 Weak Contracts

- Could you write a contract test (§11.2) directly from this
  documentation without guessing? If not, the contract is too weak.
- Does the doc state concrete values/ranges/behaviors, or only
  vague adjectives ("properly," "correctly," "as expected")?

### 12.3 Redundant Checks

- Is there one clearly designated layer (trust boundary) where this
  data is validated, with everything downstream relying on (and
  asserting, not re-checking) that validation?
- When the validation rule changes, is there exactly one place to
  update it, or does the diff need to touch several redundant checks?
