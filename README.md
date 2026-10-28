# biosymphony.ai

Stealth landing page for Biosymphony — a frontier lab building a world model of living systems. A single static page: no build step, no dependencies, no external requests.

Preview locally:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

Deployed as a GitHub Pages site: pushes to `main` trigger `.github/workflows/deploy-pages.yml`, which checks the site and publishes only its static files via GitHub Actions (no application build). A `.nojekyll` file keeps Pages from running Jekyll, and asset paths are relative so the page works both under a project-page URL and at a custom domain root.

The `_headers` file is kept for Cloudflare Pages compatibility (no build command, output directory `/`); GitHub Pages ignores it — including the `X-Robots-Tag` on `/demo/*`. The demo pages use per-page `noindex` tags; `robots.txt` allows crawling so search engines can read them. The pages remain public.

## Design studies

`/demo/` holds twelve one-page treatments — one per option in the identity deck, plus
the trademark lockup at `/demo/1`. Structure is held constant across all twelve (hero,
thesis, four commitments, platform, contact); the design system and the copy voice are
the variables.

These pages run ahead of the live landing page on positioning: they argue the virtual
*tissue* rather than the virtual cell, and lead with multimodal / multi-scale / causal /
mechanistic. They are `noindex` and unlinked from `/`, but the URLs are public to anyone
who has them.

| # | Deck | Name | # | Deck | Name |
|---|------|------|---|------|------|
| 1 | TM | The Lockup | 7 | 2b | The Frontier |
| 2 | 1a | Current identity | 8 | 2c | The Resonance |
| 3 | 1b | The Score | 9 | 3a | The Unison |
| 4 | 1c | The Signal | 10 | 3b | The Fermata |
| 5 | 1d | The Stave | 11 | 3c | The Matinee |
| 6 | 2a | The Overture | 12 | 4a | The Cluster |

Left/right arrow keys and horizontal swipes move between studies, wrapping at both ends.
`demo/nav.js` reads its targets from the spec strip's `rel="prev"`/`rel="next"` links, so
page order stays defined in one place; it ignores modifier-key combos, near-vertical or
slow drags, and gestures starting within 32px of a screen edge (the OS back gesture).

Pages are committed as plain static HTML — edit them directly. The shared scaffold is
`demo/demo.css`; each page's palette and type tokens live in its own inline `<style>`.
All typefaces are self-hosted in `/fonts`; the site still makes zero external requests.

[Development guide](AGENTS.md): setup, checks, and repository conventions.
