#!/usr/bin/env python3
"""Render src/index.tpl.html -> src/index.html.

The template is the single source of truth for the page. This script only
substitutes machine-generated values so nothing has to be hand-patched:

  * the four traced logo paths            (__PATH_W__ / __PATH_M__ / __PATH_T1__ / __PATH_T2__)
  * the favicon SVG, as a base64 data URI (__FAVICON__)
  * the WhatsApp deep links               (data-wa="key" -> href="…?text=…")

Every step is deterministic, so running this repeatedly is safe.
"""
from __future__ import annotations

import base64
import json
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
TPL = SRC / "index.tpl.html"
OUT = SRC / "index.html"
PATHS_JSON = ROOT / "assets/brand/paths.json"   # produced by the logo tracer

INK = "#0D0D0D"
PAPER = "#F7F5F1"
PHONE = "201055247802"

PLANS = {
    "plan-1": ("الباقة الأولى — البداية", "700 جنيه مصري",
               ["40 منتج", "5 تعديلات في الموقع",
                "خدمة عملاء وحل أي مشكلة في 48 ساعة", "قاعدة بيانات + دومين"]),
    "plan-2": ("الباقة الموصى بها — النمو", "1000 جنيه مصري",
               ["80 منتج (Limit)", "12 تعديل في الموقع",
                "خدمة عملاء وحل المشكلات خلال 24 ساعة", "قاعدة بيانات + دومين"]),
    "plan-3": ("الباقة الثالثة — الاحتراف", "1300 جنيه مصري",
               ["120 منتج", "20 تعديل في الموقع",
                "خدمة عملاء وحل المشكلات الفنية خلال 12 ساعة", "قاعدة بيانات + دومين"]),
}

GENERAL = ("السلام عليكم مالك 👋\n"
           "شفت موقع Malek for Website وحابب أتكلم معاك عن مشروع متجر إلكتروني.")
ADVICE = ("السلام عليكم مالك 👋\n"
          "شفت الباقات على الموقع ومحتاج ترشيح — مشروعي عبارة عن:")


def wa_text(key: str) -> str:
    if key in PLANS:
        name, price, items = PLANS[key]
        return "\n".join([
            "السلام عليكم مالك 👋",
            f"أنا مهتم بـ {name} بسعر {price}.",
            "",
            "تفاصيل الباقة اللي شوفتها على الموقع:",
            *[f"• {i}" for i in items],
            "",
            "ياريت تكلمني ونبدأ 🚀",
        ])
    if key == "advice":
        return ADVICE
    return GENERAL


def wa_href(key: str) -> str:
    return f"https://wa.me/{PHONE}?text={quote(wa_text(key), safe='')}"


def load_paths() -> dict[str, str]:
    if PATHS_JSON.exists():
        return json.loads(PATHS_JSON.read_text(encoding="utf-8"))
    # Fall back to the paths already baked into the template's loader markup.
    tpl = TPL.read_text(encoding="utf-8")
    found = re.findall(r'class="mk mk--w" d="([^"]+)"', tpl)
    raise SystemExit(
        "Missing /tmp/trace/paths.json — the traced logo paths are required.\n"
        "Re-run the tracer, or extract them from assets/brand/mw-mark.svg."
    )


def favicon_uri(paths: dict[str, str]) -> str:
    def d(key: str) -> str:
        return paths[key].replace('"', "'")

    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        f'<rect width="64" height="64" rx="15" fill="{INK}"/>'
        f'<g fill="{PAPER}" transform="translate(5.5 5) scale(0.883)">'
        f'<path d="{d("W")}"/><path d="{d("M")}"/>'
        f'<path d="{d("T1")}"/><path d="{d("T2")}"/>'
        "</g></svg>"
    )
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()


ANCHOR = re.compile(r"<a\b[^>]*>", re.I)


def fix_whatsapp(html: str) -> str:
    """Point data-wa anchors at their pre-filled link. Idempotent by design."""

    def one(m: re.Match) -> str:
        tag = m.group(0)
        key = re.search(r'data-wa="([^"]*)"', tag)
        if not key:                      # navigation / external links: untouched
            return tag
        href = wa_href(key.group(1))
        if re.search(r'href="https://wa\.me/[^"]*"', tag):
            return re.sub(r'href="https://wa\.me/[^"]*"', f'href="{href}"', tag)
        return tag

    return ANCHOR.sub(one, html)


def main() -> None:
    html = TPL.read_text(encoding="utf-8")
    paths = load_paths()

    html = fix_whatsapp(html)
    html = (
        html.replace("__FAVICON__", favicon_uri(paths))
        .replace("__PATH_W__", paths["W"])
        .replace("__PATH_M__", paths["M"])
        .replace("__PATH_T1__", paths["T1"])
        .replace("__PATH_T2__", paths["T2"])
    )

    left = [t for t in ("__PATH_", "__FAVICON__") if t in html]
    if left:
        raise SystemExit(f"unresolved placeholders: {left}")

    verify(html)

    OUT.write_text(html, encoding="utf-8")
    n = len(re.findall(r'href="https://wa\.me/', html))
    print(f"Rendered {OUT.relative_to(ROOT)} — {len(html):,} B · {n} WhatsApp links")


def verify(html: str) -> None:
    """Guard against the regression where nav anchors were handed a wa.me href."""
    bad = []
    for m in re.finditer(r"<a\b[^>]*>", html, re.I):
        tag = m.group(0)
        href = re.search(r'href="([^"]*)"', tag)
        if not href:
            continue
        is_wa = "wa.me" in href.group(1)
        wants_wa = 'data-wa="' in tag
        if is_wa != wants_wa:
            bad.append(tag[:110])
    if bad:
        raise SystemExit("WhatsApp link mismatch:\n  " + "\n  ".join(bad))


if __name__ == "__main__":
    main()
