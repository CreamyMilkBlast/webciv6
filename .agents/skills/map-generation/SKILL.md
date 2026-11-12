---
name: map-generation
description: Analyze, implement, or test fair procedural map generation for the browser-based turn-based strategy game, especially continents, mountain boundaries, archipelagos, resources, and player starts.
---

# Procedural Map Generation

Use when modifying or evaluating maps, terrain generation, player spawns, or map balance.

## Inspect first
- Read `AGENTS.md`, then find the current generator, random-seed handling, terrain rules, resources, starting positions, and test harness.
- Preserve the existing architecture and API contracts. Do not assume file names or a framework.
- If the game source is absent, report that clearly and give a minimal import/setup plan rather than creating a parallel game.

## Geographic coherence
- Avoid straight-line continent divisions. Use coherent coastline shapes and terrain/mountain systems that produce natural borders.
- Keep continents and archipelagos varied while preserving navigability and viable expansion.
- Check that mountains and water do not accidentally isolate otherwise viable starts.

## Fairness
- Evaluate all players by comparable criteria: workable terrain, freshwater, nearby resources, land area, accessible expansion, and island isolation.
- In archipelago maps, avoid one player starting on an enormous landmass while another starts on a tiny isolated island without compensating advantages.
- Do not claim perfect symmetry is required. Seek comparable opportunity with meaningful geographic variety.

## Verification
- Test multiple deterministic seeds across map types, sizes, and player counts.
- Report quantitative fairness metrics when possible and provide reproducible example seeds for extreme cases.
- Verify rendering and gameplay paths remain compatible.
- Add or update regression tests if the repository supports testing.
- Report what was tested versus what remains unverified.

Prefer focused patches rather than wholesale rewrites. Do not edit unrelated game systems.
