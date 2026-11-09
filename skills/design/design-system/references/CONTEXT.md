# Design system context

Paste this block into any session that generates UI for the project, so every
output lands on the same names. Fill in the component list as it grows.

```
## Design system context

Variables, by what they are for (see NAMING.md):
- Layers:     --background (page) · --card (contained) · --foreground (text, icons, strokes)
- Hierarchy:  bare name is primary; -secondary, -tertiary are quieter
- States:     -hover, -pressed on anything that acts; --focus is a ring
- Inactive:   --inactive (fill/stroke) · --inactive-foreground (text/icon), for anything switched off
- Brand:      --brand (solid) · --brand-secondary (tinted) · --brand-tertiary (text-only), each with states and -foreground
- Status:     --success --warning --danger --info, each with states and -foreground
- Rhythm:     --space-1…8 · --radius-sm --radius --radius-lg --radius-full
- Type:       --text-sm/base/lg/xl/2xl · --font-sans --font-mono
- Elevation:  --shadow-card --shadow-overlay — a raised surface is a card with a shadow

Tailwind classes follow the names: bg-card hover:bg-card-hover, text-foreground-secondary,
border-stroke, bg-brand text-brand-foreground, disabled:bg-inactive, focus-visible:ring-focus.

Existing components (do not recreate):
- Button: level (primary/secondary/tertiary → --brand, --brand-secondary, --brand-tertiary), size (sm/md/lg), intent (default/danger)
- Input:  size (sm/md/lg), state (default/invalid/inactive)
- Badge:  intent (default/success/warning/danger/info)

Rules:
- No raw hex or px in components — variables only, through the classes above
- Every colour a thing acts with has hover and pressed; anything switched off uses the inactive set
- Dark mode is the same names under :root.dark or :root[data-theme="dark"]; never a second set of classes
- Text goes on background or card; check contrast for both
```
