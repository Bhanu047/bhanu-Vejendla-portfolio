# Bhanu Vejendla — Data Engineering Portfolio

Senior Data Engineer portfolio built with plain HTML, CSS and JavaScript.

Live at [bhanuvejendla.com](https://bhanuvejendla.com/).

## Content and progressive enhancement

The HTML contains a complete Weblog Stream case study. If JavaScript is disabled
or blocked, the case study remains readable and its repository link works. With
JavaScript enabled, the selector becomes an accessible vertical tab list with
arrow-key, Home and End navigation. A noscript navigation links to the other
four projects.

The About section includes a lazy-loaded portrait with explicit dimensions.
Résumés are tailored and shared separately for each job description. The public website does not offer a résumé download.

## Motion and layout

Motion respects reduced-motion preferences. Animation cycles pause when the tab
is hidden. Section headings use constrained grid columns and stack at smaller
widths to prevent collisions. Theme variables and isolated typography overrides
are consolidated while responsive rules retain their cascade ordering.

## Checks

`python scripts/check_site.py` runs standard-library checks. CI installs pinned
Playwright tooling and runs `node scripts/check_browser.cjs` in Chromium.
Browser checks cover seven widths (360–1692px), heading collisions, horizontal
overflow, project selection and keyboard navigation, portrait loading, JavaScript
fallback, and fallback content with JavaScript disabled or blocked.

Run browser checks locally with:

```bash
npm install --no-save --ignore-scripts playwright@1.56.1
npx playwright install chromium
node scripts/check_browser.cjs
```

For local preview, run `python -m http.server 8000` and open
`http://localhost:8000`.

