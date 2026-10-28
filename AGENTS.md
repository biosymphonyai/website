# Working in website

Serve a static landing page and twelve public design studies. There is no backend or application data store.

## Read first

Read `README.md` for hosting and the design-study layout. Trace callers and downstream files before changing a contract.
Keep changes focused and use a feature branch. Do not deploy, publish data, or run production work unless the task asks for it.

## Engineering conventions

- Prefer a small, direct implementation. Delete an unnecessary abstraction before adding another.
- Prefer the standard library, then an existing maintained dependency. Explain compatibility, license, and migration cost before adding a package.
- Use semantic names and the existing file format. Write instructions in plain English and explain uncommon terms.
- Add regression tests for consequential behavior changes, including failure cases. Test observable outcomes, not copies of the implementation.
- Keep one current document per topic. Link to it from the README; preserve scientific records and decisions as history.
- In a PR, state the resulting behavior, validation, and any remaining risk. Report failed or skipped checks honestly.

## Repository invariants

- Keep links and assets usable at both `/` and `/website/`; use directory-relative URLs.
- Keep content and contact links usable without JavaScript. Respect reduced motion and preserve keyboard access and accessible names.
- Design studies are public. Let crawlers read their noindex tags; do not describe noindex as access control.
- Keep the site dependency-free. Do not publish or change the site's audience as part of a code check.

## Setup and checks

```bash
# Python 3 and Node.js; no application packages or build step
bash scripts/check.sh
```

Run a single Python test with `python -m pytest path/to/test.py` where pytest is used.
The check script is the source of truth for routine validation. CI calls it on pull requests and main-branch pushes.
`CLAUDE.md` imports this file. The Claude Code Stop hook also runs it when the checkout has local changes;
it allows one follow-up to correct a failure rather than creating an endless loop. Install the documented tools first.
CI checks do not make themselves required for merging; repository rules must require them separately.

## Guidance

- [Claude Code practices](https://code.claude.com/docs/en/best-practices)
- [Google code review](https://google.github.io/eng-practices/review/reviewer/standard.html)
- [Google Python conventions](https://google.github.io/styleguide/pyguide.html)
