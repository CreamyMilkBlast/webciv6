# Research notes — 11 November 2026

## Reference basis

- [2K Gathering Storm manual](https://cdn.2kgames.com/manuals/civilization-vi/gathering_storm/2KGMKT_CIV6_Gathering_Storm_PC_Online_Manual_V7_US.pdf): environmental systems and strategic-resource changes.
- [Civilopedia terrain and features](https://www.civilopedia.net/en-US/gathering-storm/features/intro/): terrain, features and wonders.
- [Civilopedia resource index](https://www.civilopedia.net/en-US/gathering-storm/resources/intro/): resource types and requirements.
- [In-game Civilopedia reference, v1.0.12.9](https://civ6pedia.x0.com/GS/?l=en_US&p=FEATURES_INTRO): numeric yields, allowed terrain/features and reveal technology. This is a community-hosted transcription of in-game data, not a 2K-hosted website. The prototype extracts only functional data; it does not reproduce historical descriptions.
- [Duel map dimensions](https://civilization.fandom.com/wiki/Map_(Civ6)): 44 × 26, corroborated by the indexed game Map data.

## Ordinary base yields

| Terrain | Food | Production | Gold |
|---|---:|---:|---:|
| Grassland | 2 | 0 | 0 |
| Plains | 1 | 1 | 0 |
| Desert | 0 | 0 | 0 |
| Tundra | 1 | 0 | 0 |
| Snow | 0 | 0 | 0 |
| Coast / Lake | 1 | 0 | 1 |
| Ocean | 1 | 0 | 0 |

Hills add 1 Production. Ordinary mountains provide no workable yield. Features stack with terrain, and visible resource yields stack with both. Mountains and ice are not normal workable plots.

## Important distinctions

- Woods: +1 Production. Rainforest and Marsh: +1 Food.
- Oasis: +3 Food and +1 Gold; adjacent land receives fresh water.
- Reef: +1 Food and +1 Production. Geothermal Fissure: +1 Science.
- Gathering Storm Desert Floodplains: +2 Food. Grassland and Plains Floodplains: +0 initial yields.
- River edges do not directly add yields; they provide fresh water and later movement/district interactions.
- Strategic tile bonuses are hidden until the reveal technology is known. Horses: Animal Husbandry; Iron: Bronze Working.
- Improvement output, Amenities, strategic stockpiles and tile yields are different concepts. The prototype shows only unimproved tile yields and reference labels for future improvements.

## Ancient resource catalog

10 bonus resources, 27 naturally map-spawned luxuries, Horses and Iron. Names, yield modifiers, reveal requirements and placements are data-driven. Honey and Maize are excluded because they require the optional Maya & Gran Colombia pack; special-mode resources and off-map luxuries are excluded.

| Resource | Type | Added unimproved yields | Improvement | Reveal |
|---|---|---|---|---|
| [Bananas](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_BANANAS) | Bonus | +1 Food | Plantation | Start |
| [Cattle](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_CATTLE) | Bonus | +1 Food | Pasture | Start |
| [Copper](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_COPPER) | Bonus | +2 Gold | Mine | Start |
| [Crabs](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_CRABS) | Bonus | +2 Gold | Fishing Boats | Start |
| [Deer](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_DEER) | Bonus | +1 Production | Camp | Start |
| [Fish](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_FISH) | Bonus | +1 Food | Fishing Boats | Start |
| [Rice](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_RICE) | Bonus | +1 Food | Farm | Start |
| [Sheep](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_SHEEP) | Bonus | +1 Food | Pasture | Start |
| [Stone](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_STONE) | Bonus | +1 Production | Quarry | Start |
| [Wheat](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_WHEAT) | Bonus | +1 Food | Farm | Start |
| [Citrus](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_CITRUS) | Luxury | +2 Food | Plantation | Start |
| [Cocoa](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_COCOA) | Luxury | +3 Gold | Plantation | Start |
| [Coffee](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_COFFEE) | Luxury | +1 Culture | Plantation | Start |
| [Cotton](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_COTTON) | Luxury | +3 Gold | Plantation | Start |
| [Diamonds](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_DIAMONDS) | Luxury | +3 Gold | Mine | Start |
| [Dyes](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_DYES) | Luxury | +1 Faith | Plantation | Start |
| [Furs](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_FURS) | Luxury | +1 Food, +1 Gold | Camp | Start |
| [Gypsum](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_GYPSUM) | Luxury | +1 Production, +1 Gold | Quarry | Start |
| [Incense](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_INCENSE) | Luxury | +1 Faith | Plantation | Start |
| [Ivory](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_IVORY) | Luxury | +1 Production, +1 Gold | Camp | Start |
| [Jade](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_JADE) | Luxury | +1 Culture | Mine | Start |
| [Marble](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_MARBLE) | Luxury | +1 Culture | Quarry | Start |
| [Mercury](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_MERCURY) | Luxury | +1 Science | Mine | Start |
| [Pearls](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_PEARLS) | Luxury | +1 Faith | Fishing Boats | Start |
| [Salt](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_SALT) | Luxury | +1 Food, +1 Gold | Mine | Start |
| [Silk](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_SILK) | Luxury | +1 Culture | Plantation | Start |
| [Silver](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_SILVER) | Luxury | +3 Gold | Mine | Start |
| [Spices](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_SPICES) | Luxury | +2 Food | Plantation | Start |
| [Sugar](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_SUGAR) | Luxury | +2 Food | Plantation | Start |
| [Tea](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_TEA) | Luxury | +1 Science | Plantation | Start |
| [Tobacco](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_TOBACCO) | Luxury | +1 Faith | Plantation | Start |
| [Truffles](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_TRUFFLES) | Luxury | +3 Gold | Camp | Start |
| [Whales](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_WHALES) | Luxury | +1 Production, +1 Gold | Fishing Boats | Start |
| [Wine](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_WINE) | Luxury | +1 Food, +1 Gold | Plantation | Start |
| [Amber](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_AMBER) | Luxury | +1 Culture | Fishing Boats / Mine | Start |
| [Olives](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_OLIVES) | Luxury | +1 Production, +1 Gold | Plantation | Start |
| [Turtles](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_TURTLES) | Luxury | +1 Science | Fishing Boats | Start |
| [Horses](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_HORSES) | Strategic | +1 Food, +1 Production | Pasture | Animal Husbandry |
| [Iron](https://civ6pedia.x0.com/GS/?l=en_US&p=RESOURCE_IRON) | Strategic | +1 Science | Mine | Bronze Working |

## Natural-wonder subset

| Wonder | Tiles | Modeled effect |
|---|---:|---|
| Crater Lake | 1 | 5 Faith, 1 Science; lake freshwater source; impassable |
| Great Barrier Reef | 2 | 3 Food, 2 Science per wonder tile |
| Pantanal | 4 | 2 Food, 2 Culture per wonder tile; +1 movement, −2 defense |
| Uluru | 1 | Impassable; +2 Culture and +2 Faith to adjacent eligible tiles; +4 adjacent appeal |

Two eligible wonders are chosen from this pool. This is deliberately not the complete Civilization VI natural-wonder roster.

## Original generator and known approximations

- Continents are noisy elliptical fields; Pangaea uses one field, Archipelago paired home-island fields and satellite fields separated by curved ocean corridors. Sea level chooses a target land fraction, not an exact emulation of official maps.
- Latitude, moisture and ruggedness determine biomes and relief. Geological continent labels use two irregular warped regions whose land boundaries guide mountain chains and hills, with occasional passes. Interior peaks also remain. This is not a tectonic simulation.
- River drainage follows a shortest-path potential on shared hex vertices to coastal outlets. It produces continuous edge rivers but does not simulate real flow volume or erosion.
- Small enclosed water components and two deliberately inserted inland basins form lakes. Coast shelves and polar ice use heuristic placement.
- Resource eligibility uses the resource placement rules together with the existing feature’s allowed-resource list. Continent luxury pools and density are simplified.
- Geothermal vents are selected on flat land within two hexes of a ridge; these are approximate geological locations.
- Cliffs, start scoring and village/camp placement are heuristic. Start locations are not validated for long-term competitive balance.
- Named-wonder footprints keep tile count and core yields; exact official placement geometry and all special gameplay effects are not reproduced.
- Flood fertility, volcanic soil from eruptions, coastal lowlands, storms, fire, sea-level rise, roads, districts and constructed wonders are not simulated.

## Verification

Automated tests cover stacked yields, GS floodplain differences, reveal-dependent output, illegal resource placement, water/mountain/wonder yields, seed reproducibility, 1,144-tile dimensions, symmetric river edges, two starts/two wonders, geothermal availability, Pantanal modifiers and valid terrain shading. A separate 36-world sweep across map types and climate settings passed structural and placement checks before the final geothermal pass. Browser QA exercised the board, zoom, settings, regeneration, overlays and downloads. The exported HTML has no external runtime dependencies and all inline scripts pass syntax checks. Direct file:// opening is blocked by the QA browser policy, so the offline file was not executed in that mode here.

## Revision 0.2 — requested map improvements

Starts now enforce freshwater access and two first-ring tiles each with at least 2 Food and 2 Production, using unrevealed-resource yields. At least six freshwater city locations including both starts have minimum four-hex spacing. Lake and river placement is denser and more distributed. Terrain is redrawn as vector paths at camera resolution; yield overlays use one pip per unit with no numeric replacement or five-unit cap. Version 0.3 supersedes the original longitudinal partition and independent Archipelago start selection. See README Version 0.3 for the exact whole-territory acceptance limits and JSON diagnostics.
