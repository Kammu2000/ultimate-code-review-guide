# Clean Code — Review Checklist

PR-review questions derived from `knowledge-base/clean-code.md`
(Robert C. Martin's *Clean Code*).
_____________________________________

## General
1. Does the change follow the project's standard conventions (naming, formatting, structure)?
2. Could this be simpler? Is there unnecessary complexity that isn't paying for itself?
3. Does the diff leave touched code cleaner than it found it, rather than just adding to the mess?
4. For a bug fix, does it address the root cause, or just a symptom?

## Design
1. Is configurable/tunable data kept at high levels rather than buried in low-level code?
2. Is polymorphism used instead of type-switching `if/else`/`switch` chains over object type?
3. Is multi-threading-related code isolated from the rest of the logic rather than interleaved?
4. Does the design avoid needless configuration options that nobody will actually use?
5. Are dependencies injected rather than constructed/looked-up internally?
6. Does any code reach through an object to access an indirect dependency (violating the Law of Demeter)?

## Understandability
1. Is similar logic expressed the same way everywhere, or does style vary arbitrarily?
2. Are complex expressions broken out into explanatory, well-named variables?
3. Is boundary-condition handling centralized instead of scattered/repeated?
4. Are primitive types used where a dedicated value object would better express intent and prevent misuse?
5. Does any method's correctness silently depend on another method having run first (hidden temporal coupling)?
6. Can negative conditionals be rewritten as positive ones for clarity?

## Names
1. Are names descriptive and unambiguous, not requiring a comment to explain what they mean?
2. Are similarly-purposed names meaningfully distinguished (not `data1`/`data2`)?
3. Are names pronounceable and searchable (not single letters or cryptic abbreviations)?
4. Are magic numbers replaced with named constants?
5. Do names avoid unnecessary encodings/prefixes (e.g. Hungarian notation, `I`-prefixed interfaces) where the language/tooling already conveys that information?

## Functions
1. Is each function small and focused on doing one thing?
2. Does the function name accurately describe everything it does, with no surprising side effects?
3. Could the argument list be shortened (e.g. by grouping related args into an object)?
4. Does the function have hidden side effects not implied by its name/signature?
5. Does the function take a boolean/flag argument that should instead be split into separate functions?

## Comments
1. Could the comment be eliminated by renaming/refactoring the code itself to be self-explanatory?
2. Is the comment redundant with what the code already says?
3. Are there comments that just restate the obvious (noise)?
4. Are there closing-brace comments that indicate blocks/functions are too long to need them?
5. Is there commented-out code that should just be deleted (version control already has history)?
6. Where comments exist, do they explain *intent*, *clarify* non-obvious code, or *warn* of consequences — rather than describing mechanics?

## Source code structure
1. Are related concepts grouped and separated vertically in a sensible reading order?
2. Are tightly related lines kept dense, with blank lines separating unrelated concepts?
3. Are variables declared close to where they're used, not all hoisted to the top?
4. Are functions that call each other kept physically close in the file?
5. Are similar functions grouped near each other?
6. Do high-level functions appear before (and call down into) the lower-level functions they use?
7. Are lines kept reasonably short, avoiding the need for horizontal scrolling?
8. Is horizontal alignment avoided (it tends to draw attention to the wrong thing and rots as code changes)?
9. Is whitespace used intentionally to associate/disassociate related and unrelated code?
10. Is indentation consistent, with no suspiciously broken/inconsistent levels?

## Objects and data structures
1. Does the type hide its internal representation behind behavior, rather than exposing raw state?
2. Would a plain data structure be more appropriate here than an object with behavior, or vice versa?
3. Does the type avoid being a hybrid (half rich object, half exposed data bag)?
4. Is the class small and focused, with a correspondingly small number of instance variables?
5. Does the base class leak knowledge of its derived classes (e.g. type-checking against subclasses)?
6. Is behavior selection done via multiple small functions/polymorphism rather than a flag/code parameter threaded through one function?
7. Are methods non-static where they conceptually operate on instance state?

## Tests
1. Does each test assert one logical thing (even if that's expressed via multiple `assert` calls)?
2. Is the test readable enough to serve as documentation of the behavior under test?
3. Is the test fast enough not to discourage running the suite frequently?
4. Can the test run independently of other tests/order?
5. Is the test repeatable in any environment (no hidden dependency on external state/time/network)?

## Code smells
1. Does this change make the codebase more rigid (one change forcing a cascade of others)?
2. Does it introduce fragility (a change here likely to break unrelated things elsewhere)?
3. Does it reduce immobility (can this logic be reused elsewhere, or is it too entangled with its context)?
4. Is there needless complexity that doesn't correspond to real requirements?
5. Is there needless repetition that should be factored out?
6. Is the resulting code harder to understand (opaque) than necessary?
