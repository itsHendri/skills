---
name: blender-workflow
description: How to drive Blender for projects in this workspace. Covers the live MCP connection vs headless runs, mm units, running a project's build script, scene hygiene, preview renders, and the pitfalls already hit. Use whenever a task touches Blender, a .blend file, bpy code or the Blender MCP.
---

# Blender workflow

Blender 5.2.2 is at `/Applications/Blender.app`.
`BLENDER=/Applications/Blender.app/Contents/MacOS/Blender`

## Two ways to run Blender

### Live (the owner watches in their Blender window)
Uses the Blender MCP (`mcp__Blender__execute_blender_code`, screenshots, and so on).

**It needs the Blender Lab MCP add-on running inside Blender.** If you get
"Cannot connect to Blender at localhost:9876":
- Check whether Blender is running at all (`pgrep -lf Blender.app`).
- If it is running, check the add-on is installed.
  - Setup: Edit › Preferences › Get Extensions › Repositories ›
    `+ Add Remote Repository` › `https://lab.blender.org/`. Then install and
    enable **MCP**.
  - Then start its server (N-panel in the 3D view, or the add-on's
    preferences). The Claude-side server is the Blender extension in the
    Claude app; it defaults to port 9876 (`BLENDER_MCP_PORT`).
- If it isn't connected, build headless instead and tell the owner. Never
  block on it.

Run a project's build script in the live session:
```python
path = "/absolute/path/to/projects/<name>/build_x.py"
ns = {"__name__": "lib", "__file__": path}
exec(open(path).read(), ns)
rep = ns["main"](save=True)
```
- Frame the result for the owner with `view3d.view_selected` under
  `bpy.context.temp_override(window, area, region)`. Then take a window
  screenshot to confirm what they see.
- Check `bpy.data.filepath` and `bpy.data.is_dirty` before saving, or before
  opening another file.

### Headless (fast, no window)
```bash
$BLENDER --background --factory-startup --python build_x.py              # build
$BLENDER --background project.blend --python render_preview.py           # renders from a saved scene
```
- **Never save headless over a `.blend` the owner has open live.** Use
  `main(save=False)` for dry runs.
  - Before any headless build that saves, check `pgrep -lf Blender.app`. If
    Blender is running, read `bpy.data.filepath` over the MCP.
  - If it's the same file, build live instead. Otherwise the owner keeps
    looking at the stale copy, and saving it would overwrite the new build.
  - To reload a file in the live session from disk, register the
    reload on a timer:
    `bpy.app.timers.register(lambda: bpy.ops.wm.revert_mainfile() and None, first_interval=0.2)`.
    The MCP call returns before the reload happens, so the connection survives.
- Pipe output through `grep` for your own markers. Blender prints a lot of
  noise.
- For anything longer than about 2 min, run it in the background and use a
  monitor that greps for success *and* failure lines.

## Scene conventions
- **Units:** `unit_settings.system='METRIC'`, `scale_length=0.001`,
  `length_unit='MILLIMETERS'`. 1 BU = 1 mm.
  - The viewport needs `clip_start=0.1` and `clip_end=10000` at this scale.
- **Factory startup objects:** a `--factory-startup` run leaves `Cube`,
  `Camera` and `Light` (a 2 mm cube at mm scale). Remove them in
  `setup_scene()`.
- **Collections:**
  - one per output (e.g. `Press`);
  - helper/preview collections hidden in the viewport and the render;
  - `wipe_collection(name)` before rebuilding, so reruns are idempotent;
  - reruns must not leave `.001` duplicates. For example, delete the previous
    SVG import collection and curve before re-importing.
- **Exports:** select only the target object.
  - Unhide it first: a hidden object, or one in a hidden collection, can't be
    selected and the export comes out empty.
  - `bpy.ops.wm.stl_export(filepath, export_selected_objects=True, ascii_format=False, global_scale=1.0, use_scene_unit=False, apply_modifiers=True)`
  - Then confirm the bounding box in mm by reading the binary STL back.
- **Normals after booleans:** don't run `bmesh.ops.recalc_face_normals` on
  Exact boolean output. It's already oriented, and recalculating flipped part
  of a nested recess inside-out. Recalculate only on primitives you built
  yourself.
- **Triangulate before a big Exact union.** A part whose face has many holes
  (debossed lettering) gave non-manifold slivers when unioned into a larger
  piece, even though the part itself was clean. `bmesh.ops.triangulate` on
  the operand copies fixed it (`w123-kit-card`).
- **Text:** load a font with `bpy.data.fonts.load`, then call
  `ob.evaluated_get(dg).to_curve(dg)` for Bézier outlines. Sample them like
  SVG paths and feed them to `region_solid`. Variable fonts load their
  default instance (Satoshi Variable = Bold).
- **Holed n-gons after an Exact boolean.** A plate face with many recesses
  comes back as one big n-gon (630 verts) with the holes bridged in. The STL
  export triangulates it correctly. But `BVHTree.FromBMesh` on a *flipped*
  copy re-filled it over the holes. For checks, build the BVH from
  `me.calc_loop_triangles()` + `BVHTree.FromPolygons`, the same triangles the
  STL gets. Slicing those faces with `bisect_plane` also dropped edges, so
  draw side profiles from straight ray casts instead.
- **Inside/outside tests:** the nearest-point normal (`find_nearest`) gives
  the wrong side at sharp concave edges. Use a straight ray cast instead (for
  example down: hit a face whose normal points down = inside).
- **`bmesh.ops.bisect_plane`** has no `use_fill` in 5.2. Use `geom_cut` from
  its result for cross-section outlines.
- **SVG → PNG on macOS:** `qlmanage -t -s <px>` renders roughly square
  thumbnails and crops wide SVGs. Stack panels vertically.
- **Booleans:** apply them by building an evaluated copy:
  `bpy.data.meshes.new_from_object(obj.evaluated_get(depsgraph))`. Then swap
  the mesh and clear the modifiers. This avoids operator context problems in
  headless mode.
  - Many small cutters in one Exact collection boolean on a lofted mesh can
    fail silently. The result keeps cutter geometry, loses volume and has
    non-manifold edges. Each cutter worked on its own.
  - Apply them one at a time, and check volume and non-manifold edges
    afterwards.
- **Showing motion to the owner:**
  - Parent the moving parts to an empty on the real axis and keyframe it.
  - In the live session, start playback with `bpy.ops.screen.animation_play()`
    under `temp_override(window=...)`.
  - For a shareable video, render with Workbench: set
    `image_settings.media_type = "VIDEO"`, then `file_format = "FFMPEG"`,
    MPEG4/H264. That's about 4 s for 120 frames.
  - Check the video by pulling frames with a small `swift` script
    (AVAssetImageGenerator). `qlmanage` gives no thumbnail for MP4.

## Exact booleans: traps
- **A box INTERSECT can leave a sliver.** Splitting a clean, closed solid along a plane can
  leave stray geometry 1.2 mm past the cut, with open edges.
  - It happened on the planter core at x = −51.0 and −51.2, and followed the cut when nudged.
  - Fix: try a few cut positions (e.g. ±0.6 mm) in a short loop and keep the one where every
    piece has 0 open edges and its expected width.
- **Small relief on a curved wall: bend it, don't cut it.** Intersecting a 10 mm lettering prism
  with a 240-segment wall band left open edges, which spread into the part.
  - Instead build each prism flat, then move every vertex so w = 0 lands on the wall:
    x = wall_x(y, z) + w, interpolated from the wall rings.
  - Then just union the terraces. Give each terrace a slightly different end so no faces are
    shared.
- **Don't trust a sampled inside test near touching faces.** Parity rays or nearest-normal
  checks can flag parts that only touch.
  - Confirm with an Exact INTERSECT and its volume ÷ (area / 2), the average thickness.
  - 0.01 mm means the faces touch; a real clash is tenths of a millimetre or more. hit on the planter mold (2026-11-08)
- **Flush faces hang or break unions.**
  - Unioning a flange collar whose 240-gon cap lay exactly on the body's end face hung for more
    than 10 minutes.
  - Two lofts sharing one ring gave non-manifold edges.
  - Fix: build steps (flanges, ledges, ribs) into **one loft**: rings at the same z with different
    offsets give flat steps. Or use `loft_closed` (a closed profile ring list, no caps). Pull
    added plates 0.3 mm back from flush faces.
- **A cut plane through outline vertices leaves open edges.** Put seams half a ring step off the
  sampled angles (45.75°, not 45°), and jitter hole centres by about 0.4 mm.
- **Don't measure overlaps with Exact INTERSECT of coincident surfaces:** it returns junk
  volumes. Sample points on each part. Inside = majority of three crossing-count rays (one ray
  grazing an edge miscounts). Report the depth via `find_nearest`, allowing 0.3 mm: shared
  ruled surfaces get triangulated differently.
- **Log each boolean's time** (`BOOL_LOG`) so a hang shows its step at once.

## Importing SVG logos
- `addon_utils.enable("io_curve_svg")`, then `bpy.ops.import_curve.svg`. It
  imports at 90 dpi into a collection named after the file.
- Bake the transform into the curve data, normalise the size, and centre it.
  Drop zero-area sliver subpaths (left over from vector editing).
- **Don't convert complex SVG curves to mesh with fill/extrude/bevel.** It
  gave thousands of non-manifold edges, and Exact booleans then took more
  than 10 min.
  - Instead: sample the Béziers to polylines, then run
    `mathutils.geometry.delaunay_2d_cdt`, then keep the triangles with
    positive winding, then extrude.
  - That gives a watertight solid by construction. See
    `projects/signature-embosser/build_press.py` → `region_solid`.
- Pixel-art outlines: smooth by joining the stair-run midpoints
  (`stair_midpoints`), then `resample` at 0.2 mm, then `taubin_smooth`
  (λ 0.5, μ −0.502, about 700 iterations). Then regrow to the original area.

## Flat parts as 2D distance fields (from `signature-carabiner-kit`)
- For flat parts, build each outline as a numpy signed distance field (0.03 mm
  grid). Then trace it with marching squares and extrude with `region_solid`.
  - Fat lines: `w/2 − distance to the centre line`.
  - Union = `max`, cut = `min`.
  - Rounded corners: shrink, trace, then take the distance + r.
  - About 1 s per part, watertight by construction. The code runs in plain
    numpy too (bpy import guarded).
- **Signature centre line:**
  - Zhang–Suen thinning of a 0.05 mm raster of the filled outline.
  - Breadth-first paths from the stroke ends.
  - Then a Taubin smooth with both ends fixed.
- **Extruding traced outlines with many holes:** let the triangulator decide
  what's inside. Call `delaunay_2d_cdt(coords, [], loops_as_faces, 2, 1e-5)`
  (output type 2 = inside with holes).
  - Don't use the centroid winding of every triangle instead. It misjudged a
    sliver once and pinched the solid: one edge with 4 faces (`lace-doily`).
  - Also nudge field values within 1e-3 of zero off the contour level before
    marching squares, so two outlines can't share a grid corner.
- **Several solids into one object without a boolean:** append each bmesh to one
  BMesh with `BMesh.from_mesh` (it adds to what's there), then `to_mesh`.
- **Camera framing:** call `bpy.context.view_layer.update()` after moving an
  object, before reading `matrix_world` for its bounds.
- **Workbench colours for dark filament:**
  - Use object colour about 0.02 (linear) for black.
  - Use **Flat** lighting with cavity for top views: Studio makes black look
    mid-grey.

## Preview renders
- Workbench, studio light, cavity on, for quick model previews. Size the
  camera framing from the object's dimensions; never hard-code it.
- EEVEE with a low sun for "what the result looks like", such as a
  height-field paper emboss in `simulate_emboss.py`.
- Send renders to the owner with `SendUserFile`. Look at them yourself first.
- **Comparison sheets always carry a label under every view** (key letter plus a short name, for
  example "H2 Upright"). Put text objects under each view, or label the panel in `sheet()`. When
  a re-render dropped the labels, the owner couldn't tell the versions apart (2026-11-07).
- **Hide the print-copy collection while rendering scenes.** Otherwise every exported copy shows
  up in every shot. Rotate the studio light in world space, so the light doesn't change as the
  camera moves.
- **Preview colour = the owner's filament colour** (white PETG: object colour about 0.9). Ask or
  check memory first, rather than defaulting to black.

## A .blend for the owner to look around in (from `macbook-server-stand`)
When the owner wants to "see it from all angles", save a separate, clean file
(`view_h2.py` → `*_view.blend`) and `open` it:
- only the chosen part, named in plain words, with no helper objects;
- Solid shading, `color_type="OBJECT"`, cavity on, a light viewport background (about 0.78),
  grid lines every 10 mm, `clip_start=0.1`, `clip_end=10000`;
- the view framed on the part in perspective, at about 60° from above and 45° around;
- nothing selected, so there's no orange outline;
- reference objects (the laptop stand-in) in their own collection:
  - hidden with `layer_collection.hide_viewport = True` and `collection.hide_render = True`, so
    the owner can switch them on with the eye icon;
  - don't *exclude* the collection: then the eye icon doesn't work;
  - tell the owner where the eye icon is (Outliner, top right).

## Building brackets and stands from three outlines (from `macbook-server-stand`)
- A stand, bracket or holder = the **intersection of three prisms**:
  - the cross-section (x, z) extruded along y;
  - the side view (y, z) extruded along x;
  - the plan (x, y) extruded along z.

  Three exact booleans give a watertight part. Each outline is a simple 2D polygon (with
  `fillet` rounding), so every size lives in `P`.
- **Many pattern holes:**
  - join all the cell prisms into **one** mesh object;
  - INTERSECT it with an inset "zone" prism (the frame);
  - DIFFERENCE it from the body once.

  90 hex cells cut cleanly in seconds. That avoids the silent failures of many separate cutters
  in a collection boolean (see *Booleans*).
- **Measure with ray casts and report the numbers:**
  - slot width at five points along the part;
  - grip depth by casting down just outside each jaw top;
  - open share of a patterned wall.
- `export_stl` gotcha: call `view_layer.update()` before selecting, and skip `None` objects,
  or `select_set` crashes on a removed helper.
