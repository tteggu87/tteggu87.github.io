# Whitespace verification

The ordinary staged `git diff --cached --check` reported only intentional two-space Markdown hard breaks in the uploaded source, new article/wiki summaries, and the verbatim Quartz build banner in the saved log. Those lines were inspected. The uploaded source was not normalized or changed.

`git -c core.whitespace=-blank-at-eol diff --cached --check` then passed. The `-c` option applied to that one verification process only; no repository or global Git configuration was changed. This is not a claim that the unmodified default check had exit code zero.

The source remains 52,532 bytes with SHA-256 `ba4d4aa6852d37d94b24f671b3f8d5cdf07a53511b40b6cbac812eff1684471f`. Type/format checking, the 122 tests, Quartz build, article-image validation and the Quartz route validation passed separately; see `release-gates.json` and `validation-logs/`.
