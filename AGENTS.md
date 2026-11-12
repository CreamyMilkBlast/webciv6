# WebCiv6 development guide

This is Ancient Atlas 0.3: an Ancient Era map foundation, not a complete Civilization game. It uses plain JavaScript, Canvas, HTML/CSS and a Python standard-library build. It has no runtime dependencies and needs no npm installation.

## Files and boundaries

- `model.js`: deterministic generation, hex topology, rules, yields and validation; keep it independent of the DOM.
- `rules.json` and `rules.js`: matching data catalogs. Keep their data synchronized when changing rules.
- `ui.js`, `render-utils.js`, `style.css`, `template.html`: rendering and interface source.
- `dist/index.html`: built, self-contained browser entrypoint. Edit source files and rebuild; do not edit it directly.
- `tests/`: Node's built-in test runner. `scripts/validate-worlds.cjs`: broader generation sweep.
- `docs/`: research references, simplifications and validation history.

## Commands

- `node --test tests/*.test.cjs` (or `npm test`): normal suite.
- `node scripts/validate-worlds.cjs`: broad sweep after generation or map-rule changes.
- `python3 build.py` (Windows: `py -3 build.py`): rebuild HTML and source ZIP.
- `git diff --exit-code -- dist/index.html`: check that committed HTML matches a rebuild.

Keep seed/settings reproducibility, symmetric river edges, legal resources, freshwater starts, and the documented two-tile 2F2P first ring. Archipelago must retain its land-area, reachable-land, yield, freshwater-city, strategic-resource and satellite-access limits. Reject or repair invalid maps; do not silently weaken guarantees to pass tests.

For a relevant bug, add a regression check, run the appropriate suite and rebuild before finishing. For map-generation changes also run the broad sweep and update `generatorVersion` and docs when seed outputs change. Report what was actually verified. Preserve original artwork and source attribution; do not add proprietary game assets. Add gameplay systems only when requested and keep their logic separate from rendering.

No ChatGPT hosting manifest or source-repository credentials are required in this repository. Do not add secrets, account information or local runtime metadata.
