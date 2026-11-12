# webciv6 · Ancient Atlas

Vibe-coded port of Civ VI into a web browser. The current milestone is **Ancient Atlas 0.3**, a self-contained map laboratory and foundation for a future Ancient Era strategy game. Original 2D terrain art and generation; researched Civilization VI: Gathering Storm tile rules.

## Open it

Download this repository as a ZIP, extract it, and open `dist/index.html` directly in a modern browser. No packages, server, external assets, fonts, or network requests are needed. The hosted version also provides an offline HTML download through the book icon / Rules & sources.

For development and browser-only options, see [CONTRIBUTING.md](CONTRIBUTING.md). AI coding agents should read [AGENTS.md](AGENTS.md).

## Use it

- Click any hex to inspect its unimproved yields, resource, features, movement, defense, appeal, river edges and freshwater access.
- Drag to pan; scroll or +/− to zoom; F fits the entire board.
- Y toggles yield pips / amounts, R resources, G the grid.
- The minimap and World overview provide navigation to wonders and suggested starts.
- World settings offers seed, Continents/Pangaea/Archipelago, sea level, temperature, rainfall and resource density. The same seed and settings reproduce the same world.
- Inspector reveals the Ancient resource pool; Turn one hides Horses and Iron and their yield contributions. Ancient techs reveals them via an inspection preset. These are not gameplay research systems.
- Export saves the complete world as JSON, including tile IDs, coordinates, rivers, cliffs, resources, wonders, sites, starts, geological continents and yields.

## Scope

Duel dimensions are 44 × 26 = 1,144 hexes. Pointy-top, odd-row offset coordinates. Logical neighbors wrap east–west; the board shows one cut of the cylinder and does not visually repeat when panned.

The model includes land biomes, hills, mountains, coasts, oceans, small lakes, ice, woods, rainforest, marsh, three floodplain types, oasis, reef, volcanoes and geothermal fissures. Rivers are connected routes on the hex vertex graph and are stored symmetrically on shared tile edges. Coastline cliffs are stored on edges. Player starts, villages and camps are static markers. Starts require fresh water and at least two immediately adjacent, workable land tiles with 2+ Food and 2+ Production at turn one. Candidate selection prefers naturally strong rings; otherwise it makes legal Grassland Hills + Woods tiles, preserving luxury/strategic deposits. Archipelago additionally enforces whole-island and expansion guarantees described under Version 0.3. At least six freshwater city locations, including both starts, are spaced four or more hexes apart. The generator attempts additional inland lakes if coverage is insufficient and fails validation rather than accepting an invalid world.

The rules catalog contains 10 bonus, 27 map-spawned luxury and 2 strategic resource types. Not all types occur in every world: placement conditions and four-type land luxury pools per geological continent restrict selection. Water luxuries use a separate pool.

Two natural wonders are selected from a deliberately small supported pool: Crater Lake, Great Barrier Reef, Pantanal and Uluru. Wonders have the appropriate tile count and direct yields or supported adjacency effect; placement shapes and suitability constraints are simplified. No claim of complete natural-wonder parity.

No cities, units, turns, harvesting, improvements, citizens, policies, pantheons, AI, fog of war, civilization bonuses, disasters or eruptions are simulated. Niter, Coal, Oil, Aluminum, Uranium, artifacts, NFP resources and special-mode/off-map luxuries are excluded. Map settings, start scoring, continental layout, coast shelves, resource distribution and hydrology are original heuristics, not Firaxis scripts. Our explicit validation limits are described below.

## Yield model

Ordinary unimproved yield = base terrain + hills (+1 Production) + feature + currently revealed resource + supported wonder adjacency. Mountains and ice are unworkable in this model. Natural-wonder tile yields replace ordinary base yields. Uluru is impassable and grants +2 Culture and +2 Faith to eligible adjacent tiles. Rivers provide freshwater access, not extra tile yields.

Gathering Storm Desert Floodplains add 2 Food; Grassland and Plains Floodplains add no initial yield. Future flood fertility is not invented. A Woods/Plains/Hills/Deer tile yields 1 Food and 4 Production, without any improvement.

The inspector's movement cost is the tile's base entry cost, before unit abilities, river-crossing penalties and embarking restrictions. Natural appeal includes the modeled natural surroundings; it excludes gameplay effects, improvements and districts.

## Build and verify

Requires Python 3 and Node.js only for development; neither is required to play the HTML file.

```sh
node --test tests/*.test.cjs
python3 build.py
```

On Windows, use `py -3 build.py`. No `npm install` step is needed. After generator changes, also run `node scripts/validate-worlds.cjs`. GitHub Actions runs these checks automatically. The complete hosted demo remains separate from this source import; this pull request does not enable GitHub Pages.

`build.py` inlines the source, CSS and rule data into `dist/index.html` and refreshes the downloadable `dist/source.zip`. To serve it for local development, any static HTTP server can serve `dist/`.

| File | Responsibility |
|---|---|
| `model.js` | Seeded generator, hex topology, placement checks, yields and terrain attributes; no DOM |
| `rules.json` / `rules.js` | Numeric terrain, feature and resource reference data |
| `render-utils.js` | Rendering color helper |
| `ui.js` | Canvas artwork, navigation, controls, tile inspector and exports |
| `style.css` / `template.html` | Interface and responsive layout |
| `tests/` | Yield, reveal, placement, drainage, reproducibility and rendering regression checks |
| `docs/research-notes.md` | Sources, rule tables and deliberate approximations |

## Building on it

Keep tile IDs and the exported schema stable. First add settlers, legal movement and city founding against this model. Then add worked tiles and production, followed by Ancient research and improvements. Avoid mixing screen coordinates with hex topology or storing economy calculations in the renderer.

Independent fan prototype. Civilization and Civilization VI belong to their respective owners. No game artwork, music, historical prose or third-party runtime libraries are bundled.

## Version 0.2

Terrain is drawn from vector paths at the current camera scale and device resolution; the fixed-resolution cache is used only for the minimap. Every displayed map yield unit has its own pip, including yields greater than five. Rivers can use twelve distributed sources and six inland lakes are spread across the map. JSON exports include settlementSites, generatorVersion and startGuarantees. Seed outputs changed with this generator revision.

## Version 0.3

Replaces midpoint labels with warped geological regions and boundary mountain chains with passes. Connected landmasses have separate IDs; reachable land excludes mountains, ice and wonders. Archipelago generates paired home-island envelopes with independently varied coasts and satellite islands, separated by protected sea corridors. Capitals are selected as a pair. Acceptance requires separate home islands, usable island area and reachable area ratios <=1.15, >=3 reachable freshwater city sites each (including capital, minimum spacing 4), radius-5 turn-one Food and Production ratios <=1.25, reachable Horses and Iron within 8 hexes, and nearest satellite shoreline-distance difference <=2 hexes. Satellites must contain >=4 usable tiles. These are original fairness rules, not Firaxis or geological simulation. Climate, resources, luxuries, wonders, routes and terrain still vary. Failed maps retry deterministically, up to 100 attempts, then throw rather than silently accepting failure. Seeds change from v0.2. Export includes landmasses, balance diagnostics and retry count. The World panel displays both players' balance figures.

## Repository import

Imported from the Ancient Atlas 0.3 baseline (source commit `8bc0aac277c7aae08620670f7d7c4b9f75f3e2b5`). Game logic, rules data and artwork are unchanged. This export adds portable build instructions, contributor/agent guidance and CI, and excludes the original hosting configuration, internal planning files, credentials and generated ZIP from version control. The build recreates `dist/source.zip` without requiring any hosting account.
