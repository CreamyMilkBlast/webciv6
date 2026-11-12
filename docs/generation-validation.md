# Generator 0.3 validation

Validated 2026-11-12 with Node.js 24.

- `node --test tests/*.test.cjs`: 15 tests passed, zero failures. Covers irregular ridge-guided regions, separate landmasses, reachable home territory, freshwater city expansion, resources, final yield diagnostics, deterministic reproduction, previous start guarantees, river edges, tile rules, and yield pip rendering.
- `node scripts/validate-worlds.cjs`: 99 worlds / 198 starts passed. Includes all 81 Archipelago combinations of temperature, rainfall, sea level and resource density, plus 18 Continents/Pangaea worlds. Maximum deterministic retry index 13; slowest observed generation 2,785 ms in this environment. Timing is observational, not a browser performance guarantee.
- Offline embedded scripts passed `node --check`; the ZIP's model and HTML match the built source.
- Browser inspection verified settings, generation, continent overlay, readable labels, and the World overview balance figures. The final channel-width adjustment was covered by the release suite and 99-world sweep.

Scope: the validator enforces the documented thresholds, not full competitive equivalence. Luxury distribution, wonder access, exact sailing routes and future gameplay mechanics remain unbalanced. Geological boundaries guide mountain placement; the model does not simulate plate tectonics.
