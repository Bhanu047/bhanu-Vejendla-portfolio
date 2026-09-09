# Bhanu Vejendla — Data Engineering Portfolio

Senior Data Engineer portfolio built with plain HTML, CSS and JavaScript.

**Live at [bhanu-portfolio-preview.bhanumanideep.chatgpt.site](https://bhanu-portfolio-preview.bhanumanideep.chatgpt.site)**

## Why there is no framework

The page is one document with no state, no routing and no data fetching. A build step would add a `node_modules`, a lockfile, a deploy pipeline and a class of failure that does not currently exist, in exchange for nothing this page needs.

It loads two font families and one small script. That is the whole dependency list.

## Animation behavior

The reveal-on-scroll starts elements at `opacity: 0`. If that were the default, a blocked script or JavaScript switched off would leave a visitor looking at empty sections.

Content remains visible unless an inline script in `<head>` sets `.js` on the root element before first paint. The project architecture workflows run continuously, while a fallback reveals any section that remains hidden.

## Layout

```
index.html            The page
styles.css            One stylesheet, custom properties at the top
script.js             Reveal-on-scroll, guarded
assets/favicon.svg    Favicon
scripts/check_site.py Pre-flight checks, standard library only
```

## The checks

`python scripts/check_site.py` catches the three things that would actually embarrass me on a page recruiters read: a broken in-page anchor, a placeholder left in the copy, and a link that has lost its `href`. CI runs it on every push.

## Local preview

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` directly works too.
