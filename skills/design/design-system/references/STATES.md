# States

The one list of component states. Every other skill links here and adds only its own angle: `motion-design` says how a state moves, `content-ux-writing` what it says, `ui-audit` checks that it exists, `ux-flows` owns the flow-level paths (offline, timeout, permission denied, partial success).

## The nine

| State | When | Uses |
|---|---|---|
| default | at rest | the bare variable (`--card`, `--brand`) |
| hover | pointer over something that acts | the variable's `-hover` |
| pressed | pointer or key held down | the variable's `-pressed` |
| focus | keyboard focus (`:focus-visible`) | `--focus` as a ring, 2px with an offset; never a colour change alone |
| inactive | switched off, cannot act now | `--inactive`, `--inactive-foreground`, plus `aria-disabled` |
| loading | waiting on something | a skeleton or spinner after 200ms, `aria-busy`; the control keeps its size |
| invalid | the input is wrong | `--danger` on the border, a message linked with `aria-describedby`, `aria-invalid`; never colour alone |
| empty | nothing to show yet | says what belongs here and how to add the first one |
| success | the action worked | `--success`, announced with `aria-live`; fades back to default |

## Names

One word per state, everywhere: in variables, props, canvas artboards and docs.

| Say | Not |
|---|---|
| pressed | active |
| inactive | disabled |
| invalid | error (an error is a message or a flow path; invalid is the state of the control) |

In CSS the selectors keep their own names (`:active`, `:disabled`, `[aria-invalid]`); the variables and the vocabulary do not.

## Which states a component needs

- Anything that acts (button, link, toggle, card you can click): default, hover, pressed, focus, inactive.
- Anything that submits or fetches: add loading and success.
- Anything that takes input: add invalid.
- Anything that lists data: add empty and loading.

A component is not done until each state it needs has been seen, in light and dark. On a Design canvas that means one artboard per state worth comparing.

## Checks

- Hover is never the only way to reach something: touch has no hover.
- Pressed is visible within 100ms.
- Focus is visible on every background the component sits on.
- Inactive still passes 3:1 against its background if its label matters.
- No state is told apart by colour alone.
