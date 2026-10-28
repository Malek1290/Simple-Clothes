#!/usr/bin/env python3
"""Build a single, dependency-free index.html from the editable src/ project.

Run:  python3 build.py

It inlines styles.css, app.js, the three woff2 fonts and the four editorial
photographs as base64 data URIs. The output works offline — including inside
sandboxed iframe previews that block all network requests.
"""
from __future__ import annotations

import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def asset_uri(relative: str) -> str:
    path = (ROOT / relative).resolve()
    if not path.is_file():
        raise FileNotFoundError(f"Missing asset: {relative}")
    return data_uri(path)


def main() -> None:
    html = (SRC / "index.html").read_text(encoding="utf-8")
    css = (SRC / "styles.css").read_text(encoding="utf-8")
    js = (SRC / "app.js").read_text(encoding="utf-8")

    # Fonts referenced from CSS: url('../fonts/name.woff2')
    css = re.sub(
        r"url\(['\"]?\.\./fonts/([\w.-]+\.woff2)['\"]?\)",
        lambda m: f"url('{asset_uri('fonts/' + m.group(1))}')",
        css,
    )

    # Images referenced from HTML: src="../assets/name.jpg"
    html = re.sub(
        r"([\"'])\.\./assets/([\w.-]+\.(?:jpg|jpeg|png|webp))\1",
        lambda m: f'"{asset_uri("assets/" + m.group(2))}"',
        html,
    )

    # Any remaining font references (e.g. the preload link) are handled here.
    html = re.sub(
        r"([\"'])\.\./fonts/([\w.-]+\.woff2)\1",
        lambda m: f'"{asset_uri("fonts/" + m.group(2))}"',
        html,
    )

    # A preloaded font is unnecessary once the @font-face src is a data URI.
    html = re.sub(
        r"\s*<link rel=\"preload\" href=\"data:font/woff2[^\"]*\"[^>]*/>",
        "",
        html,
    )

    html = html.replace(
        '<link rel="stylesheet" href="styles.css" />',
        "<style>\n" + css + "\n</style>",
    )
    html = html.replace(
        '<script src="app.js"></script>',
        "<script>\n" + js + "\n</script>",
    )

    if "styles.css" in html or "app.js" in html or "../assets/" in html or "../fonts/" in html:
        raise RuntimeError("Some references were not inlined — check the source paths.")

    OUT.write_text(html, encoding="utf-8")
    print(f"Built {OUT} ({OUT.stat().st_size / 1024:.0f} KB) — fully self-contained.")


if __name__ == "__main__":
    main()
