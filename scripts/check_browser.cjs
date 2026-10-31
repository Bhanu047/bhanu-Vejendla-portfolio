// End-to-end checks for layout regressions and progressive enhancement.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const types = { '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.html': 'text/html', '.pdf': 'application/pdf' };
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(filename, (error, data) => {
    if (error) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream' });
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch();
    for (const width of [360, 390, 768, 1024, 1280, 1440, 1692]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      if (width === 1280) await page.context().grantPermissions(['clipboard-read', 'clipboard-write'], { origin: url });
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      const issues = await page.evaluate(() => {
        const issues = [];
        if (document.documentElement.scrollWidth > innerWidth + 1) issues.push('horizontal page overflow');
        for (const section of document.querySelectorAll('.section-title')) {
          const heading = section.querySelector('h2').getBoundingClientRect();
          const summary = section.querySelector(':scope > p').getBoundingClientRect();
          if (Math.min(heading.right, summary.right) > Math.max(heading.left, summary.left) + 1 &&
              Math.min(heading.bottom, summary.bottom) > Math.max(heading.top, summary.top) + 1) {
            issues.push('heading overlaps summary: ' + section.querySelector('h2').textContent);
          }
        }
        return issues;
      });
      const projectLayout = await page.evaluate(() => {
        const tabs = document.querySelector('.project-list').getBoundingClientRect();
        const detail = document.querySelector('.project-detail').getBoundingClientRect();
        return { tabsBottom: tabs.bottom, detailTop: detail.top, tabsWidth: tabs.width, detailWidth: detail.width };
      });
      assert(projectLayout.detailTop >= projectLayout.tabsBottom - 1, `project content is below tabs at ${width}px`);
      assert(Math.abs(projectLayout.tabsWidth - projectLayout.detailWidth) < 2, `project uses full width at ${width}px`);
      assert.deepEqual(issues, [], `layout at ${width}px`);
      assert.deepEqual(errors, [], `JavaScript errors at ${width}px`);
      assert.deepEqual(await page.locator('.hero-visual .proof strong').allTextContents(), ['7+', '3', '5', '4']);
      const portrait = page.locator('.portrait img');
      await portrait.scrollIntoViewIfNeeded();
      await portrait.evaluate(img => img.decode());
      assert(await portrait.evaluate(img => img.naturalWidth > 0));
      const showcase = page.locator('.project-showcase img');
      await showcase.scrollIntoViewIfNeeded();
      await showcase.evaluate(img => img.decode());
      assert(await showcase.evaluate(img => img.naturalWidth > 0));
      assert.equal(await page.locator('.stack-group').count(), 4);
      assert.equal(await page.locator('.stack-group .logo-grid > span').count(), 47);
      assert.equal(await page.locator('.engineering-note-tile').count(), 5);
      assert(await page.locator('.stack-group').first().isVisible());
      const first = page.getByRole('tab').first();
      await first.focus();
      await first.press('ArrowRight');
      assert.equal(await page.getByRole('tablist').getAttribute('aria-orientation'), 'horizontal');
      assert.equal(await page.getByRole('tab').nth(1).getAttribute('aria-selected'), 'true');
      assert.equal(await page.getByRole('tabpanel').getAttribute('aria-labelledby'), await page.getByRole('tab').nth(1).getAttribute('id'));
      for (const tab of await page.getByRole('tab').all()) {
        await tab.click();
        assert.equal(await tab.getAttribute('aria-selected'), 'true');
        assert(await page.locator('.project-footer a').last().isVisible());
        if (await tab.getAttribute('data-project') === 'kingdom') {
          assert(await page.locator('.project-showcase img').isVisible());
          assert(await page.locator('.case-study-story').isVisible());
          assert.match(await page.locator('.case-study-story').innerText(), /silently overwriting another/);
          assert.equal(await page.getByRole('link', { name: 'Open live platform ↗', exact: true }).count(), 0);
        } else {
          assert(await page.locator('.project-artifacts h4').isVisible());
          assert(await page.locator('.artifact-card a').first().isVisible());
        }
        assert(await page.getByRole('link', { name: 'Read engineering note →', exact: true }).isVisible());
      }
      if (width === 1280) {
        await page.getByRole('button', { name: 'Copy email', exact: true }).click();
        await page.getByRole('status').filter({ hasText: 'Copied!' }).waitFor();
        assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'bhanumanideepvejendla@gmail.com');
      }
      await page.close();
    }
    const projects = [
      ['kingdom846', 'Kingdom846'],
      ['weblog-stream', 'Weblog Stream'],
      ['nyc-taxi-lakehouse', 'NYC Taxi Lakehouse'],
      ['retail-warehouse', 'Retail Warehouse'],
      ['data-platform-terraform', 'Data Platform Terraform'],
    ];
    const linkedPage = await browser.newPage({ reducedMotion: 'reduce' });
    for (const [slug, title] of projects) {
      await linkedPage.goto(url + '/#project-' + slug);
      await linkedPage.getByRole('tabpanel').getByRole('heading', { name: title, exact: true }).waitFor();
      assert.equal(await linkedPage.getByRole('tab', { selected: true }).getAttribute('aria-controls'), 'project-detail');
    }
    await linkedPage.goto(url + '/#project-kingdom846');
    await linkedPage.locator('[data-project="stream"]').click();
    await linkedPage.locator('[data-project="taxi"]').click();
    await linkedPage.goBack();
    await linkedPage.getByRole('tabpanel').getByRole('heading', { name: 'Weblog Stream', exact: true }).waitFor();
    await linkedPage.goForward();
    await linkedPage.getByRole('tabpanel').getByRole('heading', { name: 'NYC Taxi Lakehouse', exact: true }).waitFor();
    await linkedPage.goto(url + '/#project-unknown');
    await linkedPage.getByRole('tabpanel').getByRole('heading', { name: 'Kingdom846', exact: true }).waitFor();
    await linkedPage.close();
    // Both disabled JavaScript and an unavailable script must retain evidence.
    for (const disabled of [true, false]) {
      const context = await browser.newContext({ javaScriptEnabled: !disabled });
      const page = await context.newPage();
      if (!disabled) await page.route('**/script.js*', route => route.abort());
      await page.goto(url);
      assert.match(await page.locator('#project-detail').innerText(), /Kingdom846/);
      assert(await page.locator('.project-footer a').last().isVisible());
      assert.equal(await page.locator('.project-list').isVisible(), false);
      assert(await page.locator('.project-showcase img').isVisible());
      assert(await page.locator('.stack-group').first().isVisible());
      await context.close();
    }
    const fallbackPage = await browser.newPage();
    await fallbackPage.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Clipboard denied'); } } });
    });
    await fallbackPage.goto(url);
    await fallbackPage.getByRole('button', { name: 'Copy email', exact: true }).click();
    await fallbackPage.getByRole('status').filter({ hasText: 'copy it manually' }).waitFor();
    assert.equal(await fallbackPage.evaluate(() => window.getSelection().toString()), 'bhanumanideepvejendla@gmail.com');
    await fallbackPage.close();
    const notes = [
      ['conflict-safe-collaboration.html', 'When two teammates save at the same time.'],
      ['replay-safe-streaming.html', 'Exactly-once is won in the sink.'],
      ['retry-safe-monthly-loads.html', 'A batch is finished only after its output commits.'],
      ['incremental-model-lookback.html', 'Late data is why incremental models need a lookback.'],
      ['terraform-production-guardrails.html', 'Asking for force-destroy is not the same as receiving it.'],
    ];
    for (const [slug, heading] of notes) {
      const notePage = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
      await notePage.goto(url + '/notes/' + slug);
      await notePage.getByRole('heading', { name: heading, exact: true }).waitFor();
      assert.equal(await notePage.locator('.note-section').count(), 4);
      assert(await notePage.locator('.note-source-links a').count() >= 1);
      assert.equal(await notePage.locator('.note-series-list a').count(), 5);
      assert.equal(await notePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      await notePage.setViewportSize({ width: 1280, height: 900 });
      assert.equal(await notePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
      await notePage.close();
    }
    console.log('Browser checks passed: 7 portfolio viewports, deeper case study, 5 engineering notes, project evidence, direct links and history, clipboard success/fallback and JavaScript fallback.');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });







