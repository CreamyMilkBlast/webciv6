# Codex Web workflow for webciv6

This repository is intended for use with Codex Web connected to GitHub. No local software installation is required.

## Repository status at initial setup (2026-11-12)
Only `README.md` and `AGENTS.md` existed on `main` when these instructions were prepared. Import the current game source files before requesting a source audit or running gameplay tests.

## Recommended workflow
1. In Codex Web, select the connected `CreamyMilkBlast/webciv6` repository and use its cloud environment.
2. Work on a task-specific branch and review the proposed diff before merging.
3. Describe the expected outcome and constraints; reference the relevant skill by name if helpful.
4. Ask Codex to inspect existing files first, propose a plan for substantial changes, implement focused changes, and run available tests.
5. Verify its report includes changed files, commands actually executed, and unverified behavior.

## Repository instructions
- `AGENTS.md`: default project rules applied while Codex works here.
- `.agents/skills/code-review/SKILL.md`: repeatable code review workflow.
- `.agents/skills/map-generation/SKILL.md`: geography and map-balance review workflow.

Skills are instructions rather than executable test suites. Their presence does not itself install third-party packages or guarantee tests will run.

## Suggested first task after importing source
> Inspect the repository and AGENTS.md. Review the map-generation implementation using the map-generation skill. Identify how continent splits, archipelago player-start fairness, reproducible seeds, and terrain boundaries work. Propose minimal fixes and tests before changing code.

## Constraints
Do not bypass organizational restrictions. Do not upload company-owned or sensitive files to personal repositories. Use only authorized GitHub and Codex Cloud access.
