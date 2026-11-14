---
name: 3d-print-design
description: Design rules and verification for FDM-printed parts (written around Bambu Lab printers, PLA and PETG, 0.4 mm nozzle). Covers watertight geometry, print-in-place clearances, overhangs, minimum feature sizes, the checks to run before calling a model done, headless slicing with Bambu Studio, and how to package a handoff for someone else who prints. Use when modelling anything to be 3D printed or preparing files for printing.
---

# 3D-print design and verification

**Printer context:**
- The owner's printer, filaments and anyone else who prints for them are in the workspace's
  CLAUDE.md (its *Printing* section). Read it first; this skill never assumes them.
- The examples below come from a Bambu Lab P2S (256³ mm, 0.4 mm hardened nozzle, textured PEI
  plate, enclosed) with PLA and PETG. Swap in the owner's own printer and presets.
- **Material choice:**
  - PLA for stiff, detailed parts and print-in-place hinges. PETG strings and
    can fuse a 0.3 mm gap.
  - PETG where heat matters: wax seals, anything left in a car.
- For the owner's own prints, write a numbered Bambu Studio walkthrough in the
  project README (see `signature-embosser/README.md`). They have no 3D
  experience.
  - Give every setting as **tab › section › setting** (for example Quality ›
    Precision › Elephant foot compensation). Add "switch on Advanced, keep
    Global" and the Cmd+F search tip. The owner finds bare setting names hard
    to locate (2026-11-06). See `lace-doily/README.md` for the table format.
- A1, P1 and X1 beds are 256 mm. The **A1 mini is 180 mm**.
- Confirm the bed size for anything over 180 mm.
- **Bambu Studio 2.09 is installed** (`/Applications/BambuStudio.app`, seen 2026-11-06), and its
  command line slices headless into a ready-to-print `.3mf` the owner just opens and sends.
  See `projects/macbook-server-stand/prep_print.py`.
  - The CLI needs **complete** presets: merge the `inherits` chain from
    `~/Library/Application Support/BambuStudio/system/BBL/{machine,process,filament}/`, apply
    the overrides, and pass them with `--load-settings "machine;process"` and
    `--load-filaments`. Add `--slice 0 --arrange 1 --orient 0 --curr-bed-type "Textured PEI Plate"
    --export-3mf out.3mf model.stl`.
  - `--filament-colour "#000000"` sets the preview colour; it works though `--help` doesn't
    list it.
  - Check `Metadata/slice_info.config` in the output: `prediction` (seconds), `weight`,
    `support_used`, `outside`.
  - **List your changed process keys in the 3MF.** The CLI leaves
    `different_settings_to_system` in `Metadata/project_settings.config` empty. The app then
    opens the file as the plain system preset: the owner saw 2 walls instead of 4. Fill its
    first entry with the changed keys joined by `;` (`mark_modified` in
    `macbook-server-stand/prep_print.py`).
  - **`--arrange 1` may turn the part** (the sink plug came out turned 143°), which moves the
    `seam_position` seam. When the orientation matters, slice with `--arrange 0` and a copy of
    the STL shifted to the plate centre (128, 128) (`centred_copy` in `sink-plug/prep_print.py`).
    Check the item transform in `3D/3dmodel.model` and the seam in `Metadata/plate_1.gcode`.
  - Never send or start a print yourself. The owner clicks Print plate after checking the
    plate is clear and the right spool is loaded.

### Checklist before handing the owner a sliced file (every time)
Things that went wrong on 2026-11-07 (`macbook-server-stand`), and what stops each one:
1. **Exact filament preset.** Use the owner's spool by brand, type *and* finish, as listed under
   the workspace CLAUDE.md, in owner memory, or in the project README. Bambu PETG **Matte** isn't PETG
   Basic: the first slice used Basic and the owner had to correct it. If unsure, ask before
   slicing. Set the colour with `--filament-colour` (the owner's spool colour).
2. **Printer, process, plate:** the owner's machine preset (for a P2S: `Bambu Lab P2S 0.4 nozzle`), the
   standard process (`0.20mm Standard @BBL P2S`) unless the part needs finer layers, and their plate
   (`Textured PEI Plate`).
3. **Overrides marked as changed** (`mark_modified`, above). Count a key the preset doesn't
   name at all (`brim_type` is one) as changed too, or the app shows its own default.
4. **Read the 3MF back before saying it's ready.** Unzip `Metadata/project_settings.config` and
   check:
   - `printer_settings_id`, `print_settings_id` and `filament_settings_id`;
   - every override's value;
   - that `different_settings_to_system[0]` lists every override that differs from the preset.

   Then check `slice_info.config`: time, grams, `support_used=false`, `outside=false`.
5. **The file matches the current design.** If a size changed (a slot width after a fit test),
   rebuild the STL *and* re-slice. Until then, mark the old 3MF as "don't print" in the README
   and in chat.
6. **Give the owner a settings table to check in the app** before Print plate:
   - each override as tab › section › setting, with the value;
   - plus "Advanced on, Global".

   Bambu Studio 2.09 locations:
   - walls: Strength › Walls › Wall loops;
   - infill: Strength › Sparse infill › Sparse infill density / pattern;
   - seam: Quality › Seam › Seam position;
   - Arachne: **Quality › Wall generator** › Wall generator (not under Strength);
   - supports: Support › Support › Enable support;
   - brim: Others › Bed adhesion › Brim type.
7. **Tell the owner not to re-pick the process preset** in the dropdown. Re-selecting the
   preset can drop the file's changes back to the preset's values. If they did, they fix the
   table's values by hand, then Slice plate.
8. If they change anything, **Slice plate** again before **Print plate**. Give the expected time
   and grams so they can spot a mismatch.

## Geometry rules
- **Watertight by construction.** Build closed prisms or lofts with matched
  rings rather than repairing meshes afterwards.
- **Booleans:**
  - Exact solver, `use_self=True`, collection operand for many-part unions.
  - Cutters overshoot surfaces by ≥ 0.05 mm. Nothing coplanar except where
    Exact handles it.
- **Cleanup:** merge by distance at 0.002 mm, dissolve degenerate faces,
  delete loose edges and verts, recalculate normals.
- **Light files:** control the density at the curve or sampling stage, not
  with Decimate. Flat faces stay as n-gons or simple quads. A whole part is
  usually 5–20k triangles and an STL under 1 MB. Rounded or terraced details
  can reasonably double that.
- **Print-in-place:** keep the moving parts as **separate shells** and join
  them into one object *without* a boolean. One STL, several shells.

## FDM numbers that worked
| Thing | Value |
|---|---|
| Min raised feature or stroke width | ≥ 0.8 mm (2 lines). Under 0.45 mm disappears |
| Hinge radial clearance (Bambu, PLA) | 0.3 mm default. Offer a 0.25 / 0.30 / 0.35 test strip |
| Axial gap between knuckles | 0.4 mm |
| Plate edge to the *other* part's knuckle | 0.4 mm |
| Self-supporting knuckle | Square bottom on the bed, round top. Radius = axis height |
| Horizontal bore | Teardrop, with a 45° pointed roof |
| Horizontal pin | Flat underside, so it prints as a short bridge |
| Overhangs | Fine up to 45° from vertical. Report anything steeper that isn't a short bridge |
| Plate edges that press on paper or skin | Chamfer about 0.8 mm |
| Embossing die edges | Rounded: male top edge 0.4 mm, female rim 0.5 mm (default) |
| Layer height for fine detail | 0.12 mm. Walls 4 (Arachne), 40 % gyroid, ironing on top faces |

## Lessons by kind of part

Before modelling, read the matching section in `references/lessons.md`. New lessons go there, under the kind of part they belong to.

- Embossing presses (from `signature-embosser`)
- Pattern plates without a hinge (from `pattern-emboss-plates`)
- Wax seal stamps (from `wax-seal-stamp`)
- Organic / bubbly shapes and covers (from `airpods-bubble-case`)
- Kit cards, flex gates and two colours (from `signature-carabiner-kit`)
- Printed lace and mandalas (from `lace-doily`)
- See-through patterns in upright walls (from `macbook-server-stand`)
- Lattice tubes drawn from lines (from `moss-pole`, 2026-11-11)
- Device stands and slots (from `macbook-server-stand`, 2026-11-07)
- Hinged boxes around a bought product (from `airpods-pelican-case`, 2026-11-07)
- Measuring from the owner's phone photos (from `sink-plug`, 2026-11-08)
- Concrete casting molds (from `concrete-planter-mold`, 2026-11-08)

## Verification checklist (run every time, report the numbers)
1. **Topology:** non-manifold edges = 0 per part and joined. The shell count
   is what you expect.
2. **Motion parts:**
   - Min gap between parts as printed ≥ the design clearance (BVH nearest
     distance).
   - Interference volume = 0 at swept angles (0–180° in 30° steps), using a
     boolean INTERSECT of the moved copy.
3. **Function:** the key clearances in the working position, such as the die
   gap when closed.
4. **Printability:**
   - Stroke widths by inward ray-cast along the outline (p5, median, % under
     0.8 mm).
   - Downward faces steeper than 45° above z = 0.05, grouped by height.
5. **Placement:** margins from features to edges, and the reach.
6. **Export:** read the binary STL back. Check the bbox in mm, the triangle
   count, the file size, and that it fits the bed.
7. **Look at it:** preview renders plus, when it helps, a simulation render
   of the result. Look before sending.

**What can't be simulated:** that printer's actual tolerance, and real paper
or material behaviour. Say so plainly.

## Handoff to the printer
- Build a zip with:
  - the STL(s);
  - `PRINT_ME.txt` (plain settings: orientation, no supports, layer height,
    bed-size requirement, what to do if a hinge fuses);
  - an optional test strip;
  - a preview PNG;
  - `CLAUDE_DESIGN_NOTES.md` (intent, coordinate system, parameters, how
    it's built and why, the verification numbers, improvement ideas, the
    invariants);
  - `source/` (script plus inputs).
- **Prove it's self-contained:** unzip into a temp dir, regenerate from
  `source/`, and `cmp` the STL with the shipped one. See
  `projects/signature-embosser/package.sh`.
- **Keep the zip and the notes in sync** with every design change. Stale
  numbers in the notes mislead the friend's Claude.
