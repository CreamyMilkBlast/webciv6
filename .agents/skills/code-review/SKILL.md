---
name: code-review
description: Review proposed or existing code changes for correctness, regressions, performance, security, and maintainability, without editing unless asked.
---

# Code Review

Use this skill when asked to review code, audit a pull request, or diagnose suspected regressions.

1. Read `AGENTS.md` and inspect the actual repository structure before making assumptions.
2. Establish the changed-file scope and examine calling code, callers, interfaces, and tests.
3. Identify concrete correctness, security, performance, and maintenance risks.
4. Check edge cases relevant to browser games: deterministic randomness, state transitions, turn order, save/load behavior, rendering, and input handling.
5. Run existing tests and static checks where supported. Do not invent commands or claim a check ran if it did not.
6. Rank findings as critical, high, medium, or low. For each, reference exact paths and lines where possible, explain the impact and provide a narrowly scoped fix.
7. Separate verified defects from plausible risks. If the repository lacks source code or tests, explicitly identify the blocker instead of manufacturing findings.

Do not change code during an audit unless explicitly requested. Avoid introducing dependencies just to conduct a review.
