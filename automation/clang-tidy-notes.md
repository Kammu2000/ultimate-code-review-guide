# clang-tidy Notes

Short rationale behind the choices in
[`clang-tidy-mapping.md`](clang-tidy-mapping.md)'s `.clang-tidy` config.
_____________________________________

## Strictness

The config enables full check categories (not cherry-picked checks)
and sets `WarningsAsErrors: "*"`. This is a "mature codebase" stance,
not gradual adoption — expect a large first-run backlog; burn it down
or baseline it (e.g. per-file `NOLINT`) rather than disabling checks.

## Coverage gaps

- `cert-*` / `security-*`: no dedicated knowledge-base doc covers
  CERT C++ Secure Coding / security rules yet. Treat findings as
  review-guidelines material until a `cert-cpp.md` doc exists.
- `performance-*`: findings are about avoiding clearly wasteful
  patterns (e.g. unnecessary copies), not profiling-driven tuning —
  don't let this override Core Guidelines Per.1/Per.2's "measure
  before optimizing."

## Excluded checks

| Excluded check | Reason |
|---|---|
| `-clang-analyzer-alpha*` | Experimental, high false-positive rate — unsuitable for `WarningsAsErrors`. |
| `-modernize-use-trailing-return-type` | Style preference, not mandated by this repo. |
| `-modernize-use-nodiscard` | Too invasive to apply repo-wide without a deliberate API-design pass. |
| `-cppcoreguidelines-non-private-member-variables-in-classes` | Flags legitimate aggregates/protected members in designed-for-inheritance base classes. |
| `-misc-non-private-member-variables-in-classes` | Same check under the `misc-*` alias; excluded to avoid double-flagging. |
