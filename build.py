#!/usr/bin/env python3
"""Build a single, dependency-free index.html from the editable src/ project.

Run:  python3 build.py        (renders src/index.tpl.html first)

It inlines styles.css, app.js, the woff2 fonts and every screenshot as base64
data URIs. The output works offline — including inside sandboxed iframe previews
that block all network requests. The SVG monogram is inlined as real markup
(not as an <img>), so it can be animated and recoloured with currentColor.
"""
from __future__ import annotations

import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "index.html"

IMAGE_EXT = r"(?:jpg|jpeg|png|webp|svg)"


def data_uri(path: Path) -> str:
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def asset_uri(relative: str) -> str:
    path = (ROOT / relative).resolve()
    if not path.is_file():
        raise FileNotFoundError(f"Missing asset: {relative}")
    return data_uri(path)


def render_source() -> None:
    """Template -> src/index.html (logo paths, favicon, WhatsApp deep links)."""
    import render
    render.main()


def main() -> None:
    render_source()
    html = (SRC / "index.html").read_text(encoding="utf-8")
    css = (SRC / "styles.css").read_text(encoding="utf-8")
    js = (SRC / "app.js").read_text(encoding="utf-8")

    # Vendor anime.js locally and inline it for offline/iframe use.
    html = html.replace('<script src="../assets/vendor/anime.umd.min.js"></script>',
                        '<script>' + '\n'.join(line.rstrip() for line in (ROOT / 'assets/vendor/anime.umd.min.js').read_text().splitlines()) + '</script>')

    # Fonts referenced from CSS: url('../fonts/name.woff2')
    css = re.sub(
        r"url\(['\"]?\.\./fonts/([\w.-]+\.woff2)['\"]?\)",
        lambda m: f"url('{asset_uri('fonts/' + m.group(1))}')",
        css,
    )

    # Images referenced from HTML: src="../assets/..."
    html = re.sub(
        rf"([\"'])\.\./assets/([\w./-]+\.{IMAGE_EXT})\1",
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
        r"\s*<link rel=\"preload\" href=\"data:font/woff2[^\"]*\"[^>]*?/?>",
        "",
        html,
    )

    html = re.sub(
        r"<link rel=\"stylesheet\" href=\"styles\.css\"\s*/?>",
        lambda _m: "<style>\n" + css + "\n</style>",
        html,
    )
    html = re.sub(
        r"<script src=\"app\.js\"></script>",
        lambda _m: "<script>\n" + js + "\n</script>",
        html,
    )

    leftovers = [
        token
        for token in ('href="styles.css"', 'src="app.js"', "../assets/", "../fonts/")
        if token in html
    ]
    if leftovers:
        raise RuntimeError(
            "Some references were not inlined — check the source paths: "
            + ", ".join(leftovers)
        )

    OUT.write_text(html, encoding="utf-8")
    print(f"Built {OUT} ({OUT.stat().st_size / 1024:.0f} KB) — fully self-contained.")


if __name__ == "__main__":
    main()
