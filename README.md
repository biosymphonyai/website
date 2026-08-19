# biosymphony.ai

Stealth landing page for Biosymphony — a frontier lab building a world model of living systems. A single static page: no build step, no dependencies, no external requests.

Preview locally:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

Deployed as a GitHub Pages site: pushes to `main` trigger `.github/workflows/deploy-pages.yml`, which publishes the repository root via GitHub Actions (no build step). A `.nojekyll` file keeps Pages from running Jekyll, and asset paths are relative so the page works both under a project-page URL and at a custom domain root.

The `_headers` file is kept for Cloudflare Pages compatibility (no build command, output directory `/`); GitHub Pages ignores it.
