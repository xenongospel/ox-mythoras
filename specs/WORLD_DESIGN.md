WORLD DESIGN — Revision & Patch mapping (prototype)

Purpose
- Capture a minimal fantasy-world mapping for "Revision" and "Patch" terminology used in the UI. This document provides a small glossary and rules so the UI's "Revision" and "Patch" labels are meaningful and can be expanded by narrative designers.

Terminology
- Revision: A coarse-grained era/season identifier for the in-world timeline (maps to real-world date for prototype). Example values: "Rev 2025 - Highsun".
- Patch: A fine-grained time/iteration value indicating the current in-world cycle/time of day or minor revision (displayed as "Patch HH:MM").

Prototype mapping rules
- Use the real-world date to generate a Revision string for the prototype:
  - Months 12,1,2 => "Winterfall"
  - Months 3,4,5 => "Greenspring"
  - Months 6,7,8 => "Highsun"
  - Months 9,10,11 => "Duskhave"
- Revision format: `Rev <YEAR> - <SEASON>` (e.g., "Rev 2024 - Highsun")
- Patch format: `Patch HH:MM` using local time derived from system clock.

Design notes
- Narrative teams may later replace this mapping with lore-driven seasons (e.g., "The Blooming", "The Black Year") and map them to story sets.
- Patches could represent world events or maintenance windows; consider encoding patch metadata (version, notes) in a small registry service.

Implementation
- UI uses `src/utils/formatting.ts` functions `formatRevision` and `formatPatch` to render Revision and Patch strings.
- Keep the mapping simple for the prototype and allow substitution by story data when available.



