# Better Code — Review Checklist

PR-review questions derived from `knowledge-base/better-code.md` (Sean
Parent & David Abrahams' *Better Code* series/book).
_____________________________________

1. Can every loop in this diff be replaced by a standard/named algorithm?
2. Are preconditions, postconditions, and invariants stated (in code or docs) for every non-trivial public function/type?
3. Does any function make promises despite documented precondition violations?
4. Is there a reachable path where a detected bug (not a runtime error) is "handled" instead of terminating/asserting?
5. Are resources released via RAII/`defer` rather than manual cleanup at every exit path?
6. Does a new type expose raw stored fields that should instead be encapsulated behind an invariant?
7. Is polymorphism implemented via inheritance where value semantics + type erasure would be simpler and safer?
8. Does the data's structure already provide the best available algorithmic leverage (sorted/hashed/indexed) for how it's queried?
