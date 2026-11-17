---
name: hendri-slides
description: "Slide decks in Hendri's own look: brand colours and fonts, the ruler that counts the slides, Blueprint line drawings and the motion rules. Use for: slides, deck, presentation, talk, make a slide about this. Not for another brand's deck, which follows that brand's identity files."
---

# Hendri slides

Apply these rules to every deck made for Hendri (Slides artifact type by default).

## Hard rules
- No eyebrows or kicker labels above titles. The title alone is enough.
- No footer. The page number lives in the ruler (see The page). The cover may show hendri.design and the date, bottom left.
- Never use em dashes in any copy.
- One idea per slide; the point should land in about 3 seconds.
- Titles state the takeaway, not the topic.
- Keep on-slide text short; put the detail in speaker notes. Under a title, one line of supporting text at most.
- Look at every slide rendered before calling a deck done: nothing overlapping, clipped or wrapped by accident, and no slide with its lower half empty.

## Brand (from hendri.design)
- Colors: bg #F3F6F8, fg #1F262D, fg2 #40525E, brand #574CFF, dark bg #1F262D, sticky note #FCFFC4
- Fonts: Space Grotesk (headings and body), Fragment Mono (labels, data, page numbers), Caveat (handwritten sticky notes)
- Sticky notes are rotated about -1.5deg for a hand-placed feel.
- Sticky notes are square like a real Post-it: aspect-ratio 1/1, corners almost sharp (about 3px). The note is stuck at the top with its bottom edge lifting: a tight 1px shadow plus a soft one pulled in under the bottom edge. Use 400px by default and 300px in tight spots, and keep the copy short enough to fit.
- Sticky note handwriting is in brand violet ink (#3D33C9), never black or grey. All the text on a note is one size and one weight, like one hand wrote it in one go: no title, no smaller second line. It starts at the top left.

## The page
- Background: plain brand grey #F3F6F8 on every slide. No grid, no texture, no white pages.
- The ruler runs along the bottom and is also the page number: a thin line (2px) across the full width, 24px above the bottom edge, with the ticks standing on it. It has exactly one long tick per slide, spaced evenly over the slide's width (1920px divided by the number of slides), with three small notches (10px tall) between each pair so it reads as a ruler.
  - Slides still to come: a short grey tick (#9FB0BA, 20px tall, 2px thick), on a grey line.
  - Slides already passed: a longer dark tick (#1F262D, 28px); the line and notches up to the current slide are dark too.
  - The current slide: the tallest tick (40px tall, 4px thick, dark) at the end of the dark part. No purple marker: Hendri found the dark-to-grey change enough.
  - The slide number stays in one place, at the right end above the line (24px from the right edge), in Fragment Mono, two digits (01, 02), in grey #61717A (the lightest grey that still reads at 4.5:1 on the page). It changes but never moves; only the dark part moves.
  - On arrival the dark part grows from the previous slide's place to this one (about 700ms, the deck's ease-out). Build it as one box that hides its overflow, holding a dark copy of the ruler, and animate the box's width.
- Slide content starts 88px from the top and 152px from each side, and ends 112px above the bottom edge, so nothing sits on the ruler. The cover's line (hendri.design and the date) sits 112px up.
- The current slide is always marked by length and by its number, never by colour alone.
- When slides are added, removed or reordered, recount: the tick spacing and each slide's position change.
- In the Slides type there are no scripts, so each slide carries its own position (a `--p` value on the ruler parts) and its number as real text. The tick spacing is written as plain px in the shared CSS (gradient stops cannot be calculated), so a recount changes it in every ruler rule.

## Motion
- Animate to reveal information, never to decorate.
- Use one transition throughout: fade.
- Builds take 0.3 to 0.5s and transitions 0.5 to 0.8s. Ease out with cubic-bezier(0.2,0.7,0.2,1).
- Arrival order: the title fades up first, then the main content (a drawing, a table or cards) follows at about 150ms, callout labels after the drawing, and sticky notes land last at about 500ms.
- Stagger lists, bars, labels and pipeline steps at about 110ms per item using a --i custom property. Connecting arrows fade rather than rise.
- Animate only transform and opacity.

## Figures (Blueprint)
- The drawing is the slide. One large technical line drawing, with a short title and almost no other text.
- Line drawings: 3px stroke in #1F262D, no fill, round caps and joins. Brand purple (#574CFF, a heavier stroke) marks the one part the slide is about. Dashed lines mean "later" or "not built".
- Callouts are Fragment Mono labels on thin (2px) leader lines. Labels are HTML text placed over the drawing, never text inside the SVG.
- No "Fig n" caption under a figure: it is noise. The title and the callouts carry it.
- The figure fills the slide: a full-width box (1616 by 580px under a title and one line of text), centred between the title and the caption. A drawing that covers less than half of that box is too small.
- Every callout has a leader line that touches its part. A label with no line is a caption, not a callout.
- Give each label a fixed width worked out from its longest line (about 0.6 of the font size per character, plus padding) and keep it on one line. Place it by `left` and `top` only; centre it with `text-align`, since the Slides type drops percentage transforms.
- Shape carries meaning before colour does: in a path or timeline, say in one short plain line under the drawing what a circle, a square and a dashed line mean.
- For product or hardware explainers, use the `hendri-figures` skill: an Anatomy model redrawn in the pen look. Draw every option in a set on the same base at the same scale, so size differences read at a glance.
- Slides show SVGs as images: bake styles into attributes (no style blocks or classes), and upload a large SVG as an asset.

## Option slides
- Give one slide per shortlisted option: a figure on the left, and on the right a requirement scorecard (3-pip meter plus a short note per requirement), price chips and a sticky note naming the catch.

## Inspiration
- deck.gallery
- Pitch.com presentation gallery
- Presentation Zen (Garr Reynolds) and Duarte's slide:ology / Resonate
