MYTHORAS SKILL CARD SYSTEM - COMPREHENSIVE SUMMARY
DISCUSSION OVERVIEW
Initial Problem Statement

Wanted a skill move system for Mythoras that:

    Captures Path of Exile's progression feel (meaningful leveling, modular supports, transparent math)
    Fits Pokémon-style creature team combat (turn-based, creature identity)
    Avoids PoE's frustrating RNG grind (linking spam, socket color hell)
    Maintains player agency (democratic access, deterministic endgame)
    Skills are ITEMS that level independently of gear

Core Requirements Established

    Skills level 1-20 naturally (XP from battles, 20+ hour investment)
    Supports bind TO skills (not gear, not creature)
    Vendor-accessible by mid-campaign (democratic access)
    Variants exist (Transcendent/Awakened equivalents)
    Polarity replaces Quality (transformative effects, not boring +20%)
    Gl!tch corruption system (high-stakes min/maxing)
    Skill Gem Profiles (weapon swap equivalent)
    Math transparency (damage effectiveness, tags, clear scaling)
    No hidden mechanics (no IVs/EVs equivalent)
    Progression feels earned (RNG early → semi-deterministic late)

DESIGN EVOLUTION
Phase 1: Initial Proposals (Rejected)

First proposed systems focused on WHERE supports live:

    Gear-based cores (chest = 6-link)
    Matrix Frames (external item)
    Creature capacity pools

Feedback: "You're designing the picture frame when I'm asking about the painting."

Key Insight: The delivery mechanism (sockets/frames) is secondary. The core is skills are items that level, supports modify them.
Phase 2: Refined Proposals (4 Delivery Mechanisms)

Proposed 4 distinct visual/mechanical systems:

    Codex (Card) - CCG-style cards
    Matrix (PCB) - Circuit board with component slots
    Constellation (Network) - Node-based topology
    Tablet (Rune) - Stone inscription system

Feedback: "Good ideas, different from previous. You've understood the core parameters."

But noted trend: Missing progression focus and player interaction flow.
Phase 3: Parameters Refinement

Key Corrections:

    Progression Arc (NOT Campaign-Complete at 6-Link):
        WRONG: Campaign ends with 6 supports
        RIGHT: Campaign ends with 5 supports, 6th is endgame chase
    RNG → Deterministic Curve:
        Early Game: Socket Reforge Catalyst (RNG, rerolls slots + colors)
        Late Game: Neural Link Expander (deterministic, adds +1 slot)
    Zone Level Gating (NOT Item Level):
        Zone Lv 2-22: Max 2 slots
        Zone Lv 23-44: Max 3 slots
        Zone Lv 45-57: Max 4 slots
        Zone Lv 58-70: Max 5 slots
        Zone Lv 71+: Max 6 slots
    Starter Experience (Novel, Not Generic):
        8 starter creatures (pure + hybrid attributes)
        Tutorial boss drops choice of 5 starter skills
        Default Attack ("Impact") - 0 supports, modifiable via Polarity/Gl!tch
        Town 1 vendor: 6 skills + 6 supports (player agency from turn 1)
    Color Weighting by Attribute:
        Fire skill (Authority) using Socket Reforge:
            60% Red slot
            15% Green
            15% Blue
            10% White
        ALWAYS weighted toward skill's primary attribute
    Sacred Supports = Drop-Only (Never Vendor):
        Sources:
            Pinnacle bosses (15-25%)
            Map bosses (2-5%)
            Vendor recipe (3x Lv20 supports + currency)
    Multi-Town Vendor Progression:
        Act 1, Town 1: 12 cards
        Act 1, Town 2: 26 cards
        Act 4, Town 1: 80 cards
        Endgame: 6-10 rows × 6-10 columns (organized tabs)

FINAL OUTCOME: SKILL CARD SYSTEM
What a Skill Card IS

Physical Representation:

    Card-style item (like Hearthstone/MTG meets PoE gems)
    Attribute-colored (Authority = Red #991B1B, Invictus = Green
    #059669, Animus = Purple
    #C026D3, Order = Blue
    #1E3A8A)
    Levels 1-20 (gains XP from battles, 20+ hours to max)
    Has support slots (1-6, progresses through game)
    Has colored slots (Red/Green/Blue/Orange/White, weighted by skill's attribute)
    Holds 1 Polarity channel (default, expandable to 2 via Gl!tch/Ascendancy)
    Exists independently (not tied to gear, not tied to creature stats)

Core Mechanics

    Obtaining Skills:
        Tutorial boss drops choice of 5 starter skills (1-2 slots random)
        Vendor sells skills at every town (6 → 12 → 26 → 80+ progression)
        Drops from enemies/bosses (random rarity, level, slots)
        All skills vendor-accessible by Act 4-5 (democratic access)
    Support Slots (RNG → Deterministic): Early Game (Acts 1-6):
        Socket Reforge Catalyst (semi-common drop)
            Re-rolls slot count (RNG within zone max)
            Re-rolls slot colors (weighted 60% to skill's attribute)
            Example: 2 slots → reroll → could be 1-2 slots with new colors
    Mid Game (Acts 4-8):
        Attuned Catalyst (uncommon drop)
            Re-rolls ONLY colors (preserves slot count)
            Guarantees at least 1 match to skill's attribute
    Late Game (Maps):
        Neural Link Expander (rare drop)
            Adds +1 slot (deterministic, not RNG)
            Preserves existing colors
            Chase currency to reach 6 slots
    Deep Endgame:
        Chromatic Override (very rare)
            Choose 1 slot, set exact color you want
            Perfect color matching (5-6 matches = +25-30% power)
    Slot Colors & Matching:
        Red (Authority), Green (Invictus), Blue (Animus), Orange (Order), White (Universal)
        When support attribute matches slot color:
            +5-8% to that support's effect
            Visual: Slot border pulses with glow color, "[MATCH]" badge
        White slots: Accept any support, no bonus
        Endgame chase: 6 perfect color matches = +30% total power
    Polarity System:
        Replaces Quality (not boring +0-20%)
        Transformative effects:
            Synthetic: +Crit chance, chains on crit
            Militaristic: +MORE damage, cannot miss, -attack speed
            Primal: +Attack speed, bleeds deal more
            Delirious: (TBD)
            Ethereal: (TBD)
        1 channel default, 2nd via Gl!tch corruption or Ascendancy
        Capacity scales 0-100% (more investment = stronger effect)
    Gl!tch Corruption:
        Use Gl!tch Shard (very rare, 1 per 50+ hours)
        Outcomes:
            40%: +1 Level (Lv 20 → Lv 21)
            20%: +1 Polarity Channel (2 polarities)
            30%: +25% Polarity Capacity
            10%: Brick (unusable)
        High-stakes tension (perfect or destroyed)
    Transcendent Variants:
        Rename from "Awakened" (better thematic fit)
        Obtained via Ascension Trial (early endgame)
        Choose 1 of 3 variants per skill
        Examples:
            Cinder Strike → Cinder Strike of Devastation (AoE on kill)
            Cinder Strike → Cinder Strike of Precision (+50% crit multi)
            Cinder Strike → Cinder Strike of Fury (Rage stacking)
        Lateral choices, not strict upgrades
    Sacred Supports:
        Drop-only (never sold by vendors)
        Much stronger (50% MORE vs 30% MORE)
        Higher costs/trade-offs
        Endgame chase (farm pinnacle bosses)

PROGRESSION TIMELINE
Stage	Zone Lv	Slots	Main DPS	Key Systems
Tutorial	1	1-2	30	Choose starter, Default Attack
Act 1	2-15	2	85	Socket Reforge (RNG), Resonance bonus
Act 3	23-30	3	1,450	First Polarity, Attuned Catalyst
Act 6	45-50	4	4,200	Color optimization, more vendors
Act 9	58-62	5	8,900	Campaign complete
Early Maps	68-75	5	15,200	Transcendent variants, Sacred drops
Mid Maps	76-82	5-6	25,000	Neural Link (deterministic 6th slot)
Deep Endgame	85+	6	38,500	Gl!tched, perfect colors, dual Polarity

ATTRIBUTE COLOUR PALETTE

Authority (Red/Gold):
- Base (Dark): #3F0000
- Mid (Vibrant): #991B1B
- Highlight (Material): #D97706
- Accent (Glow): #FBBF24

Invictus (Green/Teal):
- Base (Dark): #022C22
- Mid (Vibrant): #059669
- Highlight (Material): #94A3B8
- Accent (Glow): #34D399

Animus (Purple/Pink):
- Base (Dark): #2E1065
- Mid (Vibrant): #C026D3
- Highlight (Material): #F0ABFC
- Accent (Glow): #E879F9

Order (Blue/Cyan):
- Base (Dark): #020617
- Mid (Vibrant): #1E3A8A
- Highlight (Material): #06B6D4
- Accent (Glow): #CFFAFE

KEY DESIGN PILLARS ACHIEVED

    Skills are items (level independently, tradable, persistent)
    Democratic access (vendor-sold by Act 4-5)
    Progression feels earned (RNG early → deterministic late)
    No frustrating RNG (can't get 6-link in Act 1, but can target it endgame)
    Math transparency (damage effectiveness, tags, clear bonuses)
    Modular supports (same skill, infinite configurations)
    Meaningful leveling (20+ hours per gem = commitment)
    Variants create identity (Devastation ≠ Precision ≠ Fury)
    Polarity innovation (not boring Quality, transformative)
    Gl!tch tension (high-risk high-reward)
    Endgame chase (6 slots, perfect colors, Sacred supports, Gl!tch outcomes)
    Multiple skills per creature (up to 6 cards equipped)
    Default Attack safety net (0 supports, modifiable, always available)
    Resonance bonus (+12% damage when creature type matches skill, automatic)
    Team management UI (view all 5 creatures' skills at once)

STARTER CREATURES (8 OPTIONS)

Pure Attribute Starters:

    Emberion (Authority) - Fire Lion, aggressive melee
    Zephyra (Invictus) - Wind Hawk, fast striker
    Psylith (Animus) - Crystal Mage, high magic power
    Frostguard (Order) - Ice Golem, defensive tank

Hybrid Attribute Starters:
5. Blazeclaw (Authority/Invictus) - Fire Tiger, physical/fire hybrid
6. Voltshade (Invictus/Animus) - Lightning Fox, speed/magic
7. Voidcaller (Animus/Order) - Void Wraith, magic/control
8. Ironshell (Order/Authority) - Metal Turtle, tank/power

Each creature receives:

    Default Attack: "Impact" (creature-themed variants)
        0 support slots (cannot add supports)
        Instant cast, 15-25 damage, 0 resource cost
        CAN apply Polarity (for late-game optimization)
        CAN Gl!tch (for +1 level, bonus effects)

RESONANCE BONUS (STAB EQUIVALENT)

Automatic Bonus (No Investment Required)

When creature's Domain matches skill's Domain:

    Fire Creature + Fire Skill: +12% Fire Damage, +5% Ignite Chance
    Lightning Creature + Lightning Skill: +12% Lightning Damage, +5% Shock Chance
    Ice Creature + Ice Skill: +12% Ice Damage, +5% Freeze Chance

This is ALWAYS ACTIVE when types match.

Example:

    Emberion (Fire/Authority) using "Cinder Strike" (Fire/Authority):
        Resonance Active: +12% Fire Damage, +5% Ignite Chance
    Emberion (Fire) using "Lightning Strike" (Lightning):
        No Resonance (no penalty, just no bonus)

MULTIPLE ACTIVE SKILLS PER CREATURE

Each Creature Equips Up to 6 Skill Cards:

Example Setup:

    SLOT 1: "Cinder Strike of Devastation" (6 supports) - Main DPS
    SLOT 2: "Flame Dash" (2 supports) - Movement
    SLOT 3: "Flammability Curse" (1 support) - Debuff
    SLOT 4: "Molten Shell" (0 supports) - Guard
    SLOT 5: "Herald of Ash" (1 support) - Aura
    SLOT 6: EMPTY

Total: 5 active skills, 10 supports used

Each card is independent:

    "Cinder Strike" card = 6 slots (main DPS, high investment)
    "Flame Dash" card = 2 slots (utility, lower priority)
    "Molten Shell" card = 0 slots (instant guard, no supports needed)

Flexibility:

    Want 2 main skills? Equip 2 cards with 5-6 supports each
    Want many utilities? Equip 1 main (6 supports) + 4 utilities (1-2 supports each)

DEFAULT ATTACK MODIFICATIONS

Default Attacks CAN Be Optimized:

"Impact" (Base Default Attack):

    0 support slots (cannot add supports)
    15-25 damage, Instant, 0 resource cost
    CAN apply Polarity
    CAN Gl!tch

Example Optimized Default:

    "Ember Impact" [Lv 21] (Gl!tched +1 level)
    [Attack, Normal, Priority]
    Slots: NONE (Default Attack)
    Polarity: Militaristic (100%)
        +25% MORE damage
        Cannot miss
        +50% Priority (acts first)
    DPS: 250 Physical
    (Fast, free, priority finisher)

Use Cases:

    Priority finisher (acts first, secure kills)
    Resource-free option (when low on mana)
    Reliable backup (can't be disabled)

WHY SKILL CARDS WON

Compared to other proposals:

vs Matrix (PCB):

    Cards more universally understood (CCG familiarity)
    Less complex mental model (no "circuit flow" to grasp)
    Easier mobile/controller support

vs Constellation (Network):

    Cards clearer visual hierarchy (slot 1-6 obvious)
    No spatial puzzle confusion (where nodes go)
    Faster configuration (drag-drop vs positioning)

vs Tablet (Rune):

    Cards less punishing (runes felt permanent/destructive)
    Better fits "Technician" theme (digital cards vs stone)
    More flexible metaphor (cards = data, modules, programs)

Cards achieve:

    Instant recognition (everyone knows trading cards)
    Clean UI (stacking, sorting, filtering natural)
    Progression visualization (Level 1 → 21 obvious)
    Attribute theming (Red fire card, Green lightning, etc.)
    Drag-drop native (built for mouse/touch interaction)
    Scales elegantly (simple 2-slot card → complex 6-slot perfection)

FINAL OUTCOME SUMMARY

The Skill Card System represents:

A fusion of Path of Exile's gem progression (leveling, supports, variants) with Hearthstone's card clarity (visual hierarchy, instant readability) and Pokémon's creature identity (type bonuses, team composition), avoiding PoE's frustrating RNG (deterministic endgame) while maintaining earned progression (campaign = 5 slots, maps = 6 slots chase).

Skills are persistent items that level alongside creatures, can be traded/stashed/optimized, and represent 20+ hours of investment per gem. The system scales from simple 2-slot starter (Act 1 player) to perfect 6-slot Gl!tched Sacred-supported dual-Polarity build (Deep endgame min-maxer), with clear progression gates (zone level) and RNG→deterministic curve (Socket Reforge early, Neural Link late).

Player agency maximized: Buy any skill by Act 4, reroll sockets anytime (with cost), choose Transcendent variants, gamble on Gl!tch, chase perfect color matches. Democratic access guaranteed: No skill is RNG-gated forever, Sacred Supports farmable via bosses or vendor recipe.

This is the skill move system for Mythoras.