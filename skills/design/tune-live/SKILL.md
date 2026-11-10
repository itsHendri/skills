---
name: tune-live
description: >
  Tune motion and other feel values live with a temporary control panel instead of guessing
  them. Use when tuning springs (stiffness, damping, mass), easing curves, durations, tilt or
  parallax amounts, shader or canvas parameters, halftone or noise settings, or any number the
  user would otherwise judge by retyping it. Also triggers for: "add sliders", "let me tweak
  this", "make it tunable", "dial this in", "tuning panel", tune-panel, a dev-only tweak panel,
  DialKit, Tweakpane, leva. Covers wiring tune-panel into a plain page or a React/Vite app,
  theming it per brand, the wire, tune, paste, bake loop, and removing it before anything ships.
---

# Tune live: wire a panel, let the user tune, bake the numbers, remove the panel

A spring that "feels a bit slow" is a number nobody can guess right in chat. Put the number
on a control, let the user feel it, and copy back what they chose. The panel is scaffolding:
it exists for one tuning session and is gone in the same change that bakes the values in.

`motion-design` says what good motion is (timing ranges, easing, reduced motion). This
skill is how to find the exact values for one piece of work.

## When to use it

* Motion: springs, easing curves, durations, staggers, tilt, parallax, scroll ratios.
* Rendering: shader uniforms, noise scale, halftone dot size and angle, blur, grain.
* Anything else where the right value is a feel the user has to see, not a spec.

Not for values a spec or token already fixes. Not for controls that ship as part of a
product (a type tester's size slider, an editor's inspector): those are product UI, designed
in that product's own system.

## The panel: tune-panel, everywhere

One panel for every brand and stack: [tune-panel](https://github.com/itsHendri/tune-panel).
A single web component in a shadow DOM, no build, no dependencies. It sits full height on
the right and pushes the page narrower (a right margin on `<html>`), and it collapses to a
rail. Don't reach for DialKit, Tweakpane or leva: tune-panel is the one the user knows.

Plain HTML page, lab or shader spike. Always the pinned tag, never an unpinned URL:

```html
<script type="module">
import { tune } from "https://cdn.jsdelivr.net/gh/itsHendri/tune-panel@0.1.2/tune-panel.js";

tune(CFG, {
  max: { min: 0, max: 30, step: 0.5, unit: "°", label: "Tilt max" },
  spring: { type: "spring", stiffness: [60, 800, 10], damping: [1, 60, 1], mass: [0.2, 4, 0.1] },
}, { title: "Hover tilt", theme: "hendri", fps: true });
</script>
```

Vite or React app: `npm i -D github:itsHendri/tune-panel#0.1.2`, then mount it once in an
effect and destroy it on unmount:

```js
import { tune } from "tune-panel";

useEffect(() => {
  const panel = tune(cfgRef.current, schema, { title: "Card tilt", onChange: () => setTick((n) => n + 1) });
  return () => panel.destroy();
}, []);
```

Read the project's README for the full API. What matters when wiring it:

* **It edits the page's own object in place.** `tune(CFG, schema, options)` binds to the
  config the code already reads, so a render loop picks changes up with no glue. In React,
  read a ref in the animation loop, or re-render from `onChange`.
* **Values live in the object, ranges in the schema.** `[min, max, step]` or
  `{ min, max, step, unit, label, hint }` for numbers. Keys the schema leaves out are
  inferred from their value (number, boolean, hex colour, nested object as a section).
* **Springs** need an object in the config, `{ stiffness, damping, mass }`, declared as
  `{ type: "spring", ... }`; the control shows a curve and how long it takes to settle. If the
  code keeps flat `stiff`/`damp` numbers, move them into one spring object first.
* **Easing** is `"easing"` with `[x1, y1, x2, y2]` in the config: a cubic-bezier editor.
* Also: `{ type: "select", options }`, `"color"`, a function as a button (replay an
  entrance), `{ type: "readout", get }` for a live value, `false` to hide a key.
* **Theme per brand** with `theme: "<slug>"` (`neutral`, `hendri`, `fontsake` so far). A
  brand without one: copy `themes/neutral.js` in the tune-panel repo, map it from
  `brands/<slug>/identity/tokens.json`, add it to `themes/index.js`, and tag a new version.
  The page loads the brand's fonts; the theme only names them.
* One panel per page. Group with nested objects, not a second `tune()`.
* Check it in the browser yourself: `document.querySelector("tune-panel").values` reads the
  values, `.set(path, value)` changes one, without the clipboard.

### Design canvas

Continuous levers on a Design Artifact canvas use the canvas's own `data-props` tweaks, as
`design-canvas` describes. Don't add tune-panel there.

## The loop

1. **Wire.** On a branch (or in an exploration file), add the panel. Every control gets a
   real range: wide enough to reach a surprising answer, not 0 to 100 by habit. The
   defaults are the current values in the code, so the first frame looks like what shipped.
2. **Tune.** The user plays with it. Holding the compare pill at the panel's top (or the
   backslash key) shows the code's values; letting go brings the edits back. Don't touch
   the code meanwhile.
3. **Paste.** The user presses Copy values and pastes the JSON into chat.
4. **Read it back.** Point out any value sitting at the end of its range (widen the range
   and offer another round), and anything extreme, like a spring that wobbles for seconds.
5. **Bake and remove, in one change.** Write the values into the code or the design tokens
   (motion tokens when a value is reused), then delete the import, the `tune(...)` call and
   the dependency (`npm uninstall tune-panel`). Say which values changed, old and new.

## Hard rule: the panel never ships

* Before any commit to main, grep the changed files and the lockfile:
  `git diff --cached --name-only | xargs grep -n "tune-panel"` and
  `grep -n "tune-panel" package.json package-lock.json pnpm-lock.yaml 2>/dev/null`.
  Any hit means the bake step isn't done.
* Exploration files that live outside the shipped app (an `explorations/` folder) may keep
  their panel; they're the lab, not the product.
* To let a client try values, send a branch preview, never a build with the panel in it.

## Anti-patterns

* Guessing a spring in chat over five rounds when one control would settle it.
* Ranges that can't reach the right answer, or are so wide the useful part is two pixels.
* Defaults that aren't the current values, so the user tunes from a state that never existed.
* Baking the values and leaving the panel "for next time".
* A second panel library for one project, or a hand-built slider rail.
* An unpinned tune-panel URL: the panel changes under the user mid-session.
