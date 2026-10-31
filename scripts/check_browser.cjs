// End-to-end checks for layout regressions and progressive enhancement.
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const types = { '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.html': 'text/html', '.pdf': 'application/pdf' };
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
      assert.deepEqual(issues, [], `layout at ${width}px`);
      assert.deepEqual(errors, [], `JavaScript errors at ${width}px`);
      const portrait = page.locator('.portrait img');
      await portrait.scrollIntoViewIfNeeded();
      await portrait.evaluate(img => img.decode());
      assert(await portrait.evaluate(img => img.naturalWidth > 0));
      const first = page.getByRole('tab').first();
      await first.focus();
      await first.press('ArrowDown');
      assert.match(await page.getByRole('tabpanel').innerText(), /NYC Taxi Lakehouse/);
      for (const tab of await page.getByRole('tab').all()) {
        await tab.click();
        assert.equal(await tab.getAttribute('aria-selected'), 'true');
        assert(await page.getByRole('tabpanel').getByRole('link').isVisible());
      }
      const resume = page.getByRole('link', { name: 'Download résumé (PDF) ↓', exact: true });
      assert(await resume.isVisible());
      assert.match(await resume.getAttribute('download'), /Resume\.pdf$/);
      const pdf = await page.request.get(new URL(await resume.getAttribute('href'), url).href);
      assert.equal(pdf.status(), 200);
      assert.equal(pdf.headers()['content-type'], 'application/pdf');
      assert.equal((await pdf.body()).subarray(0, 5).toString(), '%PDF-');
      await page.close();
    }
    // Both disabled JavaScript and an unavailable script must retain evidence.
    for (const disabled of [true, false]) {
      const context = await browser.newContext({ javaScriptEnabled: !disabled });
      const page = await context.newPage();
      if (!disabled) await page.route('**/script.js*', route => route.abort());
      await page.goto(url);
      assert.match(await page.locator('#project-detail').innerText(), /Weblog Stream/);
      assert(await page.locator('#project-detail a').isVisible());
      assert.equal(await page.locator('.project-list').isVisible(), false);
      await context.close();
    }
    console.log('Browser checks passed: 7 viewport widths, project tabs, portrait, PDF download and JavaScript fallback.');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

