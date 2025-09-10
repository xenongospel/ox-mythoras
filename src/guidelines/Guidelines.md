# Mythoras UI Shell – Guidelines (Light v0.4)

> Scope: **UI shell only** (dockable/resizable panels around a 3D Game View).  
> Tone: **regal-mature**, technical. Dark theme by default. Styling nudges toward the second reference (clean terminal-chic with vivid accents), not neon-arcade.

---

## 1) General
- Prefer **responsive grid/flex**; absolute positioning only for overlays.
- **8-pt spacing** system; touch targets ≥ **40px**.
- Keyboard first: every action has a shortcut; visible focus rings.
- Keep surfaces calm; let **accents** communicate state and interactivity.
- No glassmorphism. Panels are solid, legible over moving 3D.

---

## 2) Color Tokens
> Use a **purplish magenta→violet** accent family + **cool teal** as the action color. Neutral “stone/steel” surfaces.

**Neutrals**
- `--bg-canvas`: `#0E0D12`  
- `--surface-0`: `#16151C`  (base panel)  
- `--surface-1`: `#1E1C25`  (elevated)  
- `--border`:   `#2E2A36`  
- `--gridline`: `#1A1920` (subtle background grid)
- `--text-1`:   `#EAE6F6`
- `--text-2`:   `#BDB7CA`
- `--text-3`:   `#8E879C`

**Accents**
- Violet/Magenta: `--violet-600:#6E3CCF`, `--violet-500:#7A53E6`, `--violet-300:#9B89FF`  
- Teal (actions): `--teal-600:#18B3A5`, `--teal-500:#2CC7A6`, `--teal-300:#6EDCC0`

**Semantic**
- `--ok:#2EC48A`  `--warn:#CF9E3C`  `--danger:#C4516E`  `--info:#7C6DF2`
- Focus ring: `--focus:#7A53E6`

**Gradients (sparingly)**
- Header stripe: `linear(#8E2BAE → #6E3CCF → #5840E0)`  
- Teal glow: `radial(#60D7BB → transparent)`

Contrast: body text ≥ **4.5:1**, icons/controls ≥ **3:1**.

---

## 3) Typography
- **UI/Body:** *Inter* (400/500/600). Use **tabular numerals** for data.
- **Monospace utility (optional labels, status):** *JetBrains Mono* 500.
- Sizes: `H1 20`, `H2 18`, `H3 16`, `Body 14`, `Caption 12` (px).  
- Line height: Headings `1.25`, Body `1.45`.  
- Case: Title Case for panel titles; sentence case elsewhere.

---

## 4) Layout Shell
**Regions**
1. **Top Bar**: product id, search, session status, progression button (with verbs like Continue) to start game world simulation.
2. **Main Content Area**: user adds/removes/resizes/drags customizable panel around.
3. **Dock Area**: left/right/bottom; user can drag, stack, tab.

**Docking Rules**
- Panel min width **320px**, min height **240px**.  
- Gutters **8–12px**. Panels snap to edges; stacks become tabs.
- Layout persists per user; provide *Save/Load/Reset Layout*.

**Background**
- Subtle 8–12px grid using `--gridline`. No parallax.

---

## 5) Panel Anatomy
- **Header (44–48px):** left icon (20–22px) + Title; right actions (Filter, View, Help, Close).  
  - Header line: 1px `--border`; optional 2px **violet** top stripe.  
- **Body:** padding **16–20px**; scrolls.  
- **Footer (optional):** totals/status; subdued `--surface-1`.
- **Tabbed Panel:** Panels can be docked into tabs to create a tabbed panel.

**Elevation & Borders**
- Border: 1px `--border`.  
- Radius: **8px** (compact) or **12px** (looser).  
- Shadow: minimal; use **inner highlight** top edge `rgba(255,255,255,0.03)` for depth.

---

## 6) Core Panels (v0 presets)

### Game View (container only)
- Dark matte surface; no blur; FPS/latency chip in top-right (mono).
- React Three Fiber overworld
- Control schemes:
  - Click to move
  - WASD
- Updates within game view should reflect the other panels. For example
  - Minimap should reflect current map
- Isometric camera static behind player (path of exile inspired)

### Scout
- Columns: Name · Origin · Domain · Threat · Distance.  
- Row height **44px**; selection = violet outline + subtle fill (`--violet-600` @ 10%).

### Stash / Inventory
- Tabs: **Items** (grid) · **Materials** (table).  
- Search with chips (`type:Infernal`, `ilvl:≥80`).  
- Tooltips show: **Base**, **Increased**, **More**, rolls, sources.

### Workshop (Crafting)
- Left: recipes/filter tree. Center: workbench board. Right: currency tray + log.  
- Primary actions are **teal**. Destructive actions require confirm modal.

### Log / Alerts
- Timestamp · Source · Message · Level (color coded).  
- Copy/export; filters persistent.

---

## 7) Components

### Buttons
### Inputs
- Height 40; `--surface-1` fill, 1px `--border`.  
- Focus ring 2px `--focus`.  
- Dropdown only if >3 options; otherwise segmented controls.

### Tabs
- Underline indicator in **violet**; inactive text `--text-3`.  
- Tab height 36–40; min width 120.

### Chips
- Solid `--surface-1` with 1px border; removable × on right.  
- Active chip = **teal** outline.

### Tables
- Virtualized lists; row 40–44; zebra 1–2% luminance shift.  
- Sort (tri-state), resize, pin. Right-align numbers; tabular figures.

### Tooltips/Popovers
- Tooltip max 360px; 150ms delay.  
- Popover arrow 8px; dismiss on **Esc** and outside click.

---

## 8) Motion
- Open/close panels: **180–240ms**, `cubic-bezier(0.2,0.8,0.2,1)`.  
- Hover/press: **120–160ms**.  
- Respect *Reduce Motion*: swap to fades ≤ 90ms.

---

## 9) Accessibility
- Visible focus rings always.  
- Keyboard order matches visual order; shortcuts surfaced in tooltips.  
- Live regions for async updates (stash ops, craft results).

---

## 10) Writing
- Direct, technical, **matter-of-fact**.  
- Buttons = verbs (“Craft”, “Deposit”, “Engage”).  
- Panels = nouns (“Stash”, “Workshop”, “Scout”).  
- Show math in tooltips; avoid jargon in labels.

---

## 11) Quick Do / Don’t
- **Do** use **teal** for actions and success, **violet** for selection/highlight.  
- **Do** keep surfaces solid and quiet; let content breathe.  
- **Don’t** use pinks/neons or glassy blurs.  
- **Don’t** exceed two accent hues in a single panel.
