# AUREL — Quiet-Luxury Agency Landing Page

A complete, responsive, conversion-focused landing page for a digital agency offering
**custom e-commerce web development** and **application development**.

Open **`index.html`** — that's the finished page. It is a single self-contained file:
the two fonts, four editorial photographs, all CSS and all JavaScript are embedded as
data URIs, so it renders identically offline, in an email attachment, or inside a
sandboxed iframe. No CDN, no build step, no npm install.

```
index.html            ← final deliverable (self-contained, ~1 MB)
src/index.html        ← editable semantic HTML
src/styles.css        ← design tokens, components, responsive breakpoints
src/app.js            ← menu, reveals, countdown, WhatsApp form
assets/*.jpg          ← original generated editorial photography
fonts/*.woff2         ← Cormorant Garamond (roman + italic) and DM Sans
tailwind.config.cjs   ← optional Tailwind theme port of the design tokens
build.py              ← regenerates index.html from the source files
```

After editing anything in `src/`, run:

```bash
python3 build.py
```

---

## Design system

| Token | Value | Use |
| --- | --- | --- |
| `--cream` | `#F4F1EA` | Page background |
| `--cream-2` | `#EFECE6` | Alternating sections / form panel |
| `--ink` | `#1A1A1A` | Type, borders, dark sections |
| `--muted` | `#736D64` | Body copy |
| `--gold` / `--gold-deep` / `--gold-soft` | `#A88B5B` / `#876C41` / `#C6AF88` | Accents, italic words, seals |
| `--serif` | Cormorant Garamond | All headings, numbers, prices |
| `--sans` | DM Sans | Body, labels, navigation |

Layout is fluid with `clamp()` typography and breakpoints at **1100 / 980 / 700 / 420px**.
The stylesheet is hand-authored rather than Tailwind-CDN-based on purpose: an embedded
design-token system keeps the page dependency-free and lets it render inside previews
that block external requests. It follows the same token → utility → component logic as
Tailwind, and `tailwind.config.cjs` exports the exact colours, fonts, spacing feel and
keyframes if you want to port the page into a Tailwind or React project.

---

## Customising it

| What | Where |
| --- | --- |
| Agency name / logo | Search `AUREL` in `src/index.html` and `src/styles.css` (`.brand__mark`) |
| WhatsApp number | `WHATSAPP_NUMBER` in `src/app.js`, plus `wa.me` / `tel:` links in `src/index.html` |
| Offer deadline | `OFFER_END` in `src/app.js` and the `31 October 2026` copy in `src/index.html` |
| Colours / fonts | `:root` at the top of `src/styles.css` |
| Social links | The four `href="#"` links in the footer — replace with your real profiles |
| Photography | Replace the four JPGs in `assets/` (keep the same filenames), then run `build.py` |
| Trust claim | "Trusted by 50+ successful brands" appears in the hero badge area and offer section |
| Form behaviour | `form.addEventListener('submit', …)` in `src/app.js` |

### About the form
There is no backend. Submitting the form builds a neatly formatted enquiry and opens
**WhatsApp** (`wa.me/201055247802`) in a new tab with the message pre-filled. To send
to email or a CRM instead, replace that one handler with a `fetch()` to your endpoint
(Formspree, Resend, your own API, etc.).

### About the offer countdown
The countdown targets **31 October 2026, 23:59 Cairo time (UTC+2)**. When it expires,
the timer shows zeros and the note switches to "This offer has ended…" rather than
displaying negative numbers.

---

## Accessibility & performance notes

- Semantic landmarks, skip link, `aria-label` / `aria-expanded` / `aria-live`, visible focus states.
- `prefers-reduced-motion` disables the marquee, pulse, reveal transitions and smooth scroll.
- Reveal animations never hide content when JavaScript is disabled (`html.js` gating).
- Images carry descriptive `alt` text; non-hero images lazy-load.
- All icons are inline SVG symbols — no icon font or external sprite.
