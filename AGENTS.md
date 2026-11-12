# Project Instructions

## Objective
Develop a polished, browser-based, turn-based strategy game. Make focused, verifiable changes that preserve existing functionality.

## First step for every task
- Read the repository tree and relevant source files before proposing changes.
- Treat the source code as the authority for framework, architecture, commands, and behavior.
- If the source code is missing, explicitly report this and do not invent a codebase or claim tests passed.
- For substantial changes, provide a brief implementation plan before editing.

## Implementation standards
- Preserve existing working features unless a change is specifically requested.
- Prefer small, maintainable patches to complete rewrites.
- Do not add dependencies without explaining why they are necessary.
- Keep game rules and state management separate from presentation where practical.
- Do not expose secrets, credentials, or sensitive project data.

## Map generation and game balance
- Produce coherent landmasses, coasts, and mountain ranges rather than artificial straight-line continent splits.
- Keep archipelago starts comparable in accessible land, freshwater, nearby resources, and expansion opportunities.
- Allow geographic variety without giving one player a substantially worse viable start.
- Make randomized map bugs reproducible through deterministic seeds wherever supported.

## Testing and quality
- Inspect existing scripts and test infrastructure before deciding how to test.
- Run relevant tests and build checks where the cloud environment supports them.
- For generator changes, evaluate multiple seeds, map sizes, types, and player counts.
- Add targeted regression tests where the current codebase supports them.
- Do not claim successful testing without actual execution. Report blockers and manual verification needs.

## Changes and reporting
- Scope changes to the requested task and keep unrelated behavior unchanged.
- Summarize modified files, implementation decisions, and observed results.
- Report actual commands run, test failures, and any unverified assumptions.
- Prefer reviewable branches and pull requests over unreviewed direct changes to main.

## Reusable workflows
- Use `.agents/skills/code-review/SKILL.md` for audits and regression-focused review.
- Use `.agents/skills/map-generation/SKILL.md` for terrain, continents, archipelagos, and start-position fairness.
- Read `docs/CODEX_WEB_SETUP.md` for the browser-only Codex workflow.
