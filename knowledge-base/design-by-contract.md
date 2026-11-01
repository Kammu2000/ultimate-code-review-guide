# Design by Contract

Design by Contract (DbC) was introduced by Bertrand Meyer for Eiffel
(*Object-Oriented Software Construction*, 1988) and is the theoretical
foundation for precondition/postcondition/invariant reasoning in any
language, including modern C++ (`assert()`, Doxygen `\pre`/`\post`,
and C++26 contract syntax). This doc covers both Meyer's original
theory and its in-depth, per-topic application to C++ code review: for
every principle you get the concept, why it matters, a good and a bad
example, and how it maps onto modern C++.

**Template used for every principle:**
1. **Concept** — the idea.
2. **Why it matters** — the class of bugs it prevents.
3. **Good example** — correct implementation.
4. **Bad example** — a common violation.
5. **C++ application** — how it translates into modern C++.

Per-topic review checklists derived from these principles live in
`review-guidelines/design-by-contract-checklist.md`. Named
anti-pattern entries from §12 are also cataloged in
`anti-patterns/design-by-contract-anti-patterns.md`.
_____________________________________

## 1. Foundations

### 1.1 Design by Contract

1. **Concept:** Every function/type has an implicit or explicit
   contract: a precondition the caller must satisfy, a postcondition
   the callee guarantees in return, and invariants both sides can rely
   on in between. A contract is part of the interface, not a comment.
2. **Why it matters:** Without a stated contract, "correct" is
   undefined, so neither caller nor reviewer can tell a bug from
   intended behavior. Contracts turn "it doesn't work right" into a
   falsifiable, localized claim.
3. **Good example:**
   ```cpp
   // Precondition: 0 <= index && index < size().
   // Postcondition: returns the element stored at `index`; `*this`
   // is unchanged.
   const T& at(std::size_t index) const;
   ```
4. **Bad example:**
   ```cpp
   // Gets an element.
   const T& at(std::size_t index) const;
   ```
   No stated range, no stated behavior on out-of-range `index` — every
   caller and reviewer must guess, and the guess will diverge over time.
5. **C++ application:** Use Doxygen `\pre`/`\post`, `assert()`,
   `[[gnu::nonnull]]`/references instead of pointers, and — where
   available — C++26 contract syntax (`pre(...)`, `post(...)`,
   `contract_assert(...)`) to make the contract checkable, not just
   documented.

### 1.2 Caller/Callee Obligations

1. **Concept:** A precondition violation is a bug in the *caller*; a
   postcondition violation despite a satisfied precondition is a bug
   in the *callee*. Knowing which side owns which obligation tells you
   where to look — and where *not* to add a defensive check.
2. **Why it matters:** Without this split, every bug report degenerates
   into "well, both sides could be wrong," and defensive checks get
   added on both sides, doubling the code and hiding real bugs behind
   silently-swallowed error paths.
3. **Good example:**
   ```cpp
   // Precondition: divisor != 0.
   int divide(int dividend, int divisor) {
     assert(divisor != 0); // caller's bug if this fires
     return dividend / divisor;
   }
   ```
4. **Bad example:**
   ```cpp
   int divide(int dividend, int divisor) {
     if (divisor == 0) return 0; // silently "handles" a caller bug
     return dividend / divisor;
   }
   ```
   Returning `0` hides a caller bug as a plausible-looking result
   instead of surfacing it.
5. **C++ application:** Use `assert()`/contract preconditions for
   caller bugs (compiled out in release, since a correct caller never
   triggers them); reserve `std::expected`/exceptions/error codes for
   genuine runtime errors the callee cannot prevent (see §8.2).

### 1.3 The Contract Metaphor: Client and Supplier

1. **Concept:** Meyer frames every call as a transaction between a
   *client* (the caller, who wants work done) and a *supplier* (the
   callee, who promises to do it). The contract is symmetric: the
   client owes the precondition, the supplier owes the postcondition
   and invariant, exactly like a legal contract obliges both parties
   and protects neither from the other's breach. Meyer calls this the
   "law of excluded miracles": a supplier is never obligated to do the
   impossible — if the client didn't uphold its half (the
   precondition), the supplier owes nothing and any behavior
   (including crashing) is a valid response. Contracts also use an
   `old` notation (`old(expr)`) to refer to the value of an expression
   *before* the call, so a postcondition can describe a state
   transition precisely (e.g., `count = old(count) + 1`). Finally,
   contracts attach to *deferred* (abstract) routines — a routine with
   no body still carries a precondition/postcondition that every
   future implementation must honor.
2. **Why it matters:** Thinking in client/supplier terms stops
   "defensive programming creep": once you know the supplier's
   postcondition is only owed *if* the client met the precondition,
   you stop re-checking things the client already guaranteed. The
   "law of excluded miracles" is the theoretical justification for
   `assert()`-and-crash on precondition violations rather than
   silently recovering — recovering from an impossible situation is
   itself usually the bug. `old(...)` closes the gap where
   postconditions on mutating calls are otherwise unverifiable
   ("changed how, from what?"). Contracts on deferred routines are
   what let Liskov-Substitutable hierarchies exist at all (see §7).
3. **Good example:**
   ```cpp
   /// Precondition: !empty().
   /// Postcondition: size() == old(size()) - 1.
   void pop_front();
   ```
   The `old(size())` makes the shrink-by-one guarantee checkable
   against a captured pre-call snapshot, independent of how `pop_front`
   is implemented.
4. **Bad example:**
   ```cpp
   // Removes the front element, if there is one.
   void pop_front(); // "if there is one" blurs client/supplier
                      // ownership: does an empty container make this
                      // a silent no-op, or UB? Nobody can tell from
                      // the contract, so every caller must guess.
   ```
5. **C++ application:** C++26 contracts support `post(r: r == old(size) - 1)`-style
   clauses natively; until then, capture pre-state in tests
   (`auto before = size(); pop_front(); assert(size() == before - 1);`)
   and keep `\pre`/`\post` Doxygen comments phrased in client/supplier
   terms ("caller must ensure..." / "this function guarantees...")
   rather than passive voice that hides who owes what.

## 2. Preconditions

### 2.1 Valid Inputs

1. **Concept:** State, as part of the function's contract, exactly
   which argument values are acceptable — not just their static type.
2. **Why it matters:** Type systems only narrow the *domain* of a
   function; most real precondition violations (null pointers, empty
   containers, out-of-range indices) live inside a type's valid range
   and are invisible to the compiler.
3. **Good example:**
   ```cpp
   /// Precondition: `path` is non-empty and refers to an existing file.
   std::ifstream open_existing(const std::filesystem::path& path) {
     assert(!path.empty());
     assert(std::filesystem::exists(path));
     return std::ifstream(path);
   }
   ```
4. **Bad example:**
   ```cpp
   std::ifstream open_existing(const std::filesystem::path& path) {
     return std::ifstream(path); // silently produces a failed stream
   }
   ```
5. **C++ application:** Prefer types that make invalid input
   unrepresentable (`std::span` over `(ptr, len)`, `std::string_view`
   over raw `const char*`, a `NonEmptyVector<T>` wrapper) over
   documentation alone — "no raw loops" has a precondition cousin:
   "no raw preconditions that a type could enforce instead."

### 2.2 State Requirements

1. **Concept:** A precondition can constrain not just arguments but
   the state of `*this` or of global/shared state (e.g., "the
   connection must be open," "the iterator must not be invalidated").
2. **Why it matters:** State-based preconditions are the most common
   source of use-after-free, double-close, and use-before-init bugs,
   because the "input" being violated isn't in the argument list.
3. **Good example:**
   ```cpp
   class Connection {
    public:
     /// Precondition: is_open().
     void send(std::span<const std::byte> data) {
       assert(is_open());
       // ...
     }
     bool is_open() const noexcept;
   };
   ```
4. **Bad example:**
   ```cpp
   void send(std::span<const std::byte> data) {
     // Attempts to write even if the socket was never opened or was
     // already closed; fails confusingly deep in OS calls.
     ::write(fd_, data.data(), data.size());
   }
   ```
5. **C++ application:** Model state requirements as compile-time
   typestates where feasible (a `ClosedConnection`/`OpenConnection`
   pair of types instead of one type with a runtime flag); otherwise
   assert the state at entry.

### 2.3 Boundary Conditions

1. **Concept:** Preconditions must explicitly address edges: empty
   containers, zero/negative sizes, min/max representable values,
   first/last iterator, single-element ranges.
2. **Why it matters:** Boundary conditions are where off-by-one errors,
   integer overflow, and iterator invalidation concentrate; leaving
   them unstated means every implementation (and every caller) resolves
   them differently.
3. **Good example:**
   ```cpp
   /// Precondition: `!v.empty()`.
   /// Postcondition: returns the largest element of `v`.
   int max_of(const std::vector<int>& v) {
     assert(!v.empty());
     return *std::max_element(v.begin(), v.end());
   }
   ```
4. **Bad example:**
   ```cpp
   int max_of(const std::vector<int>& v) {
     return *std::max_element(v.begin(), v.end()); // UB if v is empty
   }
   ```
5. **C++ application:** Combine `assert()` boundary checks with
   algorithms that encode the boundary in their type (`std::span`
   emptiness, `std::optional` for "may not exist") rather than
   relying on sentinel values like `-1` or `nullptr`.

## 3. Postconditions

### 3.1 Return Guarantees

1. **Concept:** The postcondition states what is guaranteed about the
   return value when the precondition held — not every possible
   implementation detail, just the author's intended contract (e.g.,
   "returns the first match" vs. "returns *a* match").
2. **Why it matters:** Without a stated return guarantee, callers can't
   rely on properties (stability of sort, which duplicate is returned)
   that the current implementation happens to provide, and a
   refactor that preserves the *documented* contract can silently
   break callers depending on undocumented behavior.
3. **Good example:**
   ```cpp
   /// Postcondition: returns the index of the first element equal to
   /// `value`, or `v.size()` if none is found.
   std::size_t find_first(const std::vector<int>& v, int value);
   ```
4. **Bad example:**
   ```cpp
   // Finds value in v.
   std::size_t find_first(const std::vector<int>& v, int value);
   ```
   "Finds" doesn't say which occurrence, nor what happens when absent.
5. **C++ application:** Use `[[nodiscard]]` to force callers to
   observe return values whose postcondition matters (e.g., error
   codes, `std::expected`), and Doxygen `\post`/contract `post(...)`
   clauses to state the guarantee next to the declaration.

### 3.2 State Transitions

1. **Concept:** A postcondition on a mutating operation states how
   `*this` (and any aliased state) changed, often via `old(...)`
   (e.g., `count() == old(count()) + 1`).
2. **Why it matters:** Mutating operations are exactly where
   "did it actually do what I expected" bugs hide, since the return
   value (if any) doesn't capture the full effect.
3. **Good example:**
   ```cpp
   /// Postcondition: size() == old(size()) + 1 && back() == value.
   void push_back(T value);
   ```
4. **Bad example:**
   ```cpp
   // Adds value.
   void push_back(T value); // doesn't say where, or what happens to size()
   ```
5. **C++ application:** Prefer the C++26 contract `post(r: ...)` form
   or explicit `\post` comments referencing prior state; in tests,
   assert state transitions directly (e.g., capture `size()` before
   and after a call) rather than only checking the return value.

### 3.3 Side Effects

1. **Concept:** The postcondition/documentation must disclose side
   effects beyond the return value and `*this`: I/O, logging, global
   state mutation, callback invocation, memory allocation.
2. **Why it matters:** Undisclosed side effects break the assumption
   that a function "just computes a result," leading to double I/O,
   unexpected ordering dependencies, and surprising performance.
3. **Good example:**
   ```cpp
   /// Postcondition: returns the parsed value.
   /// Side effect: logs a warning via `g_logger` if the input needed
   /// normalization.
   Config parse(std::string_view raw);
   ```
4. **Bad example:**
   ```cpp
   // Parses config.
   Config parse(std::string_view raw); // silently writes to g_logger,
                                        // a global mutable singleton
   ```
5. **C++ application:** Mark genuinely side-effect-free functions
   `constexpr`/`[[nodiscard]]` and `noexcept` where applicable as a
   machine-checked signal; for the rest, document side effects
   explicitly rather than letting "it's just a getter" be assumed.

## 4. Invariants

### 4.1 Class Invariants

1. **Concept:** A condition that holds for every instance of a class
   at every point it's observable from outside — after construction
   and after every public method returns.
2. **Why it matters:** Invariants are what let callers treat an object
   as "in a good state" without re-verifying its internals on every
   use; losing one silently is the root cause of most "works until it
   doesn't" bugs.
3. **Good example:**
   ```cpp
   class PairArray {
    public:
     // Invariant: xs_.size() == ys_.size().
     void append(int x, int y) {
       xs_.push_back(x);
       ys_.push_back(y); // invariant restored before returning
     }
    private:
     std::vector<int> xs_, ys_;
   };
   ```
4. **Bad example:**
   ```cpp
   class PairArray {
    public:
     void append_x(int x) { xs_.push_back(x); } // can be called alone,
     void append_y(int y) { ys_.push_back(y); } // breaking the invariant
    private:
     std::vector<int> xs_, ys_;
   };
   ```
5. **C++ application:** Keep invariant-bearing members `private`;
   establish the invariant in every constructor; optionally add a
   private `check_invariant()` called under `assert()` at the top/
   bottom of mutating methods in debug builds.

### 4.2 Data Structure Invariants

1. **Concept:** Invariants specific to a data structure's shape or
   ordering (sortedness, heap property, balanced-tree height, acyclic
   graph, no duplicate keys).
2. **Why it matters:** Algorithms that assume a structural invariant
   (binary search assumes sortedness) produce *wrong answers, not
   crashes*, when the invariant is silently violated — the worst kind
   of bug because it's quiet.
3. **Good example:**
   ```cpp
   /// Precondition: `v` is sorted in ascending order (an invariant
   /// this function relies on but does not establish).
   bool binary_contains(const std::vector<int>& v, int value) {
     return std::binary_search(v.begin(), v.end(), value);
   }
   ```
4. **Bad example:**
   ```cpp
   bool binary_contains(const std::vector<int>& v, int value) {
     return std::binary_search(v.begin(), v.end(), value);
     // called on an unsorted vector elsewhere in the codebase —
     // compiles, runs, and returns wrong answers silently
   }
   ```
5. **C++ application:** Encapsulate structure-dependent invariants in
   a dedicated type (`SortedVector<T>`) rather than trusting every
   call site to keep a raw `std::vector` sorted; use
   `assert(std::is_sorted(...))` at entry in debug builds for functions
   that must receive sorted input but can't own the type.

### 4.3 System Invariants

1. **Concept:** Invariants that span multiple objects/components
   (e.g., "every `Employee` in `department.employees` has
   `employee.department_id == department.id`").
2. **Why it matters:** Cross-object invariants are the hardest to
   maintain because no single class's encapsulation can enforce them;
   they require discipline (or a mediating component) across the
   whole subsystem.
3. **Good example:**
   ```cpp
   // Mediator owns both sides of the relationship and is the only
   // code allowed to mutate either collection, so it can guarantee
   // the cross-object invariant.
   class OrgChart {
    public:
     void assign(EmployeeId e, DepartmentId d) {
       employees_[e].department_id = d;
       departments_[d].employee_ids.insert(e);
     }
    private:
     std::unordered_map<EmployeeId, Employee> employees_;
     std::unordered_map<DepartmentId, Department> departments_;
   };
   ```
4. **Bad example:**
   ```cpp
   // Any code anywhere can mutate either side independently —
   // nothing keeps employee.department_id and department.employee_ids
   // consistent.
   employee.department_id = new_dept;
   ```
5. **C++ application:** Introduce a mediator/aggregate-root type that
   owns both sides of a cross-object invariant and exposes only
   operations that keep it intact (mirrors the "Aggregate" pattern from
   DDD); avoid exposing mutable references to internals that would let
   callers bypass the mediator.

## 5. Assertions

### 5.1 `assert` vs. Precondition Checks

1. **Concept:** `assert()` encodes a condition that must be true in a
   *correct* program — a tool for catching bugs, not for handling
   expected runtime conditions.
2. **Why it matters:** Conflating "this should never happen if the
   code is correct" with "this can legitimately happen at runtime"
   leads to either crashing on valid input, or quietly ignoring real
   bugs because they're wrapped in `if`-and-return instead of asserted.
3. **Good example:**
   ```cpp
   int at(const std::vector<int>& v, std::size_t i) {
     assert(i < v.size()); // bug in caller if false
     return v[i];
   }
   ```
4. **Bad example:**
   ```cpp
   int at(const std::vector<int>& v, std::size_t i) {
     if (i >= v.size()) { return -1; } // hides the caller's bug as -1
     return v[i];
   }
   ```
5. **C++ application:** Use `assert()` (or `[[assume]]`/contract
   `contract_assert`) for bugs; use `std::expected`/exceptions/error
   codes (see §8.2) for conditions outside the program's control.

### 5.2 Runtime Checks and Contract Levels

1. **Concept:** Not every assertion needs to run in every build;
   cheap preconditions can always be checked, expensive ones
   (`O(n)` or worse) may be reserved for debug/test builds.
2. **Why it matters:** Blanket "always check everything" and "never
   check anything" are both wrong: the first kills performance in
   hot paths, the second ships silent corruption to production.
3. **Good example:**
   ```cpp
   void sort_ascending(std::vector<int>& v) {
     std::sort(v.begin(), v.end());
     assert(std::is_sorted(v.begin(), v.end())); // O(n) postcondition
                                                   // check — debug only
   }
   ```
4. **Bad example:**
   ```cpp
   // Either: never verifies anything, even cheaply, anywhere —
   // or: does a full O(n^2) validation on every call in release builds,
   // tanking performance for a check that should only run in tests.
   ```
5. **C++ application:** Use `assert()` (stripped by `NDEBUG`) for cheap
   checks always worth it, and a project-defined `DEBUG_ONLY_ASSERT`/
   `expensive_assert` macro (or C++26 `audit`/`axiom` contract levels)
   for checks too costly for release but valuable in CI/fuzzing.

### 5.3 Fail-Fast

1. **Concept:** When a contract is violated, the program should stop
   as close as possible to the violation — not continue and fail
   mysteriously somewhere downstream.
2. **Why it matters:** The further a bug's symptom is from its cause,
   the more expensive debugging becomes; fail-fast converts "mystery
   crash three modules later" into "assertion at the exact bad call."
3. **Good example:**
   ```cpp
   void set_speed(double speed) {
     assert(speed >= 0.0 && "speed must be non-negative");
     speed_ = speed;
   }
   ```
4. **Bad example:**
   ```cpp
   void set_speed(double speed) {
     speed_ = speed; // negative speed silently corrupts state; the
                      // crash (if any) happens much later, elsewhere
   }
   ```
5. **C++ application:** Always include a message in `assert(cond &&
   "message")`; prefer crashing (abort/terminate) over continuing
   after a detected bug — see `better-code.md`'s "How to Handle Bugs."

## 6. Function Contracts (Hoare Logic)

### 6.1 Hoare Triples `{P} C {Q}`

1. **Concept:** A Hoare triple asserts that if precondition `P` holds
   before executing code `C`, postcondition `Q` holds after. It's the
   formal basis for precondition/postcondition reasoning.
2. **Why it matters:** Even without formal proofs, thinking in triples
   gives reviewers a crisp way to check a change: "does this diff
   still establish `Q` from `P`?" rather than vague "does this look
   right?"
3. **Good example:**
   ```cpp
   // {l <= h} int m = l + (h - l) / 2; {l <= m && m <= h}
   int midpoint(int l, int h) {
     assert(l <= h);
     int m = l + (h - l) / 2;
     assert(l <= m && m <= h);
     return m;
   }
   ```
4. **Bad example:**
   ```cpp
   int midpoint(int l, int h) {
     return (l + h) / 2; // overflows if l + h exceeds INT_MAX,
                          // silently breaking the implied postcondition
   }
   ```
5. **C++ application:** Write pre/post comments around non-obvious
   arithmetic/pointer logic in the same style as the example; use
   `static_assert` for triples that hold at compile time.

### 6.2 Loop Invariants

1. **Concept:** A condition true before a loop starts, after each
   iteration, and after the loop ends — the tool Hoare logic gives us
   for reasoning about iteration specifically.
2. **Why it matters:** Loops are the single most error-prone construct
   for off-by-one and termination bugs; identifying the invariant is
   usually the fastest way to verify (or debug) one.
3. **Good example:**
   ```cpp
   // Invariant: no element in a[0, i) equals x.
   std::size_t i = 0;
   while (i != a.size() && a[i] != x) {
     ++i;
   }
   // i == a.size() or a[i] == x, and it's the first such i.
   ```
4. **Bad example:**
   ```cpp
   std::size_t i = 0;
   while (a[i] != x) { // no bounds check — invariant "i < a.size()"
     ++i;              // was never stated, so nobody noticed it's missing
   }
   ```
5. **C++ application:** Prefer standard algorithms (`std::find`,
   `std::partition`, ranges) that have published invariants/contracts
   over hand-written loops — see `better-code.md`'s "no raw loops."

## 7. Object-Oriented Contracts

### 7.1 Liskov Substitution Principle

1. **Concept:** Objects of a subtype must be substitutable for objects
   of their supertype without altering the correctness of the program
   — i.e., overriding code must honor the contract of what it
   overrides.
2. **Why it matters:** Polymorphism relies on callers reasoning only
   about the base type's contract; an override that violates LSP
   breaks every caller that was written against the base class, often
   far away from the override itself.
3. **Good example:**
   ```cpp
   struct Shape {
     /// Precondition: none. Postcondition: result >= 0.
     virtual double area() const = 0;
     virtual ~Shape() = default;
   };
   struct Square : Shape {
     double area() const override { return side_ * side_; } // >= 0: OK
     double side_;
   };
   ```
4. **Bad example:**
   ```cpp
   struct Rectangle : Shape {
     virtual void set_width(double w) { width_ = w; }
     virtual void set_height(double h) { height_ = h; }
     double width_, height_;
   };
   struct Square : Rectangle {
     // Breaks the base contract: setting width silently changes height
     // too, surprising any caller that set both independently.
     void set_width(double w) override { width_ = height_ = w; }
     void set_height(double h) override { width_ = height_ = h; }
   };
   ```
5. **C++ application:** Review every `override` against its base
   class's documented contract explicitly; prefer composition or
   `final` leaf types over deep inheritance when a "subtype" doesn't
   actually satisfy the base contract (the classic `Square`-extends-
   `Rectangle` trap) — see `better-code.md`'s "no inheritance" and
   "inheritance is the base class of evil."

### 7.2 Subcontracting Rules (Precondition/Postcondition Variance)

1. **Concept:** A redefined method may **weaken** (or keep) its
   precondition and must **strengthen** (or keep) its postcondition —
   never the reverse. Class invariants in a subclass must imply the
   parent's invariant.
2. **Why it matters:** This is the precise, checkable form of LSP;
   "does it feel like a valid subtype" is subjective, but "does the
   precondition get stronger or the postcondition get weaker" is a
   yes/no question reviewers can actually answer.
3. **Good example:**
   ```cpp
   struct Reader {
     /// Precondition: buffer.size() >= 1.
     /// Postcondition: returns >= 0 bytes read.
     virtual int read(std::span<std::byte> buffer) = 0;
   };
   struct BufferedReader : Reader {
     /// Precondition: buffer.size() >= 0 (weaker — accepts more).
     /// Postcondition: returns >= 0 bytes read, and never blocks
     /// (stronger — adds a guarantee, doesn't remove one).
     int read(std::span<std::byte> buffer) override;
   };
   ```
4. **Bad example:**
   ```cpp
   struct Reader {
     /// Precondition: buffer.size() >= 1.
     virtual int read(std::span<std::byte> buffer) = 0;
   };
   struct StrictReader : Reader {
     /// Precondition: buffer.size() >= 4096 (STRONGER — rejects
     /// calls the base class would have accepted). Violates
     /// subcontracting.
     int read(std::span<std::byte> buffer) override;
   };
   ```
5. **C++ application:** Document contracts on the base class's virtual
   method and require overrides to restate (not silently redefine)
   them in their own doc comment, so a diff reviewer can compare the
   two side by side without cross-referencing files.

## 8. API Contracts

### 8.1 Interface Guarantees

1. **Concept:** A public API's contract includes more than one
   function's pre/post conditions — it includes guarantees about
   the whole surface: ABI/API stability, which parts are safe to
   call concurrently, and what "supported" means across versions.
2. **Why it matters:** API consumers build on *all* observable
   behavior, documented or not (Hyrum's Law); an explicit interface
   contract tells them which behaviors they're allowed to rely on and
   which might change.
3. **Good example:**
   ```cpp
   // Stable API: this enum's values are stable across versions;
   // new values may be appended but never renumbered or removed.
   enum class StatusCode { Ok = 0, NotFound = 1, Timeout = 2 };
   ```
4. **Bad example:**
   ```cpp
   // No stated stability guarantee — a later refactor renumbers
   // these for "cleanliness," silently breaking every serialized
   // value and every switch statement built against the old numbers.
   enum class StatusCode { NotFound, Ok, Timeout };
   ```
5. **C++ application:** Use explicit enum values (`= 0, = 1, ...`),
   `[[deprecated]]` before removal, and inline namespaces or symbol
   versioning for ABI-breaking changes; document what counts as a
   breaking vs. non-breaking change for the specific API.

### 8.2 Error Semantics

1. **Concept:** An API's contract must specify *how* failures are
   reported (exception, `std::expected`, error code, `errno`-style
   out-parameter) and what guarantee holds on failure (see §9.2).
2. **Why it matters:** Mixing error-reporting styles within one API
   (some failures throw, some return `-1`, some set a global) forces
   every caller to guess which discipline applies to which call,
   guaranteeing missed error checks.
3. **Good example:**
   ```cpp
   /// Returns the parsed value, or an error describing why parsing
   /// failed. Never throws.
   [[nodiscard]] std::expected<Config, ParseError> parse(std::string_view raw) noexcept;
   ```
4. **Bad example:**
   ```cpp
   // Sometimes throws std::runtime_error, sometimes returns an
   // empty Config, sometimes sets `errno` — undocumented and
   // inconsistent across call sites.
   Config parse(std::string_view raw);
   ```
5. **C++ application:** Pick one discipline per API/module (exceptions
   *or* `std::expected`/error codes) and document it once at the
   module level rather than per function; mark error-carrying return
   types `[[nodiscard]]`.

### 8.3 Ownership and Lifetime

1. **Concept:** Part of a function/API's contract is who owns a
   passed/returned resource, and for how long it remains valid
   (borrowed vs. owned, by-value vs. by-reference, observer vs.
   owner).
2. **Why it matters:** Ownership/lifetime contract violations (use-
   after-free, double-free, dangling reference) are memory-safety
   bugs, often exploitable, and are invisible at the call site unless
   the contract is explicit.
3. **Good example:**
   ```cpp
   /// Returns a non-owning view into `buffer`; the view is valid only
   /// as long as `buffer` is not modified or destroyed.
   std::string_view first_line(const std::string& buffer);

   /// Transfers ownership of the returned Widget to the caller.
   std::unique_ptr<Widget> make_widget();
   ```
4. **Bad example:**
   ```cpp
   // Returns a raw pointer with no stated ownership — caller has no
   // way to know whether to delete it, and when it stops being valid.
   Widget* make_widget();
   ```
5. **C++ application:** Use `std::unique_ptr`/`std::shared_ptr` to
   express ownership in the type system, `std::span`/`std::string_view`/
   raw reference for non-owning borrows, and avoid returning raw
   owning pointers; where lifetime can't be expressed in the type,
   document it explicitly next to the declaration.

### 8.4 Exception-Handling Responses

1. **Concept:** Meyer identifies three principled responses a supplier
   may take once it detects it cannot fulfill its contract (an
   exception occurs, or a precondition it imposed on *its own*
   suppliers fails): **retry** (attempt the operation again, usually
   after fixing or working around the failure — e.g., falling back to
   a secondary server); **organized panic** (restore the invariant,
   then fail loudly and explicitly by re-signaling a *new*, better-
   specified exception/error up to the client — never "handle and
   move on" silently); or **false alarm** (determine the failure is
   actually not a contract violation at all, and correct the
   condition before continuing normally, e.g., lazily creating a
   missing resource that was expected to exist). What is never a valid
   fourth response is swallowing the exception and continuing as if
   the postcondition were still satisfied.
2. **Why it matters:** Exception handlers are exactly where defensive
   programming quietly turns a loud contract violation into a silent
   one. Naming the three legitimate responses gives reviewers a
   checklist to apply to every `catch` block: is this a genuine retry
   (bounded, with a fallback), a deliberate re-throw/organized panic
   (invariant explicitly restored first), or a false alarm (the
   "failure" turns out to be within contract once examined) — or is it
   none of those, i.e. a bug being hidden?
3. **Good example:**
   ```cpp
   std::vector<Reading> fetch_readings(const Sensor& primary,
                                        const Sensor& backup) {
     try {
       return primary.read_all();      // retry via fallback
     } catch (const SensorTimeout&) {
       return backup.read_all();       // may itself throw onward
     }
   }
   ```
4. **Bad example:**
   ```cpp
   std::vector<Reading> fetch_readings(const Sensor& primary) {
     try {
       return primary.read_all();
     } catch (...) {
       return {};  // swallows the failure; postcondition ("readings
                    // were fetched") is now false but nobody is told
     }
   }
   ```
5. **C++ application:** Prefer letting exceptions propagate (or
   converting to `std::expected<T, E>` with an explicit error) over
   catching broadly; when a `catch` block does nothing but log and
   continue, treat that as a code-review red flag equivalent to an
   empty `catch (...) {}` — see Better Code's "let it flow" principle
   for the same argument applied to error-handling style in general.

## 9. State Management

### 9.1 Valid State Transitions

1. **Concept:** An object's contract can include a state machine: which
   transitions are legal from which state, and what precondition each
   transition requires in terms of current state.
2. **Why it matters:** Unconstrained state machines allow nonsensical
   sequences (closing an already-closed file, starting an already-
   started task) that crash or silently corrupt behavior.
3. **Good example:**
   ```cpp
   enum class State { Idle, Running, Stopped };
   class Task {
    public:
     /// Precondition: state_ == State::Idle.
     void start() {
       assert(state_ == State::Idle);
       state_ = State::Running;
     }
     /// Precondition: state_ == State::Running.
     void stop() {
       assert(state_ == State::Running);
       state_ = State::Stopped;
     }
    private:
     State state_ = State::Idle;
   };
   ```
4. **Bad example:**
   ```cpp
   class Task {
    public:
     void start() { running_ = true; }
     void stop() { running_ = false; }
     // start() can be called twice in a row, stop() before start(),
     // etc. — no transition is actually invalid, so bugs compile fine.
    private:
     bool running_ = false;
   };
   ```
5. **C++ application:** For simple cases, assert the current state at
   the top of each transition method; for critical state machines,
   use the typestate pattern (a different C++ type per state, moving
   `*this` between them) so the compiler rejects illegal transitions.

### 9.2 Transactional Guarantees

1. **Concept:** State mutating operations have an exception-safety
   contract: no guarantee, basic (invariants hold, no leaks), strong
   (operation either fully succeeds or has no visible effect), or
   no-throw.
2. **Why it matters:** Without a stated guarantee, a caller can't know
   whether to retry, roll back, or abandon an object after a failed
   operation — and "it probably mostly worked" is not a safe
   assumption around exceptions.
3. **Good example:**
   ```cpp
   /// Strong guarantee: on exception, `*this` is unchanged.
   void Document::apply_patch(const Patch& p) {
     Document copy = *this;      // mutate a copy
     copy.apply_unchecked(p);    // may throw
     *this = std::move(copy);   // commit only on success
   }
   ```
4. **Bad example:**
   ```cpp
   // No stated guarantee, and none provided: a mid-way exception
   // leaves `*this` partially patched, with no way to tell which
   // part succeeded.
   void Document::apply_patch(const Patch& p) {
     for (auto& edit : p.edits) apply_one(edit); // can throw partway
   }
   ```
5. **C++ application:** Default to the basic guarantee (RAII keeps
   invariants intact and leak-free on every throw path) and upgrade to
   the strong guarantee (copy-modify-swap, as above) at API boundaries
   where callers need to retry/rollback; mark genuinely non-throwing
   operations `noexcept` so movement/containers can rely on them.

## 10. Concurrency

### 10.1 Thread-Safety Contracts

1. **Concept:** A type/function's contract must state its thread-
   safety: safe for concurrent reads only, safe for one writer with
   many readers, fully safe for concurrent read/write, or not safe at
   all without external synchronization.
2. **Why it matters:** "Thread safety" isn't a single property; callers
   who assume the wrong level either pay needless locking overhead or
   hit data races — and data races are undefined behavior in C++, not
   just "rare bugs."
3. **Good example:**
   ```cpp
   /// Thread safety: `get()` may be called concurrently from multiple
   /// threads. `set()` must not be called concurrently with `get()`
   /// or another `set()` on the same instance.
   class Config {
    public:
     int get() const noexcept { return value_.load(std::memory_order_acquire); }
     void set(int v) noexcept { value_.store(v, std::memory_order_release); }
    private:
     std::atomic<int> value_;
   };
   ```
4. **Bad example:**
   ```cpp
   // No stated thread-safety contract, and plain int members — callers
   // assume whatever they want, and under concurrent set()/get() this
   // is a data race (undefined behavior), not just "a bit racy."
   class Config {
    public:
     int get() const { return value_; }
     void set(int v) { value_ = v; }
    private:
     int value_;
   };
   ```
5. **C++ application:** Document thread-safety per class in one place
   (not scattered per-method); use `std::atomic` for simple shared
   values, `std::mutex`/`std::shared_mutex` + RAII locks for compound
   invariants, and consider [[clang::guarded_by]]/Clang Thread Safety
   Analysis annotations to make the contract compiler-checkable.

### 10.2 Synchronization Contracts

1. **Concept:** Contracts around locking: lock ordering (to avoid
   deadlock), reentrancy (can this function be called while already
   holding its own lock?), and who is responsible for
   acquiring/releasing a given lock.
2. **Why it matters:** Deadlocks and double-locking are among the
   hardest bugs to reproduce and debug because they depend on timing;
   an explicit locking contract turns "sometimes hangs" into "lock
   order violated — fix the order."
3. **Good example:**
   ```cpp
   /// Locking contract: always acquire `accounts_mutex_` before
   /// `ledger_mutex_` if both are needed, to avoid deadlock.
   void transfer(Account& from, Account& to, int amount) {
     std::scoped_lock lock(accounts_mutex_, ledger_mutex_); // ordered,
                                                             // atomic acquire
     // ...
   }
   ```
4. **Bad example:**
   ```cpp
   void transfer(Account& from, Account& to, int amount) {
     std::lock_guard lock_a(accounts_mutex_);
     // ... some other thread locks ledger_mutex_ then accounts_mutex_
     std::lock_guard lock_l(ledger_mutex_); // classic lock-order deadlock
   }
   ```
5. **C++ application:** Use `std::scoped_lock` for multi-mutex
   acquisition (it handles ordering/deadlock-avoidance internally via
   `std::lock`), document lock order in one place per subsystem, and
   avoid calling virtual/callback functions while holding a lock
   unless reentrancy is an explicit, tested part of the contract.

### 10.3 Linearizability

1. **Concept:** A concurrent operation is linearizable if it appears
   to take effect instantaneously at some point between its call and
   return — concurrent calls behave as if executed in some valid
   sequential order.
2. **Why it matters:** Without linearizability (or a weaker, explicitly
   stated model), concurrent callers can observe "impossible" states
   — e.g., a counter that goes down after two increments — that no
   sequential reasoning predicts.
3. **Good example:**
   ```cpp
   /// Linearizable: concurrent increment() calls behave as if each
   /// took effect atomically in some order; no increments are lost.
   class Counter {
    public:
     void increment() noexcept { value_.fetch_add(1, std::memory_order_relaxed); }
     int value() const noexcept { return value_.load(std::memory_order_relaxed); }
    private:
     std::atomic<int> value_{0};
   };
   ```
4. **Bad example:**
   ```cpp
   class Counter {
    public:
     void increment() { ++value_; } // read-modify-write is not atomic;
                                      // concurrent calls lose updates —
                                      // not linearizable, not even correct
    private:
     int value_ = 0;
   };
   ```
5. **C++ application:** Use `std::atomic` compound operations
   (`fetch_add`, `compare_exchange_*`) instead of separate load/modify/
   store steps; for lock-free structures, state the memory ordering
   (`memory_order_relaxed/acquire/release/seq_cst`) each operation
   requires as part of its contract, not just "it's atomic."

## 11. Testing

### 11.1 Property-Based Testing

1. **Concept:** Instead of fixed input/output examples, generate many
   random inputs satisfying a function's precondition and assert its
   postcondition/invariants hold for all of them.
2. **Why it matters:** Example-based tests only cover the cases the
   author thought of; property tests directly exercise the contract
   itself, catching edge cases (empty input, duplicates, extreme
   values) the author didn't anticipate.
3. **Good example:**
   ```cpp
   // Using a property-testing library (e.g., RapidCheck):
   rc::check("sorted output is a permutation of the input",
     [](std::vector<int> v) {
       auto sorted = v;
       std::sort(sorted.begin(), sorted.end());
       RC_ASSERT(std::is_permutation(v.begin(), v.end(), sorted.begin()));
       RC_ASSERT(std::is_sorted(sorted.begin(), sorted.end()));
     });
   ```
4. **Bad example:**
   ```cpp
   // Only ever tests one hand-picked example; a bug affecting large
   // or duplicate-heavy inputs ships unnoticed.
   TEST(Sort, SortsThreeElements) {
     std::vector<int> v{3, 1, 2};
     std::sort(v.begin(), v.end());
     EXPECT_EQ(v, (std::vector<int>{1, 2, 3}));
   }
   ```
5. **C++ application:** Use a property-testing library (RapidCheck,
   CppQuickCheck) alongside GoogleTest/Catch2; write the property
   directly from the function's documented postcondition so the test
   and the contract can't drift apart.

### 11.2 Contract Testing

1. **Concept:** Tests that specifically target precondition/
   postcondition/invariant boundaries: one test per boundary (just
   inside valid, just outside, exactly at the edge), and one test that
   a precondition violation is actually caught (death test/assert).
2. **Why it matters:** Ordinary "happy path" tests rarely probe the
   exact boundary a contract describes; dedicated contract tests turn
   the written contract into an executable, enforced spec.
3. **Good example:**
   ```cpp
   TEST(At, AssertsOnOutOfRangeIndex) {
     std::vector<int> v{1, 2, 3};
     EXPECT_DEATH(at(v, 3), "i < v.size()"); // precondition violation
   }
   TEST(At, ReturnsLastElementAtBoundary) {
     std::vector<int> v{1, 2, 3};
     EXPECT_EQ(at(v, 2), 3); // exactly at the boundary, still valid
   }
   ```
4. **Bad example:**
   ```cpp
   // Only tests index 1 (middle of the vector) — the boundary (last
   // valid index) and the violation (one past the end) are untested.
   TEST(At, ReturnsElement) {
     std::vector<int> v{1, 2, 3};
     EXPECT_EQ(at(v, 1), 2);
   }
   ```
5. **C++ application:** Use `EXPECT_DEATH`/`ASSERT_DEATH` (GoogleTest)
   to verify `assert()`-based preconditions actually fire in debug
   test builds; keep these tests compiled only when assertions are
   active (`#ifndef NDEBUG`), since release builds strip them.

### 11.3 Invariant Testing (Fuzzing)

1. **Concept:** Run randomized/fuzzed sequences of operations against
   a stateful object and assert its class invariant after every step
   — not just after a single call.
2. **Why it matters:** Many invariant violations only surface after a
   specific *sequence* of operations (interleavings, repeated calls,
   rare combinations); single-call tests can't find them, but fuzzing
   the operation sequence can.
3. **Good example:**
   ```cpp
   // Fuzz harness: apply random operations, check invariant each time.
   extern "C" int LLVMFuzzerTestOneInput(const uint8_t* data, size_t size) {
     PairArray<int, int> pa;
     FuzzedDataProvider provider(data, size);
     while (provider.remaining_bytes() > 0) {
       pa.append(provider.ConsumeIntegral<int>(), provider.ConsumeIntegral<int>());
       assert(pa.xs_size() == pa.ys_size()); // invariant, checked every step
     }
     return 0;
   }
   ```
4. **Bad example:**
   ```cpp
   // Only ever checks the invariant once, after a single append() —
   // a bug that only manifests after 50 appends (e.g., a reallocation
   // edge case) will never be caught.
   TEST(PairArray, InvariantHoldsAfterAppend) {
     PairArray<int, int> pa;
     pa.append(1, 2);
     EXPECT_EQ(pa.xs_size(), pa.ys_size());
   }
   ```
5. **C++ application:** Wire a libFuzzer/AFL harness per stateful type
   with complex invariants; build it with assertions enabled and
   under ASan/UBSan so invariant violations and memory errors are
   caught together.

## 12. Anti-Patterns

### 12.1 Over-Defensive Programming

1. **Concept:** Adding runtime checks/fallbacks for conditions that are
   actually the caller's documented responsibility (precondition
   violations), rather than asserting and trusting the contract.
2. **Why it matters:** Over-defensiveness doubles the code (every
   function re-validates what its caller already validated), hides
   real caller bugs behind silently-substituted defaults, and makes
   it impossible to tell checked runtime errors from paranoia.
3. **Good example:**
   ```cpp
   /// Precondition: ptr != nullptr.
   void process(Widget* ptr) {
     assert(ptr != nullptr); // trust the contract; fail fast if violated
     ptr->run();
   }
   ```
4. **Bad example:**
   ```cpp
   void process(Widget* ptr) {
     if (ptr == nullptr) { return; } // silently no-ops on a caller bug,
                                       // and every caller up the chain
                                       // does the same null check again
     ptr->run();
   }
   ```
5. **C++ application:** Prefer references over pointers where null
   isn't meaningful (eliminates the check entirely); use
   `[[gnu::nonnull]]`/`not_null<T*>` wrappers; reserve runtime
   `if`-based handling for genuine runtime errors (§8.2), not
   caller-contract violations.

### 12.2 Weak Contracts

1. **Concept:** A stated contract so vague it fails to actually
   constrain behavior ("handles errors appropriately," "works for
   valid input") — technically present, practically useless.
2. **Why it matters:** A weak contract gives false confidence: it
   looks documented, so reviewers stop asking questions, but it
   doesn't actually let anyone reason about correctness or safely
   refactor the implementation.
3. **Good example:**
   ```cpp
   /// Precondition: 0 <= percent && percent <= 100.
   /// Postcondition: returns a value in [0.0, 1.0], equal to
   /// percent / 100.0.
   double to_fraction(int percent);
   ```
4. **Bad example:**
   ```cpp
   /// Converts a percent to a fraction. Handles edge cases properly.
   double to_fraction(int percent); // which edge cases? what's "properly"?
   ```
5. **C++ application:** Replace adjectives with checkable conditions
   (`assert`-able expressions) in Doxygen `\pre`/`\post`; if a
   condition genuinely can't be stated precisely, that's a sign the
   function's responsibility is still underspecified and probably
   needs to be split.

### 12.3 Redundant Checks

1. **Concept:** The same condition re-validated at multiple layers of
   a call chain with no single layer designated as authoritative,
   instead of validating once at the trust boundary and asserting
   (not re-checking) afterward.
2. **Why it matters:** Redundant checks cost performance, obscure
   which layer actually "owns" the validation (making contracts
   unclear per §12.2), and tend to drift out of sync, where one layer
   is updated and the others aren't.
3. **Good example:**
   ```cpp
   // Validate once, at the system boundary.
   Config load_config(const std::string& raw) {
     auto parsed = parse_and_validate(raw); // the one validation point
     return build_config(parsed);           // trusts `parsed` from here on,
                                              // asserts internally if needed
   }
   ```
4. **Bad example:**
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
5. **C++ application:** Validate at the system's external trust
   boundary (deserialization, user input, network); internally, use
   `assert()` to document and cheaply verify the data is still valid
   rather than re-running the full validation logic.
