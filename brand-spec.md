# Brand spec — Malek for Website (MW)

Source of truth for the redesign. Everything in the site references these files
or these tokens; nothing is redrawn by hand.

## Logo

| Asset | Path | Use |
| --- | --- | --- |
| Master mark, `currentColor` | `assets/brand/mw-mark.svg` | Everywhere in the UI — inherits its colour from context |
| **Light logo** — paper glyph on ink tile | `assets/brand/mw-mark-light.svg` | Dark surfaces: header on dark, loader, footer, avatar/social |
| **Dark logo** — ink glyph on paper tile | `assets/brand/mw-mark-dark.svg` | Light surfaces: paper pricing states, print, invoices, light decks |
| Lockups (symbol + MALEK) | `assets/brand/mw-lockup-{light,dark}.svg` | Presentation covers, email signature, proposals |
| Favicon | base64 SVG data-URI in `<head>` | Browser tab (ink tile + paper glyph, legible down to 16 px) |

The site uses the **`currentColor` master** so a single asset serves both
themes: inside the header/footer it inherits `--paper`, and anywhere it sits
on a light block it inherits `--ink`. The two tiled files exist for contexts
outside the page (social avatars, print, decks) where a fixed surface is
required.

**Traced, not drawn.** The supplied brand sheet
(`360_F_573792008_…jpg`, 647×360, light panel + dark panel) was cropped,
upscaled 4×, thresholded, traced with marching squares, Douglas–Peucker
simplified, then corner-preserving Chaikin sub-divided. The master SVG holds
the resulting 4 closed paths (upper W, lower M, left triangle, right
triangle) in a `0 0 60 60` viewBox, ~6 KB, resolution independent.

The mark is **monochrome only** — the split MW with a horizontal cut through
the middle: the `W` above the cut, the `M` below it, flanked by two solid
triangles that read as the cut's "wings".

## Colour

Extracted from the logo's two-tone system and extended into a full scale.
Pure achromatics: the brand is the black/white contrast itself, so no hue is
introduced anywhere in chrome, surfaces or type.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#0D0D0D` | Dark variant surface, primary type on light |
| `--ink-soft` | `#171717` | Raises surfaces off the base |
| `--ink-panel` | `#1C1C1C` | Cards on the dark canvas |
| `--paper` | `#F7F5F1` | Light variant surface, primary type on dark (warm off-white, reads as fabric paper) |
| `--paper-2` | `#EDEAE3` | Alternating light sections |
| `--paper-3` | `#DCD8CF` | Light borders / hairlines |
| `--stone` | `#8C8880` | Muted body copy on dark |
| `--stone-2` | `#6B6862` | Muted body copy on light |
| `--line` | `rgba(247,245,241,.14)` | Hairlines on dark |
| `--line-ink` | `rgba(13,13,13,.12)` | Hairlines on light |

Measured contrast (WCAG 2.1, sRGB):

| Pair | Ratio | Result |
| --- | --- | --- |
| `--paper` on `--ink` | 17.85:1 | AAA |
| `--paper` on `--ink-panel` | 15.65:1 | AAA |
| `--ink` on `--paper` | 17.85:1 | AAA |
| `--stone` on `--ink` | 5.51:1 | AA (body) |
| `--stone-2` on `--paper` | 5.10:1 | AA (body) |
| `--stone-2` on `--ink` | 3.50:1 | AA large text / labels only |
| `--stone` on `--paper` | 3.24:1 | **not used for body** — hairlines and 11 px+ labels only |

Rule: on light surfaces, body copy uses `--stone-2` (5.1:1); `--stone` is
reserved for dark surfaces. Hover states that flip a dark card to `--paper`
switch their muted text to `--stone-2` at the same time.

## Type

Fashion-editorial pairing: a high-contrast display serif for headlines and
numerals, plus a neutral Arabic sans for body. Both self-hosted.

| Role | Family | Notes |
| --- | --- | --- |
| Display / Arabic headlines | **El Messiri** 500/700 | Arabic-first, calligraphic terminals, matches the mark's tapered strokes |
| Latin display / numerals | **Cormorant** 300–700 (variable) | Editorial fashion feel; used for `MALEK`, prices, index numbers |
| Body / UI | **Cairo** 400/600/800 | Arabic + Latin subsets |

No rounded corners above `2px` in display contexts: the logo is sharp, so the
interface uses square geometry (hairline rules, hard edges) to match, with
photography carrying all the softness.

## Imagery

Real product photography from the two live stores, pulled from the image
repositories the shops actually serve:

| File | Product | Store |
| --- | --- | --- |
| `assets/live/sm-cloth-star-girl.webp` | STAR GIRL SWEATPANTS | CLOTHINA |
| `assets/live/sm-cloth-cozy-cardi.webp` | COZY CARDI | CLOTHINA |
| `assets/live/sm-cloth-suffers-hoodie.webp` | SUFFERS HOODIE | CLOTHINA |
| `assets/live/sm-cloth-corset-jacket.webp` | CORSET JACKET | CLOTHINA |
| `assets/live/sm-cloth-duo-zip-set.webp` | DUO ZIP SET | CLOTHINA |
| `assets/live/sm-cloth-motivation-jacket.webp` | MOTIVATION JACKET | CLOTHINA |
| `assets/live/sm-cloth-basic-set.webp` | BASIC SET 1 | CLOTHINA |
| `assets/live/sm-awam-product.webp` | سواريه جوخ شداد | عوام الدلنجات |

Plus the two storefront contexts already in the repo
(`assets/projects/s-awam-hero.webp`, `s-cloth-hero.webp`) for the project cards.

## Voice

Egyptian Arabic, first person ("ببني، بصمّم"), short declaratives, prices always
explicit, no exclamation-mark salesmanship. The site sells craft and clarity,
which is what a fashion label wants from the person building its store.

## MW Lab extension — November 2026
- Design read: preserve / editorial fashion / monochrome. Dials: variance 4, motion 8 (opt-in only), density 4, assets 8, brand fidelity 10.
- Narrative: a playful intermission after the main content, phone/laptop viewing, ample space around a Python-style code window.
- Rounded cards: 24px; buttons: 12px. Existing paper/ink palette and Arabic typography retained.
- Fast visual typing (~2s), slow 39-second DOM/SVG sequence; never starts without Start.
- Text bubbles, not recorded speech. No Python is executed. Escape, Skip, tab-accessible controls and reduced-motion static narrative.
- Source imported from Drive Simple-Clothes-main; provenance in scripts/drive-import.json. Cloudflare transport scripts removed.

## Motion v2 / responsive refinement
- Preserve existing monochrome brand; cohesive 14/18/20/24/28px corner hierarchy.
- GSAP 3.14.2 controls a Canvas renderer, replacing rigid SVG/CSS scene changes. Joint-based poses, traced light portal, drifting light particles, articulated escape and ink restraint.
- 1.8-second typing; ~44-second theatre; opt-in only, no flashing.
- Phone: smaller code font, 44px controls, safe-area-aware subtitles, bounded container, reduced particle count; landscape caption treatment.
- Browser evidence at five portrait/landscape sizes stored in scripts/responsive-results.json.

## Motion v3 — anime.js revision
- Replace GSAP entirely with anime.js 4.2.2, locally bundled under MIT.
- Larger faceless figure, clear climb above the luminous boundary, broad shadow sheets rather than crossing ropes.
- Fast 1.8-second typing; slow scene, ~47 seconds total including typing. Same brand, Arabic dialogue and opt-in-only interaction.
- Post-render Canvas updates use native anime.js onRender; five responsive browser cases re-run.
