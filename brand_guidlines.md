---
name: XtraCover Tech Brand Kit
type: design-system-specification
version: 3.0
owner: Design Systems, Tech Team Products
audience: [product-engineers, designers, AI-coding-agents]
usage: strictly-internal
intent: >
  Single-source brand and component specification for XtraCover product teams.
  Written to be consumed directly by an AI coding agent as build input:
  paste this file as context, then generate UI that is on-brand by construction.
made_by: Akhil Gupta
---

# XtraCover Tech Brand Kit

> This is the complete, machine-readable brand kit for the XtraCover
> **Design Component Guideline** (Tech Team Products). Give it to an AI agent as
> input and it has everything needed to build on-brand screens: tokens, light
> and dark, type, spacing, radius, motion, the component library with copy
> ready code, product patterns, and voice.

---

## 1. Company

XtraCover is an online marketplace for certified refurbished mobile phones,
laptops and other devices, plus warranty / protection plans and device repair.
Every device passes a **64 point quality check** and ships with a **12 month
warranty**. Parent company: Xtracover Technologies Private Limited, New Delhi.

- Tagline: **Reuse. Extend. Save.**
- Legacy values line: "Always on."
- Proof points to lead with: 64 quality checks, 12 month warranty, 7 day
  replacement, 60% savings.

---

## 2. How to use this kit (for an AI agent)

1. Read section **4 (Direction)**. There is exactly one approved direction.
2. Apply the tokens in section 5 as CSS custom properties on `:root`. Never
   hard-code a hex or px; always reference a token.
3. Build UI only from the components in section **9**. Copy their code verbatim.
4. Compose screens using the patterns in section **10**.
5. Obey the rules in section **11** (do / don't) and voice in section **12**.

**Core rule:** reference the semantic token, never the value behind it. That is
what makes dark mode, and any future palette move, free.

---

## 3. Design principles

| Principle | Meaning |
| --- | --- |
| Consistency | Same action, same visual outcome, every surface. |
| Reusability | Compose once, apply everywhere. |
| Accessibility | Keyboard, contrast and screen reader by default. |
| Scalability | New variants, no rewrites. |
| Performance | Lightweight, no bloat. |
| Maintainability | Clear ownership, dependable docs. |

---

## 4. Direction (the approved brand system)

The system ships **one** direction. Earlier drafts carried three; Classic and
Enterprise have been retired so there is a single answer to "what does an
XtraCover tech product look like".

### Technical Precision
- Font pairing: **Sora + Inter**. Sora for display, Inter for body and UI.
- Colour: **Cobalt `#0052CC`** with a warm **orange-red accent `#FF5630`**, on
  cool blue-tinted paper over deep navy ink.
- Structure: 8px corner scale, dashboard density, cobalt-tinted elevation.
- Motion: crisp, 120 to 200ms, no bounce on functional UI.
- Display weight 700, tracking -0.022em.

Why the warm accent: it sits better against Cobalt than a pure red does, and
carries emphasis without shouting, which is what dense product screens want.

---

## 5. Design tokens

Semantic tokens are the contract. Each has a light and a dark value. Reference
the semantic name (`--brand-primary`), not the raw value.

### 5.1 Colour

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--brand-primary` | `#0052CC` | `#6FA6FF` | Structure, headers, primary buttons |
| `--brand-primary-hover` | `#003D99` | `#8FBBFF` | Primary hover |
| `--brand-accent` | `#FF5630` | `#FF7A52` | CTAs, urgency, destructive only |
| `--brand-accent-hover` | `#DE3E1B` | `#FF9673` | Accent hover |
| `--accent-ink` | `#B93A08` | `#FF7A52` | The accent **as small text** |
| `--surface-page` | `#F4F6FB` | `#0B1220` | Page background |
| `--surface-card` | `#FFFFFF` | `#121B2D` | Elevated card |
| `--surface-sunken` | `#E9EEF9` | `#18233A` | Inset / muted surface |
| `--surface-inverse` | `#17284D` | `#060B14` | Always-ink surfaces |
| `--border-subtle` | `#DDE4F3` | `#1F2B42` | Hairline card borders |
| `--border-default` | `#C3CEE6` | `#2E3D5A` | Input borders |
| `--text-primary` | `#17284D` | `#EEF3FB` | Body and headings |
| `--text-secondary` | `#4A5875` | `#A9B6CE` | Supporting copy |
| `--text-tertiary` | `#5F6A86` | `#8593AD` | Captions, hints |
| `--text-on-brand` | `#FFFFFF` | `#04122B` | Text on a brand fill |
| `--text-on-accent` | `#FFFFFF` | `#FFFFFF` | Text on an accent fill |
| `--text-link` | `#0052CC` | `#6FA6FF` | Inline links |
| `--status-success` | `#00875A` | `#3FC98D` | Passed QC, in stock |
| `--status-warning` | `#8A5600` | `#E8A93F` | Needs review |
| `--status-danger` | `#C7300A` | `#FF7A52` | Error, hold, fail |

Three rules explain most of this table:

1. **Brand hues lighten on dark.** Cobalt at `#0052CC` would sink into a dark
   page, so dark raises it. Because the fill is then light, the text on it
   flips to ink, which is why `--text-on-brand` is white in light and near-black
   in dark. Read the token; never hardcode a colour on a brand fill.
2. **`--brand-accent` is a fill, `--accent-ink` is text.** `#FF5630` is chosen
   for presence and measures about 3:1 as 11px text, which fails AA. Use
   `--accent-ink` for eyebrows, section numbers and any small accent text.
3. **The accent label is white in both modes, by brand direction.** This is a
   known, accepted exception: white on `#FF5630` measures about 3.2:1, under
   the 4.5:1 AA asks for normal text. Keep accent fills to short bold labels
   such as "Buy now"; never set body copy or long strings on an accent fill.
   If a surface needs an accent CTA that clears AA, use
   `--brand-accent-hover` (`#DE3E1B`) as the fill instead.

`--surface-inverse` stays dark in **both** modes. It is the always-ink surface
(hero, tooltip, toast, splash, code blocks), so white text on it is correct
either way.

### 5.2 Typography

- Font families: see section 4. Sora for display, Inter for body and UI.
- Weights: Light 300, Regular 400, Medium 500, Semibold 600, Bold 700, Heavy 800.
- Display copy: Bold / Heavy. Body copy: Regular / Medium.
- Code / monospace: `JetBrains Mono`.

Type scale (px):

| Token | px | Role |
| --- | --- | --- |
| display-xl | 72 | Hero |
| display-l | 52 | Section hero |
| h1 | 34 | Page title |
| h2 | 26 | Section |
| h3 | 20 | Sub-section |
| body-l | 18 | Lead paragraph |
| body | 16 | Default |
| body-s | 14 | Dense UI |
| caption | 12 | Metadata, uppercase 0.14em tracking |

### 5.3 Spacing (4px base scale)

`4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128` (px). Grid: 12 columns, max content
width `1240px`. No arbitrary one-off values.

### 5.4 Radius

| Token | Value | Use |
| --- | --- | --- |
| `--radius-xs` | 4px | chips, checkboxes |
| `--radius-sm` | 6px | small controls |
| `--radius-md` | 8px | inputs, cards |
| `--radius-lg` | 12px | panels, modals |
| `--radius-xl` | 16px | large surfaces |
| `--radius-pill` | 8px | buttons, toggles |

The scale is deliberately tight. Nothing is fully rounded: an 8px "pill" keeps
buttons feeling engineered rather than friendly, which suits the product tools
this system serves.

### 5.5 Elevation & motion

- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`. Soft, low contrast, never
  coloured glow.
- Motion: one standard ease `cubic-bezier(.2,.7,.3,1)`, durations 120 to 200ms.
  Hover lifts brand surfaces `translateY(-2px)`. No bounce, no spring on
  functional UI. Respect `prefers-reduced-motion`.

### 5.6 Light and dark mode

Light and dark is the **only** axis. It never changes the typeface, the radius
scale or the motion; it re-points the same token names to different values.

- Attribute: `<html data-xc-mode="light|dark">`.
- Product code that already reads tokens gets dark mode for free. Code that
  hardcodes a hex does not.
- Default: the first visit follows the OS `prefers-color-scheme` and keeps
  following it live. Only an explicit toggle is remembered, in `localStorage`
  under `xc-mode`. Resolve the attribute in an inline script before first paint
  or dark-mode readers get a white flash on every load.
- Email templates stay light in both modes on purpose: they preview how the
  message renders in the recipient's mail client, not in this portal.

**Contrast.** Every text and UI pair was measured against WCAG 2.1 in both
modes by walking the rendered DOM, not by reading a table. All pairs clear AA.
The two values that make that true are `--accent-ink` (the accent as text) and
`--text-on-accent` (ink on the accent fill); bypass either and you will fail.

---

## 6. Logo

- Red and blue wordmark with the power button "O", tagline **Reuse. Extend. Save.**
- Do: use the supplied PNG at full opacity on plain or brand-dark surfaces.
- Don't: recolour, outline, rotate, add effects, or place on busy photography
  without a scrim.
- Minimum digital width: 120px with tagline, 90px without.

---

## 7. Iconography

- **Material Symbols Outlined**, via Google Fonts CDN. Free, versioned, no local
  files. One weight to match the UI. Emoji are not brand iconography.

---

## 8. Voice & content

- Tone: plain, benefit first, mildly promotional retail. Short declarative
  sentences leading with the customer benefit.
- Voice: second person ("you", "your device"), direct and transactional.
- Casing: Title Case for headings and nav; sentence case in body and FAQs.
- Numbers as proof: use real stats (64 checks, 12 months, 60% savings).
- Restraint: fewer discount exclamation points, confident short claims.

---

## 9. Component library

Every component is token-driven: it reads the semantic tokens, so it follows
light and dark with no per-component work.
Copy the code as-is.

### 9.1 Button
Props: `variant: primary | secondary | ghost | accent`, `size: sm | md | lg`,
`icon`, `iconAfter`, `loading`, `disabled`, `full`.
```tsx
<Button variant="primary">Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn more</Button>
<Button variant="accent" icon="bolt">Buy now</Button>
<Button loading>Saving</Button>
<Button disabled>Unavailable</Button>
```
Rules: one primary per decision point. Accent red is reserved for the single most
important or destructive action.

### 9.2 Input / Select
```tsx
<Input label="Device serial" placeholder="XC-000000" />
<Select label="Grade" options={['A, Like new', 'B, Good', 'C, Fair']} />
```

### 9.3 Checkbox / Switch
```tsx
<Checkbox label="Passed 64 point check" checked onChange={fn} />
<Switch label="Auto-assign to QC queue" checked onChange={fn} />
```

### 9.4 Badge
Props: `tone: success | warning | danger | brand | neutral`.
```tsx
<Badge tone="success">Ready</Badge>
<Badge tone="warning">Review</Badge>
<Badge tone="brand">Grade A</Badge>
```

### 9.5 Chip / Avatar / Tooltip
```tsx
<Chip onRemove={fn}>16GB</Chip>
<AvatarGroup people={[{ initials: 'AG' }, { initials: 'QC' }]} />
<Tooltip label="64 of 64 checks passed"><Badge tone="success">QC</Badge></Tooltip>
```

### 9.6 Tabs
```tsx
<Tabs tabs={['Specification', 'QC report', 'Warranty']} active={t} onChange={setT} />
```

### 9.7 Alert
Props: `tone: success | danger | warning | info`, `title`.
```tsx
<Alert tone="success" title="Saved">Request created successfully</Alert>
<Alert tone="danger" title="Error">Unable to save changes</Alert>
```

### 9.8 Progress / Stepper
```tsx
<Progress value={72} />
<Stepper steps={['Filed', 'Review', 'Approved', 'Sent']} current={2} />
```

### 9.9 Card
```tsx
<Card>
  <Badge tone="success">64-pt checked</Badge>
  <h3>iPhone 13, 128GB</h3>
  <p>Certified refurbished, 12 month warranty</p>
  <Price now="38,999" was="68,900" off="43%" />
  <Button variant="accent" full>Buy now</Button>
</Card>
```

### 9.10 Data table
```tsx
<Table head={['Device', 'Config', 'Status', 'Value']}>
  <Row cells={['Latitude 5420', 'i5, 16GB', <Badge tone="success">Ready</Badge>, '₹32,500']} />
</Table>
```

### 9.11 Segmented control
```tsx
<Segmented options={['Grade A', 'Grade B', 'Grade C']} value={v} onChange={setV} />
```

### 9.12 Radio group
```tsx
<RadioGroup name="type" options={['Refurbished', 'New', 'Open box']} value={r} onChange={setR} />
```

### 9.13 Slider (range)
```tsx
<Slider label="Battery health" min={0} max={100} value={72} onChange={setV} />
```

### 9.14 Textarea
```tsx
<Textarea label="Notes" placeholder="QC observations" value={v} onChange={setV} />
```

### 9.15 Accordion
```tsx
<Accordion items={[{ q: 'How do I enable dark mode?', a: 'Set data-xc-mode.' }]} />
```

### 9.16 Loaders (Spinner, Skeleton)
```tsx
<Spinner />
<Skeleton w={180} h={14} />
```

### 9.17 Stat card
```tsx
<StatCard label="Pass rate" value="91%" delta="3% wk" up />
```

### 9.18 Empty state
```tsx
<EmptyState icon="inbox" title="No devices yet" body="Scanned devices appear here." />
```

### 9.19 Keyboard hint
```tsx
Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
```

### Component index

| Component | Category | Key props |
| --- | --- | --- |
| Button | action | variant, size, icon, loading, disabled, full |
| Input | form | label, placeholder, value, onChange |
| Select | form | label, options, value, onChange |
| Textarea | form | label, placeholder, value, onChange |
| Checkbox | form | label, checked, onChange |
| Switch | form | label, checked, onChange |
| RadioGroup | form | name, options, value, onChange |
| Segmented | form | options, value, onChange |
| Slider | form | label, min, max, value, onChange |
| Badge | status | tone |
| Chip | status | onRemove |
| Avatar / AvatarGroup | status | initials, color / people |
| Tooltip | overlay | label |
| Tabs | navigation | tabs, active, onChange |
| Alert | feedback | tone, title |
| Toast | feedback | (imperative) |
| Modal | overlay | open, onClose |
| Accordion | disclosure | items |
| Progress | status | value |
| Stepper | status | steps, current |
| Spinner | loading | size |
| Skeleton | loading | w, h, radius |
| StatCard | data | label, value, delta, up |
| EmptyState | data | icon, title, body |
| Card | layout | (composition) |
| Table / Row | data | head / cells |
| Kbd | utility | (children) |

---

## 10. Product patterns

- **E-commerce buy:** trust badges above the fold, strike-through price to show
  real savings, one full-width accent "Buy now", "Add to cart" stays secondary.
- **Warranty claim:** four step stepper (Filed, Review, Approved, Sent), reused
  across ops tooling.
- **Mobile app:** touch targets >= 44px, full-width primary actions, bottom tab
  bar for the four core destinations, one decision per screen.
- **Desktop dashboard:** dark sidebar, KPI row, dense data table, composed only
  from approved parts.

---

## 11. Rules (do / don't)

**Do**
- Reference semantic tokens, never raw hex or px.
- Reference semantic tokens, in both modes.
- Lead with the customer benefit and real numbers.
- Reserve accent red for the single most important or destructive action.

**Don't**
- Hardcode a hex, or put white text on the accent fill.
- Recolour or distort the logo.
- Use emoji as UI iconography.
- Add bounce / spring motion to functional UI.
- Introduce a colour outside the token set.

---

## 12. Quick reference for generation

```
theme        = one of a | b | c
root         = <html data-xc-mode="light|dark">
colours      = --brand-primary, --brand-accent, --surface-*, --text-*, --status-*
radius       = --radius-xs|sm|md|lg|pill
motion       = cubic-bezier(.2,.7,.3,1), 120-200ms, no bounce
components    = Button, Input, Select, Checkbox, Switch, Badge, Chip, Avatar,
               Tooltip, Tabs, Alert, Progress, Stepper, Card, Table
accent-usage = CTAs, urgency, destructive only (one per screen)
```

---

## 13. Motion system

Motion should feel like a design lead directed it: purposeful, quick, never
gratuitous. Consistency of easing matters more than novelty.

### 13.1 Tokens

| Token | Value | Use |
| --- | --- | --- |
| ease-standard | `cubic-bezier(.2,.7,.3,1)` | Default for all functional UI |
| ease-spring | `cubic-bezier(.34,1.56,.64,1)` | Toggles, checks, playful accents only |
| duration-fast | 120ms | Hover, colour, small state |
| duration-normal | 200ms | Enter / exit, expand |
| reveal | 500-550ms | Scroll-in section reveals |

### 13.2 Micro-interactions (component level)

- Buttons: hover `translateY(-2px)` + shadow step up, tap `scale(.97)`, a light
  shimmer sweep across filled buttons on hover.
- Tabs / segmented: the active pill slides between options with a spring, shared
  layout animation (no cross-fade).
- Switch / checkbox / radio: the thumb / tick scales in on a spring.
- Cards: lift and soft shadow on hover; interactive cards add a 3D cursor tilt
  with a subtle radial spotlight following the pointer.
- Inputs: focus ring fades in, border adopts brand primary.

### 13.3 Macro-interactions (page level)

- Hero: layered gradient-mesh orbs drift on independent loops, a faint grid
  drifts, headline word uses an animated brand-gradient sheen, content parallaxes
  on scroll.
- Proof points: an infinite marquee ticker, pauses on hover.
- Sections: staggered reveal, children cascade in on scroll into view.
- Numbers: count up from zero when they enter the viewport.
- Scroll progress: a thin accent bar under the header tracks page progress.
- Tab change: content cross-enters with a short rise + fade.
- Steppers / progress: fill and advance with eased transitions.

### 13.4 Rules

- One easing family. Do not introduce bespoke curves per component.
- Everything must degrade under `prefers-reduced-motion: reduce` (animations and
  transitions collapse to near-zero, scroll snaps instant).
- Never animate layout-thrashing properties in loops. Prefer `transform`,
  `opacity`, `filter`.
- Motion clarifies flow; if an animation does not aid comprehension, cut it.

---

## 14. Accessibility

- Colour: text meets WCAG AA contrast against its surface. Never signal state by
  colour alone; pair with an icon or label.
- Focus: every interactive element shows a visible focus ring
  (`--shadow-focus`). Do not remove outlines without a replacement.
- Keyboard: all controls reachable and operable by keyboard. Modals trap focus
  and close on `Esc`. Tab order follows reading order.
- Semantics: use real elements (`button`, `label`, `input`, `nav`). ARIA roles
  on custom widgets (`role="tab"`, `role="switch"`, `role="radiogroup"`,
  `aria-expanded`, `aria-selected`, `aria-valuenow`).
- Targets: minimum 44px touch target on mobile.
- Motion: honour reduced-motion; never gate meaning behind an animation.
- Images: meaningful images have `alt`; decorative ones use empty `alt`.

---

## 15. Changelog

- **v3.0** (current) — collapsed to a single approved direction (Technical
  Precision, Cobalt + orange-red). Classic and Enterprise retired, along with
  the `data-xc-theme` attribute; tokens now live on `:root`. Added
  `--accent-ink` so accent text clears AA.
- **v2.1** — light/dark mode as an independent axis across all three
  directions, `--text-on-brand` / `--text-on-accent` tokens, WCAG AA contrast
  pass on every direction/mode pair, shared dialog behaviour (focus trap,
  `Esc`, focus restore) across all overlays.
- **v2.0** — three-direction token architecture, expanded component
  library (25+), motion system, product patterns, downloadable brand kit.
- **v1.x** — legacy print-manual identity (Aforeserve era), Raleway type,
  Pantone colour references. Retained only for offline collateral.

---

## 16. Machine summary (compact)

```yaml
brand: XtraCover
tagline: Reuse. Extend. Save.
direction:
  name: Technical Precision
  fonts: { display: Sora, body: Inter }
  primary: { light: '#0052CC', dark: '#6FA6FF' }
  accent:  { light: '#FF5630', dark: '#FF7A52' }
  accent_ink: { light: '#B93A08', dark: '#FF7A52' }   # the accent AS TEXT
  on_accent: '#2A0A00'                                 # ink ON the accent fill
  radius_pill: 8px
modes: [light, dark]
apply: '<html data-xc-mode="light|dark">'
spacing_base: 4px
grid: { columns: 12, max_width: 1240px }
motion: { ease: 'cubic-bezier(.2,.7,.3,1)', duration: 120-200ms, reduced_motion: required }
components: [Button, Input, Select, Textarea, Checkbox, Switch, RadioGroup, Segmented, Slider,
  Badge, Chip, Avatar, Tooltip, Tabs, Alert, Toast, Modal, Accordion, Progress, Stepper,
  Spinner, Skeleton, StatCard, EmptyState, Card, Table, Kbd]
rules:
  - reference semantic tokens, never raw hex or px
  - --brand-accent is a fill; use --accent-ink for small accent text
  - accent = one important/destructive action per screen
  - all interactive elements keyboard + focus-ring accessible
  - honour prefers-reduced-motion
```

---

XtraCover Tech Team Products, Design Component Guideline v2.0. Strictly internal
use. Made by Akhil Gupta.
