---
name: hendri-figures
description: "Product and hardware figures in Hendri's pen look: an isometric model drawn by the Anatomy kit, then redrawn as a static SVG with hand-like lines, hatching over a grey wash, a stippled shadow and handwritten notes. Use for: figure, anatomy drawing, isometric, exploded view, pen drawing, draw this device. Not for flow diagrams or charts. Next: hendri-slides."
---

# Hendri figures

A figure is made in two steps. The Anatomy kit builds an accurate isometric model. The scripts here redraw it in Hendri's hand. The result is one static SVG with every style written on the elements, so it works in a slide, an image tag or a post.

## What you need
- The Anatomy kit (github.com/wheresryan22/anatomy, MIT), cloned somewhere on the machine and never edited. The project's own notes say where it is. Read its `SKILL.md` and `references/kit.md` before modelling: they explain the camera, solids and painter's order.
- Node 20.10 or later. No other dependencies.

## Step 1: the model
- One model file per object, kept with the project it belongs to (not in this skill). It imports `kit/iso-kit.mjs` from the Anatomy clone and returns three things: the figure SVG (`figureSvg`), `anchors` (screen points on the parts that will get a note) and `floor` (the footprint on the ground, pushed away from the light, for the shadow).
- Build at slide scale: a figure box is 1616 by 580, so pass that to `fitProjection` and stroke widths come out in real pixels.
- Model only what is true. Mark the one part the figure is about with `lit: true`: it gets the heaviest outline and the densest hatching. Say in a note which parts are a sketch.
- Anatomy asks for many small real parts. Keep that, but stop where the facts stop: a seam, screws and a port are fine, invented internals are not.

## Step 2: the pen
`scripts/pen.mjs`:
- `pen(svg, { floor, id })` redraws the model in the picked look. Give each figure on a page its own `id`, because clip paths are named from it.
- `note(from, to, { seed, flip })` draws one note line: a curved hand-drawn line from the label to the part, ending in an open ring. `flip` bends it the other way.
- `handLine(points, { ink, closed })` draws any other hand line (a box, an underline).

The look, picked by Hendri in rounds on 2026-11-17:
- Drawing in Slate #1F262D. Every line is real geometry nudged by slow seeded noise and drawn twice, with a small overshoot at corners. Never use a displacement filter: it works on pixels and looks jagged.
- Tone is even hatching over a flat grey wash (#C6D4DB, #D3DEE4, #E2E9ED, #EDF1F4, darkest face first), crossed on the darkest face. Tops stay paper.
- The shadow on the ground is stippled, never hatched.
- Notes are Brand ink #4A3FE0 in Caveat, about 40px at slide scale. The line has a paper-coloured edge under it and the ring has a paper fill and a paper halo, so both read over hatching. The halo sits under the line, never over it: the line runs right up to the ring.
- Nothing is told apart by colour alone: the lit part is marked by line weight and hatch density.
- Other textures exist in the code for later rounds (`stipple`, `engrave`, `halftone`, `wash`, `mixed`), and `ramp` gives each tone level its own ink. Use them only when Hendri asks.

`scripts/bake.mjs` holds the two plain themes (`line` and `tone`) for when a clean technical drawing is wanted instead of the pen look.

## Notes and captions
- Note lines never cross each other, and a line never passes over another note's ring. Move a label to another side before accepting a crossing; `notesCross(pairs)` in `scripts/pen.mjs` catches the straight-line case, and a rendered look catches the rest.
- A note is a short label, a curved line and a ring on the part. Place labels in the left and right margins, never over the drawing, and keep lines from crossing each other or the object where a different side would do.
- In a slide the label is real text laid over the image (fonts do not load inside an SVG shown as an image). On a web page it can be text in the SVG.
- No "Fig n" caption under a figure: Hendri finds it noise. If a shape or line style carries meaning, say so in one short plain line; otherwise the drawing and its notes are enough.

## Motion
Picked by Hendri on 2026-11-17. The figure must be complete and readable with no motion at all; motion is added on top.
- Line boil: the drawing is exported three times with different seeds (`pen(..., { seed })`) and the three take turns. On a web page they switch with no fade, about five times a second (the look Hendri picked). Export boil frames with `wobble: 2`: at the normal wobble the frames differ by less than a pixel on a slide. The stippled shadow keeps its own fixed dots, so it stays still.
- No moving parts by default. Hendri tried a pressing button and dropped it: it drew too much attention. The code can still split a figure (`part: 'lit'` and `part: 'base'`) if a mechanism ever has to move to explain something.
- Notes arrive one by one, quickly: each line draws from the words to the part in about a third of a second (`noteLine` gives the path and the ring position), then its whole label fades in, and the next note starts 0.35s after the one before. Five notes are done in about two seconds. Letter-by-letter typing was tried and dropped: with several notes it felt slow.
- Nothing else moves. Everything stands still for people who ask for reduced motion.
- In a Slides deck there is no line boil: the drawing stands still. Slides runs no scripts and holds a hard frame switch still (tried as a stepped CSS animation and as the drawing's own timing), and the soft fade that does play reads as a slow shimmer, not a boil. Hendri dropped it on 2026-11-17. The boil is for web pages, where a script or a stepped animation can cut between frames.
- Notes still arrive in a Slides deck. The drawing is uploaded images stacked in place; each label is one text box, so it stays editable; the note line is a small inline drawing with a `stroke-dashoffset` animation. Keep every arrival delay short (all notes in within about 2.5s): long delays played out of order. An inline drawing may not link to an uploaded image.

## Before calling it done
- Render it and look: no clipped labels, no note line through another label, the lit part clearly the heaviest.
- Check the file size. A figure is about 50 to 60 KB; in a Slides deck upload it as an image rather than pasting it inline.
- Same seed, same drawing. Change the seed only to get a different hand, never to fix a layout problem.

Next: `hendri-slides` for placing the figure on a slide.
