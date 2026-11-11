---
name: site-launch
description: Get a website ready to go public, on any stack: page title and description, share image, favicon and touch icon, how the link looks when pasted in a chat, the hardening sweep, and a health route. Use for: is it ready to ship, what's left before we publish, favicon, app icon, share image, OG image, link preview looks wrong, site metadata, SEO title. Comes after ui-audit.
---

# Site launch

The parts of a site nobody designs on purpose: what the browser tab says, what a pasted link looks like, what the home-screen icon is. Each one fails silently. The page looks finished, and the first person to share the link sees a blank card.

Publishing is the owner's call. Prepare everything, show what was checked, then stop and hand over.

## 1. Hardening sweep

Do this first. A share image shot from a page you are about to change is wasted work.

- `ui-audit` has run, and P0 and P1 are fixed.
- Light and dark both checked, where the site has both.
- 375px wide: nothing scrolls sideways, targets are 44px.
- Keyboard: the core task works without a mouse, and every link the page exposes can be followed.
- `prefers-reduced-motion` is honoured in CSS and in JS.
- No console errors, no 404s in the network tab, no placeholder copy, no debug overlays or test content.
- Empty, loading and invalid states exist (`design-system/references/STATES.md`).
- Images and fonts are owned or licensed.
- The 404 page has a real body and links home. Fetch an address that does not exist and read the response: a 404 status with an empty body is a blank screen.

## 2. Metadata

Every page:

| What | Rule |
|---|---|
| `<title>` | The page, then the site. Under 60 characters. |
| `meta description` | One sentence that matches what the page says. Under 155 characters. A visitor arriving from the link should read the same sentence twice. |
| `og:title`, `og:description` | Same as above unless the card needs something shorter. |
| `og:image`, `twitter:image` | 1200×630, an absolute public URL. Per page where the page deserves its own, otherwise the site's. |
| `twitter:card` | `summary_large_image`. Plain `summary` shows a small square thumbnail instead of the card. |
| `og:url`, `link rel="canonical"` | The public address, no query string. |
| `lang` on `<html>` | Set, and right. |

Set the site-wide fallback too, not only the home page. Site builders ship a default title and description on the root that every later page inherits.

## 3. Share image

- 1200×630. Shoot it from the real page or draw it in code; it should show the product, not a logo on a colour.
- The primary or open state reads better at card size than a resting one.
- Text on it is large: the card is often shown 300px wide.
- Shoot at 2× and check it downscaled.
- It must be reachable without a login and without JavaScript. Localhost and data URIs do not work as `og:image`.
- Measure the file the page actually points at, do not trust the filename: read its pixel size and weight from the published URL. A square logo in `og:image` is the most common miss.

## 4. Icons

The icon is the brand's, not the project's. Never design a new favicon for a site: take the brand's mark from its assets. If the brand has none yet, ask before drawing one.

| Asset | Format | Why |
|---|---|---|
| favicon | SVG (plus a 32px PNG or `.ico` fallback) | a tab draws it at 16px, and a downscaled PNG goes soft |
| apple-touch-icon | PNG, 180×180 or larger, no transparency | iOS does not accept SVG and fills transparency with black |
| manifest icons (if the site installs) | PNG 192 and 512 | |

Check the icon at 16px and 32px before shipping. A mark that is clear at 512 can be mush in a tab.

Measure the published icon files too. They must be square: a wide mark dropped in as the icon gets squashed or padded by every browser and by iOS. Put the mark on a square canvas with room around it.

When reading tags off a published page, parse them properly instead of with a quick pattern. Two traps have each produced a false finding: attribute order varies (`href` before `rel` is common), so a pattern that expects one order reports "no favicon"; and a value can contain the other kind of quote (`content="For Font's Sake"`), so a pattern that stops at the first quote reports a cut-off title. Match the tag, then read each attribute by the quote that opened it.

## 5. The link preview

The unfurl is the first thing most people see of the site.

- Fetch the published page without JavaScript (`curl -s <url>`) and read the tags from the response. Crawlers do not run scripts.
- On a site with more than one language, fetch each language's home page: title, description, `lang`, canonical and the `hreflang` alternates should all be that language's own.
- `curl -sI` the image URL: 200, an image content type, under about 1 MB.
- Paste the link into a chat app and look at the card.
- Previews are cached hard. After a change, add a throwaway query (`?v=2`) to force a fresh one before concluding the change did not take.
- Nothing reaches the world until the site is published. Check the published address, not the editor or localhost.

## 6. Health and basics

- A health route where the stack allows one: `GET /api/health` answers 200 whenever the site runs, with `Cache-Control: no-store`, and reports ready only when what it depends on answers.
- `robots.txt` and a sitemap exist, and staging is not indexable.
- HTTPS redirects, `www` and bare domain resolve to one address.
- Analytics, if any, respects the consent choice.

## Framer note

On a Framer site everything in section 2 is set on nodes, and the keys live on different ones. Title, description and social image go on the page and on the root node. Favicon and touch icon go on the root node only; setting them on a page fails with an error that reads as "not possible" and is not. A Framer site with nothing set emits no `og:image` at all.

## Hand over

Say plainly what was verified and what was not. Motion feel and real-device touch are always the owner's check. List: the published URL, the title and description, the share image, the icons, the pasted-link result, and anything left open.
