# Working on WebCiv6

Use Node.js 24 and Python 3.10 or newer for development. No package installation is required. The generated HTML runs on its own in a modern browser.

1. Edit the source (`model.js` for game data/rules, `ui.js` or `template.html`/`style.css` for presentation).
2. Run `node --test tests/*.test.cjs`.
3. After map-generation or rule changes, run `node scripts/validate-worlds.cjs`.
4. Build with `python3 build.py` (Windows: `py -3 build.py`).
5. Open `dist/index.html` and check the affected interaction. Commit the source and rebuilt HTML together.

`dist/source.zip` is regenerated for offline sharing and ignored by Git. Build also includes the tests, documentation and repository guidance in that ZIP. It excludes hosting configuration and Git history.

To run in a GitHub Codespace without installing anything on your computer, open the repository with **Code → Codespaces**, run `python3 build.py`, then `python3 -m http.server 8000 --directory dist` in the Codespace terminal and open its forwarded port. Codespaces availability and usage limits depend on your account. Codex Web can work directly against this repository using `AGENTS.md`.

Map rules are documented in [README.md](README.md) and [research notes](docs/research-notes.md). Keep supported rules distinct from approximations. Existing tests validate mechanical constraints; visual quality and future competitive balance still need judgment. The imported baseline's [validation history](docs/generation-validation.md) records previous checks.

No project license has been selected in this import. Preserve source attribution and existing rights notices.
