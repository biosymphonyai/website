"""Keep local resources inside both supported deployment base paths."""

import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ("href", "src") and value:
                self.references.append(value)


class SiteTests(unittest.TestCase):
    def test_resources_and_navigation_at_both_bases(self):
        for path in [*ROOT.rglob("*.html"), ROOT / "demo/demo.css"]:
            text = path.read_text()
            parser = References()
            parser.feed(text)
            references = parser.references + re.findall(r"url\(['\"]?([^)'\"]+)", text)
            for base in ("/", "/website/"):
                page = "https://example.test" + base + path.relative_to(ROOT).as_posix()
                for ref in references:
                    if ref.startswith("#") or urlsplit(ref).scheme:
                        continue
                    with self.subTest(file=path.relative_to(ROOT), base=base, ref=ref):
                        target = unquote(urlsplit(urljoin(page, ref)).path)
                        self.assertTrue(target.startswith(base), target)
                        local = ROOT / target[len(base):]
                        self.assertTrue(local.is_file() or (local / "index.html").is_file(), target)

    def test_demo_noindex_can_be_read(self):
        self.assertNotIn("Disallow: /demo/", (ROOT / "robots.txt").read_text())
        for path in (ROOT / "demo").rglob("index.html"):
            with self.subTest(file=path.relative_to(ROOT)):
                self.assertIn('name="robots" content="noindex, nofollow"', path.read_text())


if __name__ == "__main__":
    unittest.main()
