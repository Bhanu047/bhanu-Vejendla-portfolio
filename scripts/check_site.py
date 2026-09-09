"""Sanity checks for the site, using only the standard library.

Not a linter. These are the three failures that would actually embarrass me
on a page recruiters read: a broken in-page link, a placeholder left in, and
an external link that has lost its href.
"""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path

PLACEHOLDERS = ["lorem ipsum", "TODO", "FIXME", "XXX", "example.com", "your-name"]


class Collector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: set[str] = set()
        self.links: list[str] = []
        self.imgs_without_alt: list[str] = []
        self.title = ""
        self._in_title = False
        self._in_svg = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        d = dict(attrs)
        if "id" in d and d["id"]:
            self.ids.add(d["id"])
        if tag == "a":
            self.links.append(d.get("href") or "")
        if tag == "img" and not d.get("alt"):
            self.imgs_without_alt.append(d.get("src") or "?")
        # Only the document title. An <svg><title> is an accessibility label
        # for the graphic, not the page name, and counting it produced a
        # nonsense title in the check output.
        if tag == "svg":
            self._in_svg = True
        if tag == "title" and not self._in_svg:
            self._in_title = True

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if tag == "svg":
            self._in_svg = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data.strip()


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    html = (root / "index.html").read_text(encoding="utf-8")

    parser = Collector()
    parser.feed(html)

    failures: list[str] = []

    if not parser.title:
        failures.append("index.html has no <title>")

    for marker in PLACEHOLDERS:
        if marker.lower() in html.lower():
            failures.append(f"placeholder text left in the page: {marker!r}")

    for href in parser.links:
        if not href:
            failures.append("an <a> has an empty href")
        elif href.startswith("#") and href != "#":
            if href[1:] not in parser.ids:
                failures.append(f"in-page link {href} points at no element")

    for src in parser.imgs_without_alt:
        failures.append(f"<img> without alt text: {src}")

    for name in ("styles.css", "script.js", "assets/favicon.svg"):
        if not (root / name).exists():
            failures.append(f"referenced file is missing: {name}")

    if failures:
        print("Site check failed:")
        for f in failures:
            print(f"  - {f}")
        return 1

    print(f"Site check passed. title={parser.title!r}, "
          f"{len(parser.links)} links, {len(parser.ids)} anchors.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
