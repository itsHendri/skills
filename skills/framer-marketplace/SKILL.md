---
name: framer-marketplace
description: >
  Prepare a Framer code component, template or site for shipping: the
  pre-submission hardening sweep, listing screenshots, an animated loop of the
  interaction, the site's own metadata (title, description, share/social image,
  favicon, Apple touch icon) and the listing copy. Use whenever the user talks
  about posting, publishing, shipping, submitting or listing something —
  "what's left before we post", "is it ready to ship", "can we publish this",
  "submit the component" — or names any asset that represents it: listing
  shots, preview images, screenshots, thumbnails, a loop or demo video, an OG
  or share image, a social preview, a link preview or unfurl, a favicon, an app
  or touch icon, site metadata, SEO title or description. Also use when
  RE-doing any of those (reshoot the assets, redo the shots, new share image),
  when a shared link looks wrong in Slack or iMessage, and when finishing a
  component that was always intended for the Marketplace. Covers the gates that
  must be cleared first, the capture recipes, the brand assets that are fixed
  across projects, and the traps that silently produce broken assets.
---

# Framer Marketplace listing

Getting a component from "it works" to "it is listed" is a repeatable loop, and
almost every step has a way of failing silently — assets that look fine and are
wrong. This skill is the loop plus the traps.

**Load this early, not at the submit step.** The listing is not a phase at the
end; it is a set of artefacts that go stale every time the component changes.
The moment the work turns towards shipping — anything about posting, the live
preview, a screenshot, a share image, an icon — read §5 and §1 before doing it
by hand from memory. Every gap this skill has ever grown was found the same way:
the work was done without it, and something silently wrong shipped.

## ⛔ Gates — read first

- **Publishing and submitting are the user's call, never yours.** Prepare
  everything, then stop and hand over. This is a standing workspace guardrail,
  not a per-project preference.
- **Ask for the Component URL before the submission form is open.** It is
  editor-only (§7), it blocks submission, and discovering that mid-form is a
  bad moment. It is the first thing to request, not the last.
- **Never claim an edit you have not made.** Saying "I've added that to the
  skill" and not having done it is worse than not doing it: the user stops
  tracking it and the gap survives. Make the edit, then `grep` the file for the
  string you claimed to add, then say so.
- **Submissions pass an automated review first** (learned 2026-08, Lollipop
  Carousel): a scanner rejects at submit time with a named issue — e.g.
  *"Missing static renderer check"*, which wants `useIsStaticRenderer` from
  `framer` gating **all** animation and continuous effects (`RenderTarget.canvas`
  alone does not satisfy it — it misses exports, and the scanner doesn't accept
  it). A rejected submission **never creates a listing**: its "view listing" URL
  404s even for the owner, and there is no ⋯ → "Publish New Version" menu —
  that flow only exists for components that already published. Fixing and
  resubmitting means **Post → Component again, with a freshly copied Component
  URL**: the URL pins `@<versionId>` at copy time, so a URL copied before the
  fix serves the old module to the re-check forever. Once past review,
  publishing is immediate — whatever ships is live.
- The Community **"Post → Component"** flow is entered by hand. You produce the
  assets and the copy; the user pastes them.

## 1. Preflight — the hardening sweep

Do this **before** shooting anything: assets made from a component you are
about to change are wasted work.

**Component**
- `framer.typecheckCode(name, source)` returns clean. (`framer.agent.typecheck`
  does not exist.)
- The control list read back from the *pushed* module matches expectation —
  `framer.agent.readComponentControls({ componentIds })` executes the fresh
  module, so it doubles as a smoke test.
- Every control has a plain-English `description`. Colour controls say to bind
  a token: *"a raw hex stays light-mode forever."*
- Defaults render something worth seeing on a bare canvas drop.
  `ControlType.ResponsiveImage` and `ControlType.File` **ignore `defaultValue`**
  — demo media needs a positional fallback in the component source.
- `@framerSupportedLayoutWidth/Height` and `@framerIntrinsicWidth/Height` are
  set; the intrinsic size is what the Marketplace preview renders at.
- Empty state: what does a buyer see with no content? It should say what to do.
- Canvas: `RenderTarget.current() === RenderTarget.canvas` short-circuits
  portals, timers and listeners.

**Behaviour**
- Keyboard: reach every interactive element, activate it, escape it, and — the
  one most often missed — **follow any link the component exposes**. If the
  only path to a destination is a click handler on a div, the component is
  mouse-only. Removing a visible affordance is exactly when this breaks.
- Touch: coarse-pointer hit areas ≥44px, and a visible way to dismiss anything
  that opens. Grow targets with a centred `::after`, never `min-width`, when the
  element's box participates in a text layout.
- `prefers-reduced-motion` honoured in **both** CSS and JS paths. A portalled
  layer is not a descendant of the component root — name it explicitly.
- Two instances on one page do not fight each other.
- Dark mode: verify by WCAG maths against the tokens, not by eye — the Framer
  screenshot API renders light only.

**Licensing**
- Demo imagery is owned or clearly licensed. Fonts too. Personal content that
  is not part of the product comes out.

Run `/ui-audit` over the component if one has not been run. Fix P0/P1 before
shooting; a listing image of a broken state is worse than no listing image.

## 2. The harness needs a bare mode

Listing guidance wants **one instance and nothing around it** — no demo-page
chrome, no title, no footer. Add a `?bare=1` param to the project harness that
hides the page furniture and lets the component fill the frame. Reuse the
harness rather than building a second bundle: one source of truth, and every
state param (`?theme`, `?open`, …) already exists.

## 3. Screenshots

Copy `assets/shoot.sh` into the project's `listing/` folder and adjust the
state list. It shoots the component alone at 2× via headless Chrome.

⚠️ **Frame listing media at 4:3 — the Marketplace stores every listing image at
1600×1200.** Shoot 1600×1200 (or 800×600 at 2×). A 16:9 hero and a 1:1
thumbnail both get cropped or letterboxed into that box, and the crop is not
yours to choose. This is the single easiest way to produce a set that looks
right in the folder and wrong in the listing. The same 4:3 applies to the loop.

Within that frame, a useful set is the resting state, the primary interaction
open, a feature detail that shows the thing no other shot shows (a different
media shape, a second layout), and a phone state if the component has one.

**Traps — every one of these has produced a broken set:**

| Trap | Symptom | Guard |
|---|---|---|
| Preview server not running | Every frame is Chrome's error page | `curl` the URL first; the script does not start the server |
| States never applied | Frames are all identical | **`md5` the output** — identical hashes mean the params did nothing |
| Cold image cache | First frame missing its imagery | Shoot a throwaway warm-up frame; `--virtual-time-budget` fast-forwards timers but **not** the network |
| Debug overlays | A cursor dot or spy marker in a listing image | Keep debug artifacts **opt-in** behind their own param |
| Focus rings | An outline round the opened element | Trigger via hover, not a synthetic click — clicks move focus |
| Mid-flight capture | A transition frozen half way | `?still=1`, and zero transition **delays** as well as durations |
| `--user-data-dir` | Chrome hangs | Never pass it. `--no-sandbox` is required |

Do not shoot a state that a still cannot convey. An interaction whose whole
point is motion (a cursor-driven push, a drift) looks identical to the resting
frame once the debug cursor is suppressed — put it in the loop instead.

## 4. The interaction loop

Two scripts in `assets/` — a recorder and an encoder, neither needing anything
installed:

```bash
# 1. Record a scripted interaction as timestamped PNG frames.
#    --expect is not optional in practice: see the trap below.
node record.mjs --url "http://127.0.0.1:5230/?bare=1&theme=light" \
  --out frames --width 800 --height 450 --ms 4000 --script steps.mjs \
  --expect "document.querySelectorAll('[data-slot]').length === 8"

# 2. Encode to H.264. Two loops reads better than one on a listing page.
swiftc -O -o /tmp/mp4enc mp4.swift && /tmp/mp4enc \
  --in frames --out loop.mp4 --loops 2 --bitrate 2000000
```

**H.264, via AVFoundation.** It stores only what changed between frames, so a
mostly-static component compresses enormously — measured on a real component,
1.27MB for 8.8s at 2Mbps with the type still crisp. (A frame-by-frame format
such as APNG runs ~8× larger per second for the same content; only reach for
one if a destination truly accepts nothing but an image.) `mp4.swift` needs
nothing installed: there is no ffmpeg here, and `avconvert` transcodes existing
video rather than building it from stills, but AVFoundation ships with macOS.

`steps.mjs` exports `steps: [{ at: <ms>, js: "<expression>" }]`, evaluated in
the page on cue — that is how the interaction is performed. Leave real time
between steps so dwells and transitions are *seen*, not merely triggered.

**Traps:**
- **Always pass `--expect`.** A dead server records Chrome's error page — and
  the result is a *structurally perfect* animation of nothing, which no amount
  of validating the output file can catch, because the file is fine. This has
  happened. `--expect` evaluates an expression in the page after settle and
  refuses to record if it does not hold. Then look at a middle frame before
  shipping: validate content, not just structure.
- **`Page.startScreencast` yields one frame and stops.** Headless Chrome with
  no display barely commits compositor frames, and no combination of
  anti-throttling flags fixes it. `record.mjs` polls `Page.captureScreenshot`
  instead — each call forces a frame, and CSS transitions advance on the real
  clock in between. Soft frame rate (~25fps), so frame timestamps are recorded
  and the encoder uses the real gaps.
- **Settle before recording.** Fonts, imagery and any measure/fit pass must
  finish or the opening frames capture the component mid-arrangement
  (`--settle`, default 3500ms).
- **Prove the output decodes**, don't assume: `qlmanage -t -s 800 -o /tmp
  loop.mp4` renders a frame out of the finished file. If QuickLook can decode
  it, it is a real video. Look at that frame too — it is the cheapest content
  check there is.
- Bitrate before resolution. 2Mbps at 800×450 held crisp type; dropping
  dimensions costs legibility much faster than dropping bitrate.

## 5. The live preview's metadata — title, share image, icons

The listing links the live site as its preview, so the **link unfurl is part of
the listing**. A Framer site with nothing set emits **no `og:image` at all** —
the card is text-only — and serves Framer's `default-touch-icon.v3.png`.
Nothing in the editor points this out, and it is invisible until someone pastes
the URL into Slack. Check it before submitting, not after.

Everything here is writable from the agent API. **The keys live on different
nodes**, and asking the wrong node returns *"Cannot apply … to WebPageNode"* —
which reads as "impossible" and is not:

| Key | Node | Produces |
|---|---|---|
| `metadata.title`, `metadata.description` | page **and** `rootNode` | `<title>`, description, `og:*` |
| `metadata.socialImage` | page **and** `rootNode` | `og:image` + `twitter:image` |
| `metadata.favicon`, `metadata.appleTouchIcon` | **`rootNode` only** | favicon, webclip |

`metadata.icon`, `metadata.image` and `metadata.ogImage` are rejected
everywhere — they are not the names.

```js
// A locally rendered card/icon gets in as a base64 data URI; socialImage
// otherwise wants a PUBLIC url that Framer's backend fetches, so localhost
// is no good. Returns {id, url, thumbnailUrl}.
const asset = await framer.uploadImage({
    image: "data:image/png;base64," + fs.readFileSync(png).toString("base64"),
})
await framer.agent.applyChanges(
    `SET <pageId> metadata.title="…" metadata.description="…" metadata.socialImage="${asset.url}"`,
    { pagePath: "/" }
)
await framer.agent.applyChanges(
    `SET rootNode metadata.title="…" metadata.description="…" ` +
        `metadata.socialImage="${asset.url}" ` +
        `metadata.favicon="${iconAsset.url}" metadata.appleTouchIcon="${iconAsset.url}"`,
    { pagePath: "/" }
)
```

### The icon is brand, not a per-project design — and it is two assets

**Never design a favicon.** Hendri has one mark — the orange scribble `#F1760F`
— and it goes on every site he ships: the portfolio, every component site, all
of it. It is deliberate identity, and a bespoke icon per project quietly
fragments it.

| Setting | Asset | Why |
|---|---|---|
| `metadata.favicon` | `…/Y0vvpdecTJxyEVeD9LTrImKe6iE.svg` (64×64) | **SVG** — a browser tab renders at 16px and a downscaled PNG is visibly soft |
| `metadata.appleTouchIcon` | `…/GbFQ2K9lAMYu7ZaB7j9USDyXKe0.png` (512×512) | webclip; apple-touch-icon does not accept SVG |

Both on `rootNode`. `uploadImage` takes the SVG URL directly and **dedupes by
content across projects**, so the upload returns the same asset id the other
sites already use — genuinely the same file, not a copy. The **share image is
the opposite**: per-project, and it should show the product.

**To find a brand asset, read it off a site that already has it** — but read it
correctly. Framer emits `<link href="…" rel="icon">` with **href before rel**, so
a regex expecting `rel="icon"` first reports "no favicon", leaves only the
apple-touch-icon PNG to find, and that PNG gets used as the favicon. Match the
tag, then read its attributes. Never assume attribute order in HTML.

Both mistakes above were made in sequence on one component: first a bespoke mark
was invented without asking whether one existed, then the webclip PNG was
mistaken for the favicon. The user spotted each from a browser tab.

- **Shoot the share image at 1200×630** (the OG standard), not a 16:9 listing
  still — the unfurl crops the difference badly. `still.mjs` at `--width 1200
  --height 630 --scale 2` does it; the open/primary state reads better at
  card size than a resting one.
- **Set `rootNode` too, not just the page.** It ships as *"My Framer Site" /
  "Made with Framer"* and is the fallback for every page added later.
- **The description should match the page**, not the pitch — a visitor arriving
  from the unfurl should read the same sentence twice.
- **The icon is a different image from the share card**: square, and legible at
  32px. Check it downscaled before shipping; three marks at 1024 can be mush at
  32.

**Traps:**
- **None of it reaches the world until publish**, and unfurls are then cached
  hard by Slack/iMessage. Append a throwaway query (`?v=2`) to force a fresh
  preview rather than concluding the change did not take.
- **Do not conclude "the API cannot do this" from probing one node.** These are
  DSL attributes, not methods, so enumerating `framer.*` for a `setFavicon`
  proves nothing either. Try the other node types, and grep the other project
  dossiers first — the answer is usually already written down from the last
  time.

## 6. Listing copy — bullets, not prose

**Copy the format of a listing the user has already shipped.** Do not invent a
structure, and do not write essays. This is the shape that shipped, from
Scrapbook Carousel:

```
Name:    Scrapbook Carousel
Byline:  Drag to spin, click for the story        ← ≤34 characters, verb-led

Description:
Turn your travels, projects, or milestones into a spinning ring of vintage
postage stamps.                                   ← ONE lead sentence

Features
- 3D ring carousel that never stops drifting      ← 6–10 words each
- Cursor steer, hover to drive speed and direction
- Click a stamp to open its postcard memory
- Ships with 15 original hand-crafted stamps

Setup
- Drop it on the page, looks complete instantly
- Swap in your own stamps via property controls
- Tune colors, fonts, stamp size, spread, speeds
- Respects reduced-motion and pauses offscreen
```

Rules that fall out of it:

- **The byline is ≤34 characters** and describes the *interaction*, not the
  thing. "Drag to spin, click for the story." Count them; the field truncates.
- **One lead sentence**, framed around what the buyer's content becomes — "turn
  your X into Y" — not around the mechanism.
- **Two bullet lists, Features then Setup.** Features is what it does, Setup is
  what they do. Six to eight bullets each, six to ten words per bullet.
- **Name the controls exactly as the panel does**, inside the Setup bullets.
- **Limitations go in a bullet, not a section.** "No CMS" earns one line; it
  does not earn a paragraph explaining itself.
- Skip adjectives the screenshots already prove.

The failure mode is verbosity. A four-paragraph description with a "worth
knowing before you buy" section reads as a README, gets skimmed, and the user's
note will be "you have written too much here". Write the bullets first and only
add prose if a bullet genuinely cannot carry it.

## 7. Hand over — fill in the whole form, not the easy parts

The Community **Post → Component** form is entered by hand. Hand over a block
that answers **every field**, so the user never opens it and discovers a
required thing nobody prepared. Walk this table before saying you are done:

| Field | Where it comes from |
|---|---|
| **Component URL** | **Framer editor only — see below.** Not in the agent API. Ask for it up front. |
| Name | §6 |
| Byline (≤34 chars) | §6 |
| Description | §6 |
| Categories / tags | §6 |
| Listing images | `listing/shots/`, all 1600×1200 |
| Loop / video | `listing/loop.mp4`, 4:3 if the form takes it |
| Live preview URL | the published site |
| Price / Free | the user |
| Support contact, refund stance | the user |

### The Component URL — get this in their hands early

It is the one field that blocks submission and the one thing the agent cannot
produce. **It does not exist in the API**: `CodeFile` exposes `id`, `name`,
`path`, `content`, `exports`, `versionId` and its methods, and there is no
`framer.*` share/module/url method. Do not go looking again; hand over the click
path instead:

> **Assets panel → Code Components → right-click the component → "Copy URL…"**
> (or the **…** menu next to it → **Copy URL**)

It yields `https://framer.com/m/<Name>-<hash>.js`, often with `@<versionId>`
appended. That suffix **pins the shared component to the version as of copying**
— buyers stay on that build until the listing URL is updated. Usually what you
want; say so rather than letting them discover it.

Related, worth mentioning once: **`@framerDisableUnlink`** above the component
stops people double-clicking to unlink and edit it. It does not hide the code.
Reasonable for a paid component, usually wrong for a free one.

### Last checks

- Say plainly what was verified and what was not. Motion feel and real-device
  touch are always the user's check — the agent browser cannot run transitions
  and its synthetic events bypass the browser's gesture arbitration entirely.
- **Paste the live URL into a chat app yourself.** The unfurl is the first thing
  anyone sees of the component and the one artefact no amount of looking at the
  site will show you.
- Once they have the Component URL, `curl -sI` it — a 200 confirms the module
  resolves before it goes on a listing.

## Assets

- `assets/shoot.sh` — listing screenshots, parameterised by state
- `assets/record.mjs` — CDP frame recorder, no dependencies
- `assets/mp4.swift` — frames → H.264 MP4 via AVFoundation, nothing to install
