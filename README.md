# Sahil & Laukika

Wedding invitation. 15 November 2026, MomentZ, Bicholim, Goa.

**Live:** https://nezuko-sal.github.io/sahil-laukika/

A single static page — no build step, no framework, no dependencies.
Everything is served from this repo; the only outbound request is the
Google Maps embed in the Location section.

```
index.html
css/      celebrations.css · scratch-date.css · vendor/ (page styles)
js/       scratch-date.js · vendor/
assets/   img · fonts (17) · video · audio
```

## Running it locally

Use a server rather than opening `index.html` directly — the fonts need
an HTTP origin and will not load over `file://`.

```bash
python -m http.server 8801
```

Then open <http://127.0.0.1:8801/>.

## Notes

- All paths are relative, so the site works at any subpath.
- `.nojekyll` tells GitHub Pages to serve the files as-is.
- The RSVP button opens a pre-filled WhatsApp message. The number lives
  in one place, near the bottom of `index.html`:
  `var RSVP_WHATSAPP = '...';`
