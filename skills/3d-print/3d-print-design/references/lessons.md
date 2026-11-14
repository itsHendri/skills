# Lessons by kind of part

Each section is what was learned printing one kind of part. Read the section that matches the part being designed before modelling it.

## Embossing presses (from `signature-embosser`)
- The female die is the male **mirrored across the hinge axis**.
- **Hinge axis height:** `plate_t + paper_gap/2`.
- **Raised side and orientation:** the paper's raised side faces the female
  plate. Read the right way up, it looks like the male plate seen from above.
  Decide which edge of the paper butts against the hinge, and orient the
  logo for it.
- **Die geometry:**
  - male 1.0 mm high;
  - female 1.2 mm deep, outline +0.3 mm per side;
  - paper gap 0.3 mm (200–300 gsm card).
- **Rounded die edges, on by default for every embossing stamp** unless the
  owner asks otherwise. This is the "bevel" or "radius" of embossing dies, the
  owner's "stress relief". It gives a softer edge on the imprint and less
  cracking. The owner confirmed it after the first real print (2026-10-26).
  - Male: rounded top edge, radius 0.4 mm.
  - Female: rounded rim, radius 0.5 mm.
  - **How to build them:** nested terraces along a quarter circle, about 6
    steps of 0.1 mm (one print layer, so they print as a curve).
    - Each terrace is a `region_solid` with a negative offset (male) or a
      larger offset (female); the Exact boolean merges them.
    - Use a 0.01 mm-simplified outline for the terraces to keep the file
      light. That's about 30k triangles and 1.5 MB for the signature press.
    - Skip the last female terrace: it's a sliver at the face itself.
  - **Gotcha:** don't `recalc_face_normals` after the boolean. It flipped a
    nested recess inside-out. Exact output is already oriented.
  - **Show it** with a side-profile drawing through a small feature
    (`render_section.py`). A 3D render can't show a 0.4 mm round.
- **Reach** (paper edge to logo) is limited by the closed hinge side. Size the
  plates for the reach the owner needs.

## Pattern plates without a hinge (from `pattern-emboss-plates`)
- **Nest and drop-in lid** for a cut paper square:
  - The base has four L corner brackets: nest = paper + 0.3 mm per side.
  - The lid fits the nest with 0.2 mm play.
  - The paper is pushed into one marked corner, and the dies are placed for
    that corner.
  - **Key:** a tab on the lid fits only the one wider gap between brackets
    (30 mm vs 24 mm). That stops a 90° turn and a wrong flip.
  - Small round reliefs in the nest's inner corners.
  - **No finger notch** under the paper. The owner disliked it: unsupported
    paper is stressed when pressed. Square edges all round; the paper is
    lifted at a gap.
  - The lid prints face up and is flipped left-to-right to use, so it is
    mirrored in x.
- **Clean line art as signed distance fields** (numpy, 0.02 mm grid):
  - Each stroke is `width/2 − distance to the centre line`; take the max over
    strokes.
  - Trace outlines with marching squares (a CCW table with the saddle cases
    split by the cell-centre value).
  - Every terrace of the rounded edges is then just another level of the same
    field: male inset `r(1−cos)`, female grow `r(1−cos)`.
  - Close thin lid walls (< 0.8 mm) in the field with a distance transform
    before tracing.
  - For terrace CDTs, use a y-bucketed winding test; the per-point one is too
    slow.
  - About 2.5 min for 2 bases + 2 lids of 66 mm. Base files are 2.5–5.7 MB
    for dense ring patterns.
- **Line ends in clean line art:**
  - A stroke that ends *on* another line must stop flush there: snap the end
    onto the other centre line and cut it square. A round cap pokes out as a
    visible bump; the owner spotted it at once.
  - Two mirrored strokes merging at a symmetry axis: end them with a
    half-plane cut, not round caps.
  - Show the owner a black-outline overlay of the clean shapes on the print
    before building.
- **Look in detail before showing the owner** (their rule of thumb, 2026-11-05):
  - **Measure, don't eyeball.** Read ink intervals along scan lines and
    along rays from each circle's centre, then compare them with the clean
    shape. Eyeballing a downsized overlay misled me several times.
  - **Refit every circle robustly:**
    - mid-points across the stroke, Kasa fit, trimmed residuals, keeping the
      symmetry axis;
    - accept it only if rms < 0.07 mm;
    - a residual that varies twice per turn means an **ellipse**: fit a
      conic.
  - **Hand-drawn strokes vary in width per shape** (1.1–1.46 mm here). Use
    a width per shape, and a taper for free ends that thin out.
  - **The owner wants every shape as a perfect geometric fat line of even
    width:** circles, ellipses, arcs and straight strokes with round ends.
    - No traced outlines (the "region" polygons) and no tapers. They were
      rejected as "outlines with no fill".
    - Near-miss strokes in the drawing may be meant as one line, or as
      separate shapes: ask, or show a `lines_only` view (black fat lines on
      white). It reads much more clearly than outlines.
  - **Overlapping coincident boundaries leave a zero-line crack** in a
    max-union SDF. Overlap pieces by about 0.1 mm.
  - **Mismatch map:** XOR the clean shape with the ink, erode by 0.15 mm,
    then list clusters of area. Work through them largest first. With
    Procreate's symmetry, brush wobble repeats in every quarter, so a
    repeat isn't proof of a shape error.
  - **Closed ellipse polylines:** set the last point equal to the first, or
    the flush-end rule sees a fake end.
- **Negative space (gaps between raised lines):**
  - Fill gaps under 0.8 mm on the base (and so in the lid) with a closing on
    the field.
  - Then clean up:
    - an opening by 0.3 mm, kept no smaller than the drawn lines, removes
      the spikes the fill tapers into;
    - leftover pockets under 0.8 mm² are filled with a flood fill on a 3×
      coarser grid.
  - **The owner prefers thin, uniform lines:** one width (0.9 mm) on both
    plates. The paper folds over the line, so the emboss comes out wider,
    and wider gaps keep the lid walls. Use a 0.3 mm male rounding on 0.9 mm
    lines.
  - **Don't put the lid-wall cut-off exactly at a common wall width.** With
    0.9 mm lines many walls are about 0.8 mm. An 0.8 cut-off on the raster
    kept them in some places and not others, leaving ragged slivers and
    non-manifold edges. Use 0.7 instead.
  - **Gaps of 0.8 to 2·female_offset + min_wall (1.3 mm) print, but have no
    lid wall,** so the paper isn't pressed down between those lines. Mark
    them (`plate_lines_*.png`, amber) and tell the owner. Dense line art
    (artwork 2's orange) has many of them.
- **Check layer overlap before sharing a lid between ink layers.** On artwork
  2, the two layers' grooves covered about 85 % of the tile, so a shared lid
  would be one big pocket. Use one lid per layer. Pressing a second layer may
  flatten the first; test it.
- **Verify the mirroring** by casting rays: every raised point of the base
  must lie under a groove of the flipped lid (100 %). Report the line-to-groove
  clearance with the lid centred and pushed by its play.

## Wax seal stamps (from `wax-seal-stamp`)
- **Engrave** the logo into the face (it comes out raised in the wax) and
  **mirror** it across X. Check the mirroring with a height-field wax render
  read from above (`simulate_wax.py`).
- **Small logos get too thin.** A 40 mm signature shrunk to a 17 mm circle had
  strokes of p5 0.48 mm.
  - Grow every outline evenly until p5 ≥ 1.0 mm (`region_loops` with an offset
    returns clean loops).
  - Then fill slits under 0.6 mm by closing (grow, then shrink), so no sliver
    of face is left in sharp V's.
  - Keep that fill as light as printing allows. Wax copies fine detail well;
    the limit is the face strip printed between two grooves, which needs about
    one nozzle line (0.4 mm). For the brand symbol's zigzag notches,
    `close_gaps=0.2` (fill under 0.4 mm) kept the notches sharp. The
    signature's 0.3 blunted a third of each one, and the owner noticed. Draw
    what the fill removes (a raster of before vs after) before choosing.
  - Measure the face left between strokes with the inward ray-cast on the
    reversed loops.
- **Release:** walls lean out 10° (terraces one print layer, 0.08 mm, tall),
  plus a 0.15 mm rounded lip. 0.8 mm deep by default.
- **One-piece stamp:** revolve a profile (watertight by construction).
  - Print it standing, knob on the bed, face up, so ironing smooths the face.
  - Any segment that widens going up must have a slope ≤ 1.
  - A flare of 0.85 mm radius per mm of height clears the 45° check.
- **Up mark:** a slot on the head's side at the logo's top. Slope its roof (50°)
  so it needs no support.
- **Offer test heads** (bare discs with 0.6 / 0.8 / 1.0 mm depths, told apart by
  their notch counts).
- **PLA and hot wax:** chill the stamp (ice pack or freezer), hold it 15–20 s,
  oil it if it sticks. PETG copes better with heat.
- **Slicing (P2S, PETG Matte):** use `0.08mm High Quality @BBL P2S`.
  - Put the face and the engraving floor on layer heights (0.2 + 0.08 k);
    the 21.24 mm stamp lands exactly.
  - Overrides: ironing top, 3 walls, Arachne, 25 % gyroid, seam back, no brim
    (the Ø16 knob stands).
  - Stamp: 58 min, 3.8 g. Script: `wax-seal-stamp/prep_print.py`.
  - Stay on the 0.4 mm nozzle; the strokes are thickened for it.
- **Check a dense design's fit before building** (emblem seal, 2026-11-08):
  - Redraw the centre lines at scale with the line width kept at 0.9 mm.
  - Close gaps under 0.8 mm, and draw the filled parts in red, at true
    relative size.
  - Offer a labelled sheet of face sizes and crops
    (`wax-seal-stamp/export/emblem_options/`).
  - Artwork 2's emblem needed 30 mm without its corner knobs; 23 mm clogged.
  - Shapes that stick out (corner knobs) force the whole design smaller in a
    round face.
- **Long outlines make heavy terraces.** Step the draft every 2 layers
  (`layer=0.16`): the printed slope is the same and the file is about half
  (emblem: 130k → 81k triangles).

## Organic / bubbly shapes and covers (from `airpods-bubble-case`)
- **Build them as a signed distance field (SDF), not with mesh booleans.**
  - Get the exact distance to the reference object with OpenVDB, which ships
    in Blender as `import openvdb`:
    `FloatGrid.createLevelSetFromPolygons` → `copyToArray`.
  - Combine in numpy:
    - a smooth min (`smin`) for blobs;
    - a crisp `max` for the fitted cavity;
    - a soft `smax` for openings and rims.
  - Then `copyFromArray` → `convertToPolygons(adaptivity=0)`.
  - Result: watertight by construction, and about 15 s for a whole case.
  - Keep mesh booleans for crisp detail only, such as a signature recess.
- **OpenVDB adaptive meshing folds small triangles.** Mesh at adaptivity 0,
  then use quadric Decimate to a triangle budget. On smooth voxel meshes it
  keeps the fit within about 0.01 mm. This is the exception to "no
  Decimate". After decimating, collapse any folded sliver.
- **Support-free in the field:** walk the layers from the top of the print
  down. Set `F[k] = min(F[k], maxfilter_cross(F[k+1]))` with cubic voxels.
  - This is exactly the 45° rule.
  - It makes chamfered landings, pointed roofs on round holes and chins under
    bubbles automatically.
  - Run it **after** all cuts, then cut the bed plane.
- **Bubbles on a vertical wall need no fill** if they stick out by
  ≤ 0.29 × their radius. Above about 0.36 the chins start to show.
- **Rounded tops and bottoms flatten.** A rounded top or bottom that sits on
  the bed turns into a flat landing about 0.8 R wide. Say so when showing
  previews.
  - The owner disliked the flat top on the AirPods cap. Using 55° for that
    piece (TPU, slow) halves the landing (about 0.4 R).
  - For a steeper angle, resample the field in z to h / tan(angle), run the
    same pass, then sample back.
- **Domed cap that should be bubbly on top (the owner wanted this):** print it
  upright, opening down, and give it a hidden peaked air gap inside:
  - Grow the cavity field upward with the same pass (`upward=False`). The
    tip is about 0.22 R above the dome.
  - Build the wall over it. The piece gets about 2–3 mm taller.
  - The fill pass leaks down from the gap's tip and floods the whole cavity,
    so cut the cavity and the rim again after the fill.
  - Edges that must stay lifted off the bed get cut after the fill and sit
    on a generated tear-off strip: 0.8 mm wide, 0.25 mm below the edge, a
    separate shell in the same STL.
- **Openings that meet a rim:** use height-field cuts with a cosine fade (flat
  middle, zero slope at the ends), not superellipses. A superellipse meets
  the rim vertically and leaves a visible step. Also limit the cut by `y > 2`,
  not by a plane near the surface, which made a sharp step around the
  rounded ends.
- **Moving parts in a fitted cover (lids, hinges):**
  - Don't copy a maker's generic keep-out rectangle as a hard cut. It leaves
    a big blank band.
  - Instead, trim by sweeping: rotate one piece through its range in about
    5° steps. Sample the other part's field at the rotated grid points, take
    the minimum over angles, and `smax`-cut where it's below the clearance
    (0.4 mm).
  - Add rounded superellipse notches as the visible shape, so the trim only
    shaves leftovers. Raw trims leave thin spiky fins where they meet the
    surface at a shallow angle.
  - Keep any zone the maker hatches as "swept" empty, and check it.
  - On a lid whose hinge axis sits just inside the back, any cover material
    behind the back and below the axis hits the base's top edge when the lid
    opens.
- **Fitted covers for a bought product:**
  - Look for the maker's dimensional drawings first. Apple publishes them at
    developer.apple.com/accessories/dimensional-drawings.
  - Trace the outlines from the rendered PDF pages: PDFKit via a `swift`
    script (no poppler on the Mac), at 20+ px/mm.
  - Don't ship the drawing itself.
  - **Spec thickness includes the feet.** The 2012 MacBook Pro is "24.1 mm",
    but its front edge fit a PETG slot of 22.8 mm snugly (`macbook-server-stand`).
    Slot fit tests: start about 1.5 mm *under* the spec, step 0.4 mm, and make
    the walls tall enough (≥ 30 mm) to reach past the rounded edge onto the flat
    sides. 12 mm walls only touched the rounding and misled the first test.
- **TPU 95A:**
  - It can't go through the AMS: use the external spool.
  - Clearance 0.05 mm per side, because printed holes come out about 0.1 mm
    tight. PLA needs about 0.20.
  - Walls ≥ 1.2 mm.
  - Recesses ≥ 0.6 mm wide.
  - Ship a ring fit-test (several clearances, counted by notches).

## Kit cards, flex gates and two colours (from `signature-carabiner-kit`)
- **Handout kit card:** 86 × 54 mm (credit card), ≤ 4 mm thick.
  - Frame rails 2.5 mm, runners 1.6 mm, all 2.0 mm tall.
  - Snap-off tabs 1.0 × 1.0 mm, necking to 0.5 × 0.68 mm at the part.
  - Tabs 0.4–4.7 mm long. Never put a tab on a flexing part.
  - Find tab points by casting a ray from the part to the frame (`auto_gate`).
    Use the *last* exit of the part, since the start may sit in a hole.
- **Flat-printed carabiner, springy gate (PETG):**
  - Body 3.2–3.5 mm wide, 3.2 mm tall.
  - Gate 1.6 mm wide, about 23 mm free, gap to the body ≥ 0.58 mm all along.
  - The body narrows and steps into the gate over 3 mm (smoothstep), so there's
    no corner to crack.
  - Hook: a 1.6 mm lip on the outer side, covering the gate tip by 1.5 mm, so the
    gate only opens inwards. The gate axis sits inside the body axis by
    `(clip_w/2 + gap + lip_w) − body_w/2`, so the lip is flush with the outside.
  - Check the bending strain `ε = 3·t·δ / (2L²)`: 1.3 % at 3 mm open (keep it
    under 2.5 % for PETG). Push force `3·E·I·δ / L³` ≈ 1.6 N (E ≈ 2000 MPa).
    - At 17.6 mm free length it was 2.3 % and 3.6 N: lengthen the gate before
      thinning it.
  - Measure the gaps in the 2D field: sample the gate's edges in the
    "everything but the gate" field.
  - Ship a test strip: the same free length at three widths (1.3 / 1.6 / 1.9 mm),
    plus charm rings with three hole sizes, told apart by notches.
- **Charm hole on a square section:** hole ≥ the section's diagonal + 0.8 mm.
  - 3.2 × 3.2 mm → 5.6 mm hole (0.54 mm play).
  - A loop ring around it: wall 1.5 mm.
- **Two-colour inlay (AMS):**
  - The accent is the top 0.36 mm (three 0.12 mm layers). Cut the pocket with the
    same outline the accent is extruded from.
  - Export two STLs; load both at once in Bambu Studio as one object with two
    parts, then give each part its filament.
  - Put every height on a layer: 0.2 mm first layer + 0.12 k (2.0, 2.48, 3.2,
    3.92).
  - Check: base ∩ accent volume = 0, and union volume = base + accent (gap 0).
    The Exact union of flush inlays still reports non-manifold edges where faces
    touch, so use the volumes, not that union's topology.
  - Only colour the top layers of small parts. A whole part in the accent colour
    means a colour swap on every layer.
- **Lettering for inlays:**
  - Fragment Mono Regular and Space Grotesk (variable; Blender loads it as Light)
    are thin.
  - Thicken via a distance field (`grow_text`), not `offset_loop`, whose slivers
    fake low stroke widths.
  - Fragment Mono needs a cap of about 3.5 mm with +0.14 mm per side for p5 ≥ 0.6 mm.
  - Two short lines fit better than one long line.
- **QR on a card:** a URL of about 20 bytes needs version 2 (25 × 25) at level M.
  With about 1 mm modules and the light border that's a 28 mm square, which the
  owner found too dominant. Offer a separate QR "coin" charm instead.
  - Make the grid with CoreImage (`CIQRCodeGenerator`, `swift`).
  - Decode a flat-light top render with `CIDetector`.
  - Use dark modules on a light inlay.

## Printed lace and mandalas (from `lace-doily`)
- **Lace has no background net.** Every motif must touch its neighbours (the
  "brides" of guipure lace), so the print is one piece. Check it: count the
  positive-area outer loops of the traced outline (must be 1). Holes are the
  negative loops.
- **Draw from strokes, not folds:**
  - Build one motif, then repeat it with `rep(strokes, k, phase, mirror)`.
  - Splat the centre-line samples (0.08 mm apart) into the field with
    `np.maximum.at`.
  - Explicit copies avoid the clipping a polar-fold field gives at wedge
    edges, and the symmetry is exact (rotation check: 0 % mismatch).
  - About 6 s per 200 mm design on a 0.05 mm grid.
- **Ring orders:** keep them multiples of one base (6/12/18/24, or 8/16, or
  10/20). One odd ring (an 8-petal centre in a 6-fold design) drops the whole
  doily to 2-fold.
- **Hatching inside shapes** (pineapple rows, leaf veins) needs about 3 mm
  pitch with 0.9 mm lines. Leaf veins at 2.8 mm, or leaves under about 4.5 mm
  half-width, clog solid.
- **Crochet pineapple:** a narrow base, widest about a third of the way up,
  pointed tip (cubic Bézier sides). Arc-through-3-points sides read as a lens.
- **Long free petals at the edge snag.** Tie them with a rim (arches dipping
  between the tips).
- **Thickness:** 2 layers (0.4 mm) is the flat-lace sweet spot. 1 layer
  (0.2 mm) works but is fragile. Elephant foot compensation 0 for these, or the
  only layer gets thinned.
- **Test piece for a big flat lace: a true-size slice, not a shrunk medallion.**
  - A 40° slice from the centre to a leaf tip has every detail at real scale.
  - Cut inner rings at the slice edges and add frame lines along those edges.
  - In the outer zone, keep only whole motifs whose centroid lies inside the
    slice. Otherwise the neighbours' veins or tips survive as loose bits or
    hooks.
  - Then drop any island that isn't the largest piece.
  - Add a solid peel tab with 1 or 2 holes to tell the thicknesses apart.
- **Long free motifs (leaves) need support:**
  - At 0.2–0.4 mm, a 45 mm leaf held only at its base flaps and tears when
    peeled. The owner spotted it.
  - Make neighbours touch at their widest point: search the leaf width and tilt
    for a centre-line gap of about 0.9 mm (the lines merge). Or add short bars
    ("brides").
  - Offer both as a drawn comparison.
- **"Glued on white paper" preview:** a numpy hillshade of the coverage
  (height = coverage × t, low light from the upper left, a shifted-mask shadow
  without wrap-around). It's quick and reads well for white-on-white.

## See-through patterns in upright walls (from `macbook-server-stand`)
- **The owner wants true geometry.** Use regular hexagons on a real honeycomb lattice, so every
  bar is one even width. Tall, stretched cells were rejected (2026-11-07).
- **Run the mesh to a thin frame (about 2 mm).** Cut the edge cells off where they cross it:
  intersect the joined cell prisms with the inset outline, then subtract. Drop only the leftover
  slivers (under 40 % of a cell, or narrower than 2 mm). Keeping only whole cells inside a margin
  looked clunky.
- **Horizontal holes in an upright wall** print without support when their roof is:
  - flat-top hexagons: a 3 mm flat bridge;
  - upright hexagons: a 30° roof about 2.5 mm across;
  - teardrops: a 45° peak.
  Report the widest roof span. The 45° check flags these bridges, but they are fine at this size.
- Bars of 1.2 mm (3 lines) work. Offer a gradient (big cells at the top, small at the bottom), so
  the bars thicken where the load is.
- **Slicing a mesh:** use `seam_position="back"` (seams off the hole corners, where hex holes
  print worst) and `wall_generator="arachne"` (thin bars as even lines, no gap fill).
  - Offer a **sample slice** of the part's busiest end (about 20 mm, under an hour) before the
    full print.
- **A test piece cut through a lattice needs a solid base.** Cut straight through the struts,
  it stands on dozens of tiny strut ends (about 125 mm² on a 65 mm ring). The moss pole fit
  ring's first layer didn't stick (2026-11-10). Union a solid ring about 1.6 mm tall under the
  cut, starting 0.5 mm below it so the cut stays clean. Check the area on the bed from the STL:
  faces with every vertex at z = 0.

## Lattice tubes drawn from lines (from `moss-pole`, 2026-11-11)
- **Pointed arches reach further than round ones.** Making arches pointed (so no flat ceilings)
  made them about 1.5× as tall. Any "hidden behind the row in front" test must use the real
  pointed height, and check the row two in front too. Otherwise:
  - a tip lies 0.3 mm under a line of the fan two rows up: two struts merge, then split into a
    sliver gap with a hanging tail;
  - lines get cut off at the old height instead of on another line, leaving ends hanging 1–4 mm
    from any support.

  Both printed as wisps and curly strands on PETG (fit test v3), though the 45° overhang check
  showed only 0.3 mm² specks.
- **Check the line drawing, not just the mesh:**
  - every line end should land within half a strut width of another line's centre;
  - no two lines should run within 10° of parallel and closer than a strut width + 0.6 mm for
    3 mm or more (`doubled_struts` in `moss-pole/build_moss_pole.py`). Lines leaving a shared
    corner at 15° or more are fine.
- **Find what printed in the air from the slice itself:** the gcode marks `; FEATURE: Overhang
  wall` and `Bridge`. Group those moves by height and angle around the part's centre (map back
  through the item transform in `3D/3dmodel.model`), and compare with the owner's photos.
- **Crisp beats smooth for lattices.** Round struts merged through a distance grid with a fillet
  at every join print as bulging nodes and lumpy curves (moss pole round 10). The crisp recipe,
  like the MakerWorld lattice bowls and lamps:
  - near-square flat ribbons of one width (1.6 mm = 4 lines; thin lines 1.2 mm);
  - no fillet step in the merge, just the union and a light smoothing;
  - line ends that stop inside the line they land on (0.4 × the width past the centre line). An
    overlap of 0.8 × the width pokes out the far side as a bump.
- **A flat band over a lattice needs only 45° fill.** Filling every column down to the first strut
  makes deep solid teeth. Instead, go row by row from the band down: air in a row may only be the
  row below's air grown by one pixel each side, so every opening closes in a pointed roof. A cell
  run with no air above starts a 2-pixel opening at its middle, and the rest is fill
  (`band_fill_45` in `moss-pole/build_moss_pole.py`; 1.4 g instead of about 5 g). Never add a
  downward-pointing tooth: its tip starts printing in mid-air.
- **Twist-locks need a clamp, but a small one.** Pins in an L-slot with clearance turn freely and
  never feel tight. Make the slot's turning leg climb a ramp so the pin pulls the two faces
  together, then drop into a shallow pocket for the last 1.5° so it clicks and holds.
  - The print adds squeeze of its own, about 0.1 to 0.2 mm: a pin's 45° underside droops a little
    in PETG and the slot floor prints in layer steps. So a ramp drawn at exactly 0 mm already binds.
    On the moss pole, +0.25 mm snapped pins, +0.05 mm was still tight, and the one that felt right
    was drawn as a gap: peak -0.10, rest -0.20 mm, a 0.10 mm click drop. Test in 0.1 mm steps from
    about -0.1 to -0.3 mm, not in finer steps than the print can show.
  - The click wears in over the first few twists. Pick from the worn-in feel, and if the best one
    goes slightly soft, make it a touch firmer (about 0.05 mm) with a deeper drop (0.12 mm).
    Print a fresh mating part for each test: worn pins make every socket feel looser.
  - Print joint-only rings (bands, spigot, socket; no lattice), several settings on one plate,
    told apart by notches. Shards of pattern on a joint test waste plastic and time. When the
    setting lives in one part (the socket's ramp), print one mating part and several of the other.
    Try the gentlest first, so a tight one can't wear the shared part.
  - With 45° pin and slot faces, allow for the radial offset between where each face starts when
    setting the heights.
- **Thin first layers need a forced brim.** A socket printed mouth-down stands on a thin ring
  (about 2 mm, broken by slot entries and the lead-in chamfer). "Auto" brim added none, and the
  rings came loose twice (moss pole joint test). Set an inner and outer brim (5 mm, 0.15 mm gap so
  it peels off), slow the first layer to 30 mm/s, and never cut label notches through the first
  layer: start them 0.4 mm up. Check the bed contact area from the STL (faces at z = 0) for every
  ring-shaped part.
- **PETG lattices string on travel across the openings.** Slice with Avoid crossing wall on
  (`reduce_crossing_wall`, Quality › Advanced) and the overhang fan at about 80 %
  (`overhang_fan_speed`, a filament setting: list it in `different_settings_to_system[1]`).

## Device stands and slots (from `macbook-server-stand`, 2026-11-07)
- **Research the bought ones first and name them in the options:** BookArc, BookArc Flex,
  mTower, Grovemade. The owner picks faster from "like X, but…" than from abstract shapes.
  Show 3–5 concepts, then 3–5 variations of the pick. Each round changes one idea.
- **Slot shape:**
  - 1.5 mm rounded lead-in on the jaw tops, and a 1.5 mm rounding at the slot floor, so a
    rounded device edge seats fully;
  - a solid band about 3 mm above the slot floor before any pattern holes, so the device
    rests on solid plastic;
  - a "saddle" grip (26 mm deep in the middle, 38 mm at the ends) looks lighter than a flat
    top and holds better at the ends.
- **Stability checks to report:**
  - tip angle = atan(half the base width / device centre-of-mass height); about 20° was fine;
  - push at the top edge to tip it = weight × half base / total height (3.7 N here);
  - lean from slot play = atan(play / grip depth), and top sway = height × play / grip.
    2 mm of play gave about 4° (17 mm sway at the top), which the owner noticed at once.
    About 0.3 mm gives under 0.5°.
- **Place the stand in the middle of the device's edge,** away from the rubber feet at the
  corners. A 120 mm stand on a 325 mm laptop never touches the feet.
- **Fit tests for a slot:**
  - walls as stiff as the real part's (4 mm), so a bending wall doesn't fake a snug fit;
  - walls tall enough to reach the flat sides (≥ 30 mm), not just the rounded edge;
  - the same lead-in and floor rounding as the real part;
  - 3–4 widths, 0.4 mm apart, numbered by holes in the floor (1 hole = narrowest);
  - the winner is the narrowest that slides fully on without force and doesn't wobble;
  - use the winning width as is. The printed test already includes the printer's tolerance.
- **Strength for a resting load:** 4 walls, 15 % gyroid and 0.2 mm layers in PETG are far
  beyond what a 2 kg laptop resting in a slot needs. With 1.2 mm bars and 4 mm walls the part is
  nearly all wall lines, so more infill adds time, not strength. Five walls is the only
  worthwhile extra.
- **PETG on the textured PEI plate:** no glue stick. Let it cool fully on the plate before taking
  the part off; it releases by itself and can bend while warm.

## Hinged boxes around a bought product (from `airpods-pelican-case`, 2026-11-07)
- **A two-piece skin cover can't close over a hinge whose axis sits just inside the product's
  skin.** The AirPods Pro 3 axis is 0.85 mm inside the back. The lid's back edge rolls into the
  base, and its upper back swings down behind it, so both cover pieces need a cut-out strip there
  (Apple's drawing marks it as keep-out). To fully enclose it, build a box with its own hinge
  ("box-in-a-box").
- **Box seam below the product's lid line** (the AirPods: 28 vs 32.45 mm), so the product's lid can
  open fully with the box open. Check it: sweep the product lid through its range against the base
  and against the open box lid.
- **A low hinge axis behind the back drags the lid's front wall inward** as it starts to open
  (about 2 mm here). Sweep-trim the lid against the product, and move the front wall out to keep
  its thickness (`front_extra`).
- **Hinge:** alternate knuckles about the axis, 0.4 mm radial and axial clearance. The pin is
  1.75 mm filament: holes 1.8 mm (tight) in one part and 2.2 mm (free) in the other. Make the hole
  blind at one end. The lid stops on its own when its back hits the base (196° here); find it by
  sampling the base field at rotated lid vertices.
- **Snap latch strap** on the base, hooking over a ledge cut into the lid's lip:
  - 0.1 mm clear when shut, so it isn't bent while closed and won't creep;
  - 45° ramp on top, so closing snaps it;
  - flat underside: the one allowed ~1 mm overhang;
  - keep decorative grooves away from the strap's root.
- **Tongue and groove at the seam:** a 0.8 mm tongue in a groove with 0.4 mm clearance per side.
  It isn't waterproof without an O-ring or gasket; say so.
- **Crush ribs for press fits:**
  - the holder clears the product by 0.35 mm;
  - thin upright ribs (r 0.6) reach the surface (tip 0);
  - 45° lead-in at the top.

  Ship ring tests with tips +0.1 / 0 / −0.1 (1–3 notches), plus a pin gauge bar (teardrop holes
  1.7 / 1.8 / 1.9 / 2.2).
- **Distance-field pitfalls hit here:**
  - `support_free` fills any **closed horizontal hole** completely: its roof has no seed opening.
    Cut pin holes after the fill, as teardrops pointing to the print's top. Holes open on both
    faces of a thin plate get lumps inside instead.
  - An OpenVDB level set reads **0 outside its narrow band** (`copyToArray`). That means "on the
    surface", and it trimmed a loop tip 10 mm from the case. Make the band cover the whole grid.
  - Features added before the rim cut get cut with it; parts standing above the rim (latch
    arms) go on after it.
  - A sign slip in a "no lip along the hinge" mask removed the lip everywhere *else*. Look at
    cross-sections (`section_png`) through each feature before trusting renders.
- **Print orientation:** flip the lid about the long axis (Y rotation), not about X, so both parts
  face the same way and `seam_position=back` puts the seams on the hinge side.

## Measuring from the owner's phone photos (from `sink-plug`, 2026-11-08)
- **HEIC:** convert with `sips -s format jpeg`. The Read tool honours the EXIF rotation, but
  `sips` crops work on the raw (sideways) pixels. Load the pixels with Blender's own Python
  (`bpy.data.images.load` → numpy; it has numpy, plain `python3` doesn't) and rotate yourself.
- **Round parts (drains, lids):** find the centre by maximising the sharpness of the
  angle-averaged radial brightness profile. Read ring radii off its edges, then scale with the
  ruler's tick spacing in the same plane. Measure ratios on a second, straight-down photo:
  the sink's rim/flange ratio agreed to 0.2 %.
- **Design for the uncertainty:** a 15° cone seats on any rim in a ±2.5 mm range.
  Report a table of where it touches for each rim size, rather than asking for a fit test.
- **Grooves on a grip:** run them right round the part as closed rings. Grooves that stop short
  look unfinished (owner, 2026-11-08). Build them as a loft of rounded-rectangle slices inset by
  a V profile. Inset along the normal: keep the corner centres and shrink the corner radius.
  Moving the corners in by g in x and y cuts them √2 deeper, which gave 50° flanks.
- **Plugs and stoppers:** use PETG, not PLA, for anything that meets hot washing-up water
  (50–60 °C). Use fine layers (0.12) and a scarf seam (`seam_slope_type="external"`, Quality ›
  Seam › Scarf joint seam: Contour) so the seam doesn't bump across the sealing ring.
  Be honest that rigid-on-steel may trickle: the upgrades are an O-ring groove or TPU.

## Concrete casting molds (from `concrete-planter-mold`, 2026-11-08)
- **Cast upside down.** The rim forms against a slanted plug on the table, and the base is the
  open, trowelled pour face.
- **The P2S height (~250 mm) limits the parts:**
  - split the shell into rings at a natural fold, so the joint hides on the crease;
  - split each ring into 4 upright pieces, because halves of a 288 mm planter don't fit the
    bed.
- **Soil hole at an even wall:** move each ring point inward by wall/cos(slope). That gave
  9.8 L of soil vs 5 L for a plain drafted cone, and 9.9 kg vs 17 kg of concrete.
  - It needs a **collapsible core**: 2 tiers × (2 keys + 2 wings) with off-centre cuts when the
    top leans.
  - Check release with a 2D search: allowed slide directions come from the touching faces'
    normals. Keys first slide 20 mm clear of the seam plates. Then each piece must fit the rim
    opening (3 mm margin).
  - Report the moves (they were 17–55 mm here).
  - A flat floor disc may need tipping on its edge to come out.
- **Core tier joint below the hole's lowest crease point.** A ledge reaching the crease made the
  closed-profile loft fold over itself.
- **Hydrostatic numbers:**
  - about 7 kPa at 320 mm of depth;
  - shell in tension, so 2.4 mm walls are fine;
  - the thin core wall is in compression, so check buckling (3EI/r³) and add hoop ribs;
  - buoyancy only acts on wetted faces. A core open onto the plug gets about 50 N of lift, not
    its full displacement, so a bridge bar with the drain pin holds it.
- **Flanges for wing nuts:**
  - put bolts ≥ 14 mm from the wall;
  - corbel the fold flange to ≤ 45° along the leaning wall: s = 1.2 · width / (cos α − sin α);
  - cut a flat Ø13 seat for the nut through the corbel.
- **Give the filament and print time before building anything big.** The first P5 mold (19
  parts) needed kilos of PETG, and the owner called it "way too big" for a first test
  (2026-11-09). Budget per test: about 500 g.
- **Check loads per piece, not just stress in a wall** (`check_loads.py` in that project).
  - Give every concrete face to the piece it touches, and sum ρ·g·depth·area·normal.
  - The total must equal minus the concrete's weight, which is the sanity check.
  - It shows the seam-opening force (about 100 N per shell half at 230 mm), the lift on the core
    and whether shells are pushed down or lifted.
- **The pressure is rarely what fails.** In a thin mold the weak spots are:
  - flanges springing open between bolts, because the gap grows with span⁴. Keep bolts about
    50 mm apart and flanges at least 3 mm;
  - walls thinner than about 1.2 mm cracking when you pry the mold open.

  Size for handling and reuse, then check the pressure.
- **A maker's mark on a cast:** the owner wants pour and leave, so put it on a face a mold piece
  forms.
  - Ideal is inside under the rim, above the soil. Explain which piece forms which face before
    offering a stamp.
  - Extrude the letters along that piece's pull direction, not along the wall's normal, so
    leaning walls still release. Draft them with one smooth sloped side, not 0.2 mm terraces:
    at 1 cm the steps read as "bubbly" rings. Build one prism and move its deep-end outline
    points inward along each corner's bisector.
  - Fine strokes work at 1 cm: about 0.75 mm lines, 0.6 mm deep, ridges of 0.8 mm or more
    (`concrete-planter-mold/build_side_signature.py`).
- **Marking the open pour face** (a signature on the base): no mold wall touches it.
  - Lay a stamp on straight after levelling and **leave it until demolding**. The owner wants
    "pour, vibrate, leave", and timed pressing was confusing.
  - Don't put it on the hold-down bridge: that goes on before the pour, so concrete can't be
    levelled under a wide pad and traps air.
  - Explain which surface each piece forms (plug → rim, floor disc → inside floor, open top →
    base). A cast-upside-down mold isn't obvious to a non-modeller.
  - Use a stiff plate that rests on the mold's rim on small feet. That fixes the depth (1.5 mm),
    and an edge against the bridge bar fixes the position. Keep the plate 1 mm clear of the
    concrete so only the letters touch.
  - Letters for concrete need lines of 2.5 mm or more and ridges of about 2 mm or more. Draft
    the letter sides 15°.
  - Mirror the artwork, then check it by rendering the base from below.
  - Reuse `wax-seal-stamp/build_seal.py`'s `seal_logo` (smoothing, thickening, gap closing) at
    the new size: see `concrete-planter-mold/build_signature_stamp.py`.
- **Gram estimates for thicker walls run low.** 0.9 → 1.3 mm plus 3 mm flanges was guessed at
  +75 g and sliced at +95 g, so re-slice before quoting.
  - The light v1 at 230 × 210 came to **437 g, 12 h 42 min, 3 plates**:
    - one ring of 2 shell halves, so no fold flange;
    - 0.9 mm shell (it's in tension);
    - 1.0 mm core with 45° hoop ribs (it's squeezed);
    - a hollow plug ring;
    - 16 bolts.
  - `grams_if_solid` ≈ the sliced grams for thin-walled parts. The plug and bridge come out lower
    (infill).
- **Locating ribs must follow the lift direction:** upright half-trapezoids, not ones tilted
  with a slanted face. Tilted ones crossed the cut plane and were sliced off their own piece.
