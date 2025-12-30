CSS / Tailwind Migration Audit — task 0.5

Purpose
- Identify remaining places where raw/custom CSS or inline style rules are used and propose a migration approach to Tailwind utilities and component primitives.

Quick findings
- Primary global stylesheet is `src/index.css` (Tailwind-generated); moved app-level viewport rule into `@layer base`.
- Many UI elements already use Tailwind utility classes and the `components/ui/*` primitives (shadcn-style).
- Remaining raw or inline styles to consider:
  - Inline React `style={{ ... }}` props used for dynamic values (Canvas background, map coordinates, element transforms). These are often appropriate to remain inline, or be converted to class + CSS variables where static.
  - Small inline sizes and positioning inside components (e.g., minimap, HUD). These should be evaluated for conversion to Tailwind classes where possible.
  - Rare global selectors inside `index.css` (Tailwind utilities are dominant).

Migration plan
1. Rules & conventions
   - Only use raw CSS for:
     - Complex keyframes / animations requiring non-trivial styles.
     - Global resets placed in `@layer base`.
     - Component-specific complex selectors moved into a single component CSS module if necessary.
   - Prefer Tailwind utilities and `components/ui/*` primitives for all layout, spacing, colors, and typography.

2. Steps
   - Sweep codebase for inline styles: `grep -R \"style={{\" src/`.
   - For each occurrence:
     - If dynamic (depends on runtime numbers) keep inline or extract into CSS vars + Tailwind class.
     - If static, replace with Tailwind utility classes.
   - Audit `src/index.css` for custom selectors outside Tailwind generation and move allowable globals into `@layer base` (done for viewport).
   - Add Tailwind theme tokens in `tailwind.config.js` (colors, spacing, radii) for consistency.
   - Update `components/ui/*` to accept props for common variations (size, variant) rather than ad-hoc classes across app.

3. Testing
   - After each batch conversion, run the app and visually verify at 1280x720, 1440x900, 1920x1080.
   - Add visual regression snapshots for critical views (GameView) if desired.

Notes
- This audit is conservative: it favors stability for the prototype while reducing duplication and custom CSS over time.
- I can run the grep sweep and produce a concrete list of inline styles and custom selectors if you'd like — next step if approved.



