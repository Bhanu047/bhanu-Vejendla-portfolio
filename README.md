# Bhanu Vejendla — Data Engineering Portfolio

Senior Data Engineer portfolio built with plain HTML, CSS and JavaScript.

Live at [bhanuvejendla.com](https://bhanuvejendla.com/).

## Content and progressive enhancement

The HTML contains a complete Weblog Stream case study. If JavaScript is disabled
or blocked, the first case study remains readable and its repository link works. With
JavaScript enabled, the selector becomes an accessible horizontal tab list with
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
Browser checks cover seven portfolio widths (360–1692px), the hero employer list,
the why-hire-me band, the trimmed skills grid, all five engineering notes at
mobile and desktop widths, heading collisions, horizontal
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



## Recruiter experience

The hero names the four employers so a recruiter sees them in the first screen.
A "Why hire me" band follows the hero with three checkable points: production work on
all three clouds, 158 automated tests across the three public data pipelines
(52 + 49 + 57, as stated in the engineering notes), and the engineering notes themselves.

Each skills group shows six core tools as tiles and lists the rest as plain text, so
every skill stays visible, including without JavaScript. Experience entries lead with
an outcome line, bold the key terms and end with a one-line stack summary. They reuse
only previously supplied claims; no new metrics have been added.

Each project includes inspectable evidence with links pinned to reviewed
repository commits. Excerpts are identified as tests, sample data or models;
none are presented as measured performance benchmarks. The streaming case study
matches its repository's Parquet sink. Pipeline animations are labelled as
illustrations rather than live telemetry.

The Copy email button uses the Clipboard API after an explicit click. If access
is unavailable, it selects the visible address and provides manual-copy guidance.
Browser checks cover both paths, visible skills and project evidence as well
as responsive layouts and no-JavaScript content.


Project choices use a horizontal row above a full-width case study. On smaller
screens the selector scrolls horizontally within its own container.


## Project order and Kingdom846 showcase

Projects are ordered for data engineering roles: Weblog Stream, NYC Taxi Lakehouse,
Retail Warehouse, Data Platform Terraform, then Kingdom846. The homepage notes grid and
each note's series list use the same order. Kingdom846 includes an optimised screenshot captured from its public homepage,
a version-conflict case study grounded in the portal's implementation, and site-usage
figures from the supplied analytics export. Experience copy also uses the terabyte-scale processing
claim from the owner's existing CV, without adding throughput benchmarks.

Each case study supports direct fragment URLs:
`#project-kingdom846`, `#project-weblog-stream`, `#project-nyc-taxi-lakehouse`,
`#project-retail-warehouse` and `#project-data-platform-terraform`.
Opening a link selects the corresponding tab and scrolls to Projects. Tab
selection updates the URL, and browser Back/Forward restores the selection.
Keyboard selection replaces the current history entry. Unsupported project
fragments fall back to Weblog Stream, without adding visible sharing controls.


The project-sharing controls and screenshot caption are intentionally omitted
from the page to keep the case studies focused. Existing project URLs continue
to work.

## Personal story and engineering notes

The About copy now connects Bhanu's India-to-North-Carolina career path to his
focus on dependable data systems. Each featured project now has a standalone
technical note grounded in its implementation: conflict-safe collaboration,
replay-safe streaming, retry-safe monthly loads, incremental-model lookbacks and
Terraform production guardrails. The homepage presents the five-note series and
each project tab links directly to its corresponding note.
