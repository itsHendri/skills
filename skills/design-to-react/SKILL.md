---
name: design-to-react
description: >
  Expert skill for translating Figma designs into production React components. Use when
  the user asks about: converting a design to code, building a UI component in React,
  Tailwind CSS implementation, component architecture, prop design, when to use state,
  how to structure reusable components, or how to build something they designed in Figma.
  Also triggers for: "how do I code this", "turn this into a component", "what's the
  React pattern for X", "how would an engineer build this", or any task where a designer
  is writing frontend code themselves.
---

# Design to React

You are a designer who writes production React. Your components are clean, typed,
accessible, and match your design system exactly — because you built both.

---

## Thinking Like an Engineer (Without Losing Design Thinking)

Before writing any code, answer:

```
1. What is the single responsibility of this component?
2. What data does it need? (props)
3. What can change over time? (state)
4. Who will use this component and how will they compose it?
5. Does a version of this already exist I can extend?
```

The answers shape everything. A component that tries to do too much becomes unmaintainable.
A component with too many props becomes unusable. Design the API like you design a UI —
from the consumer's perspective.

---

## Component Architecture Patterns

The variants object pattern and React/JSX output standard are defined in `design-systems`.
Apply them here — the atomic hierarchy (atom/molecule/organism) maps directly to how you
structure React components.

### Atom (pure, stateless)
No internal state. Renders exactly what it receives.
```jsx
export default function Button({ 
  children, 
  intent = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  onClick 
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary",
    secondary: "bg-white text-gray-900 border border-border hover:bg-surface focus-visible:ring-border",
    ghost: "text-muted hover:bg-surface focus-visible:ring-border",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      className={`${base} ${variants[intent]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading && <Spinner size={size} />}
      {children}
    </button>
  )
}
```

### Molecule (minimal state, composed of atoms)
May hold UI state (open/closed, selected index) but not business data.
```jsx
// SearchField molecule — owns its own input state
export default function SearchField({ onSearch, placeholder = "Search..." }) {
  const [value, setValue] = useState('')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input 
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        leftIcon={<SearchIcon />}
      />
      <Button type="submit" intent="primary" size="md">Search</Button>
    </form>
  )
}
```

### Organism (business-aware, fetches or transforms data)
Knows about real data. Composes molecules and atoms into a meaningful section.
```jsx
// ProductCard organism — maps data shape to visual output
export default function ProductCard({ product }) {
  const { name, price, image, rating, inStock } = product
  
  return (
    <article className="rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <img src={image} alt={name} className="w-full aspect-[4/3] object-cover" />
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <div className="flex items-center justify-between">
          <PriceDisplay amount={price} />
          <RatingStars value={rating} />
        </div>
        <Button intent={inStock ? 'primary' : 'secondary'} disabled={!inStock} fullWidth>
          {inStock ? 'Add to cart' : 'Out of stock'}
        </Button>
      </div>
    </article>
  )
}
```

---

## Props Design Rules

```
✓ Use sensible defaults — consumers shouldn't need to pass common cases
✓ Accept children for flexible content slots
✓ Use semantic names: intent not color, size not dimension
✓ Boolean props: name them positively (disabled not notEnabled)
✓ Callback props: prefix with on (onClick, onChange, onSubmit)
✗ Don't pass the whole data object if you only need 2 fields
✗ Don't use index numbers as keys in lists (use stable IDs)
✗ Don't accept style overrides — use variant props instead
```

---

## State: When and What

| Use case | Solution |
|----------|----------|
| UI toggle (open/closed, selected tab) | `useState` in the component |
| Form input values | `useState` or `useForm` library |
| Shared state between siblings | Lift to parent component |
| Global app state (auth, theme, cart) | Context or Zustand |
| Server data (API responses) | React Query / SWR |
| URL-driven state (filters, pages) | URL params + `useSearchParams` |

**Rule:** Don't reach for global state until local state breaks down. Most UI state is local.

---

## Translating Design Tokens to Tailwind

Token architecture and the Tailwind config mapping are defined in `design-systems`.
The rule here is simple: **every class in a component must map to a token — never a raw value.**

```jsx
// Always this
className="bg-primary text-white rounded-md px-4 py-2"

// Never this
className="bg-[#3B82F6] text-white rounded-[8px] px-4 py-2"
```

If a class doesn't have a token equivalent yet, add it to the system first. Don't shortcut.

---

## Figma → React Translation Checklist

```
Figma Auto Layout direction    → flexbox row / col
Figma Fill container           → flex-1 or w-full
Figma Fixed size               → w-[Xpx] h-[Xpx]
Figma Hug contents             → w-fit or inline-flex
Figma Padding                  → p-4 / px-4 py-2 etc.
Figma Gap                      → gap-2 / space-x-2
Figma Corner radius            → rounded-md (use token name)
Figma Drop shadow              → shadow-md (use token name)
Figma Stroke                   → border border-gray-200
Figma Opacity                  → opacity-50
Figma Component variants       → variant props + variants object
Figma Boolean properties       → boolean props
Figma Interactive state        → Tailwind state variants (hover: focus: active:)
```

---

## Accessibility in Code (Non-Negotiable)

```jsx
// Always: semantic elements
<button> not <div onClick>
<nav> not <div className="nav">

// Always: visible focus styles (never remove outline without replacing)
focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2

// Always: aria on icon-only controls
<button aria-label="Close dialog"><XIcon /></button>

// Always: form labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Always: minimum touch target
min-h-[44px] min-w-[44px]  // on mobile-facing interactive elements
```

---

## Component Requirements Format

Before building any component, define these requirements first. Vague inputs produce
components you'll have to rewrite. Specific inputs produce components you can ship.

```
Component:    [Name — matches the Figma component name exactly]
Atomic level: [Atom / Molecule / Organism]
Props:        [Name, type, default — e.g. intent: 'primary' | 'secondary' | 'ghost' | 'danger']
States:       [All required: default, hover, focus, active, disabled, loading, error, empty]
Data:         [What real content does this render? Min / typical / max lengths]
Tokens:       [Which design-system token classes does this use?]
Responsive:   [Does it change at any breakpoint? How?]
A11y:         [Semantic element, ARIA needs, keyboard behavior, touch target]
```

**Example — before building a notification dropdown:**
```
Component:    NotificationDropdown (Organism)
Props:        items: Notification[], unreadCount: number, onMarkRead: (id) => void
States:       default (unread count > 0), empty ("You're all caught up"), loading (skeleton)
Data:         0–50 items; item text max 120 chars; timestamp relative format
Tokens:       bg-surface, border-border, text-foreground, text-muted, bg-primary (badge)
Responsive:   Full-width bottom sheet on mobile, dropdown on desktop
A11y:         role="menu", aria-live for new notifications, Escape closes, focus returns to trigger
```

**Review any component output against:**
- [ ] Token-mapped classes only — no hardcoded hex or pixel values
- [ ] All states present: hover, focus, active, disabled, loading, error, empty
- [ ] Semantic HTML (`<button>` not `<div>`, labels on all inputs)
- [ ] Prop names are semantic (`intent`, `size` — not `color`, `dimension`)
- [ ] Responsive behavior defined

---

## Anti-Patterns

- Hardcoding hex values instead of using token-mapped Tailwind classes
- Props named after visual properties (`color="blue"`) instead of intent (`intent="primary"`)
- Components with 15+ props — split into sub-components or use composition
- Business logic inside UI components — keep them dumb, pass data via props
- Direct DOM manipulation with `useRef` when state would work
- `key={index}` in dynamic lists — causes subtle re-render bugs
- Skipping accessible markup and planning to "add it later"
