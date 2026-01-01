# Mythoras: Crafting System & Currency Design Document

## 1. Core Philosophy

**Design Pillars:**
- Agency over probability (smart RNG manipulation)
- "Jackpot" moments through clever currency sequencing
- System mastery rewards deep game knowledge
- Meaningful differentiation from Path of Exile while learning from its successes
- Currency items ARE the crafting materials (dual-purpose economy)

**Player Experience Goals:**
- **Early Campaign:** Found items are primary, crafting is rare enhancement
- **Mid Campaign:** Introduction of conditional crafting through Reagents, first crafting sequences emerge
- **Endgame:** Complex multi-step sequences combining Core Agents, Reagents, and Extended Agents

---

## 2. Affix Structure & Item Framework

### 2.1 Item Rarity Tiers

| Rarity | Affix Count | Acquisition | Primary Use |
|--------|-------------|-------------|-------------|
| **Standard** | 0 | Common drops, vendor | Crafting base |
| **Magic** | 1-3 | Common drops | Early campaign gear, crafting intermediate |
| **Rare** | 4-6 | Uncommon drops | Primary endgame target |
| **Unique** | Fixed | Boss/special drops | Build-defining items |
| **Apex** | Fixed+ | Upgraded Unique (endgame) | Enhanced Uniques, mirrorable |
| **Resonant** | Variable | Crafted only (Unique mod transfer) | Pinnacle chase items, non-mirrorable |

### 2.2 Affix Classification System

**Internal Structure:** Items maintain 3 Prefix / 3 Suffix slots (for balance and meta-crafting)

**Exposed Tag System:** Every affix has 2-3 tags that crafting operations can target

#### Tag Categories:

**Power Tags:**
- `[Offensive]` - Damage, crit chance, attack/cast speed, penetration
- `[Defensive]` - Life, resistances, armor, evasion, aegis, discipline
- `[Utility]` - Attributes, movement speed, bandwidth, ailment avoidance

**Domain Tags:**
- `[Infernal]`, `[Tidal]`, `[Seismic]`, `[Voltaic]`, `[Glacial]`, `[Venom]`, `[Shadow]`, `[Radiance]`, etc.
- `[Physical]`, `[Universal]` (non-elemental)

**Attribute Tags:**
- `[Authority]`, `[Invictus]`, `[Order]`, `[Animus]`, `[M.Y.T.H.]`

**Scale Tags:**
- `[Flat]` - Fixed values (+50 Maximum Life)
- `[Increased]` - Additive scaling (+20% increased Fire Damage)
- `[More]` - Multiplicative scaling (rare, powerful)

**Example Tagged Affix:**
```
+75 to Maximum Life
Tags: [Defensive] [Flat] [Universal]

+45% increased Infernal Damage  
Tags: [Offensive] [Increased] [Infernal]

+15% to Infernal Resistance
Tags: [Defensive] [Infernal]
```

### 2.3 Item Level & Mod Tiers

- **Item Level (iLvl):** Determines which mod tiers can roll (iLvl 1-84+)
- **Mod Tiers (T1-T10):** T1 = highest values, T10 = lowest values
- Higher item level = access to better tier ranges
- Tier affects affix power but also weighting (T1 mods are rarest)

### 2.4 Gear Slots

**Per Creature:**
- **Weapon** (6 affixes max)
- **Offhand/Tool** (6 affixes max)
- **Helmet** (6 affixes max)
- **Imprint Interface** (Grid-based, multiple small slotted items - your "Idol Grid")
- **Symbiotic Slot** (Creature-specific gear, 4-6 affixes, unique mod pools per creature Origin/type)

**Mod Pool Variation:** Each gear type has different available mod pools to encourage build diversity

---

## 3. Core Agents (Basic Crafting Currency)

**Definition:** Core Agents are the foundational crafting currencies. They drop from all content, form the trading economy, and provide basic crafting operations.

### 3.1 Rarity Transformation Agents

#### **Agent of [TBD - Transmute equivalent]**
- **Operation:** Upgrades Standard item → Magic (1-3 random affixes)
- **Availability:** Act 1+, common drop
- **Use Case:** Convert white bases to usable gear early campaign
- **Economy Role:** Vendor trash in endgame, map rolling utility

#### **Agent of [TBD - Augmentation equivalent]**
- **Operation:** Adds 1 random affix to Magic item (if space available)
- **Availability:** Act 1+, common drop
- **Use Case:** Fill out Magic items, "finish" a 1-mod item
- **Economy Role:** Map rolling, niche crafting

#### **Agent of [TBD - Alteration equivalent]**
- **Operation:** Rerolls all affixes on Magic item (maintains 1-3 affix count)
- **Availability:** Act 1+, very common drop
- **Use Case:** Primary Magic item crafting, fishing for specific 2-mod combinations
- **Economy Role:** Alt-spam crafting base, frequent use throughout all stages
- **Campaign Availability:** 20-30 per act

#### **Agent of [TBD - Regal equivalent]**
- **Operation:** Upgrades Magic item → Rare (adds 1 random affix)
- **Availability:** Act 3+, uncommon drop
- **Use Case:** Bridge good Magic items to Rare for further crafting
- **Economy Role:** Key component in alt-spam sequences
- **Campaign Availability:** 5-10 total

#### **Agent of [TBD - Alchemy equivalent]**
- **Operation:** Upgrades Standard item → Rare (4-6 random affixes)
- **Availability:** Act 2+, common drop
- **Use Case:** Quick usable Rares, map rolling
- **Economy Role:** Bulk Rare generation
- **Campaign Availability:** 15-25 per act

#### **Agent of [TBD - Chaos equivalent]**
- **Operation:** Rerolls all affixes on Rare item (maintains 4-6 affix count)
- **Availability:** Act 3+, uncommon drop
- **Use Case:** Primary Rare reroll, "try again" on bad items
- **Economy Role:** Major trading currency, frequent crafting use
- **Campaign Availability:** 15-20 total (MORE than PoE's 6-7 Chaos)
- **Mythoras Differentiation:** More common than PoE, encourages "reroll and try again" over perfect preservation

#### **Agent of [TBD - Scouring equivalent]**
- **Operation:** Removes all affixes from item → Standard
- **Availability:** Act 5+, rare drop
- **Use Case:** Reset items to craft from scratch, "one-directional" reversal
- **Economy Role:** High-end crafting, expensive resets
- **Campaign Availability:** 2-5 total

### 3.2 Modification Agents

#### **Agent of [TBD - Exalted equivalent]**
- **Operation:** Adds 1 random affix to Rare item (if space available)
- **Availability:** Act 5+, very rare drop
- **Use Case:** High-stakes "finish" an item, chase T1 mods
- **Economy Role:** Premium currency, major trading standard
- **Campaign Availability:** 0-2 total
- **Mythoras Differentiation:** [NEEDS DIFFERENTIATION DISCUSSION]

#### **Agent of [TBD - Annulment equivalent]**
- **Operation:** Removes 1 random affix from item
- **Availability:** Act 6+, very rare drop
- **Use Case:** High-stakes "fix" by removing bad mod
- **Economy Role:** Niche crafting, risky sequences
- **Campaign Availability:** 1-3 total

#### **Agent of [TBD - Divine equivalent]**
- **Operation:** Rerolls numeric values of all affixes within their tiers
- **Availability:** Act 8+, rare drop
- **Use Case:** Min-max finished items
- **Economy Role:** Major trading currency, endgame value sink
- **Campaign Availability:** 3-5 total

### 3.3 Novel Core Agents

#### **Agent of [TBD - Context-based operation]**
- **Operation:** [NEEDS DESIGN - should have multiple outcomes based on item state]
- **Potential Mechanics:**
  - Different outcome based on item level ranges
  - Different outcome based on current affix count
  - Different outcome based on tag distribution
- **Availability:** [TBD]
- **Use Case:** [TBD]
- **Mythoras Differentiation:** New operation type not in PoE

#### **Agent of [TBD - Tag-based operation]**
- **Operation:** [NEEDS DESIGN - should interact with affix tag system]
- **Potential Mechanics:**
  - Reroll all mods of specific tag
  - Add mod of specific tag
  - Remove mod of specific tag
- **Availability:** [TBD]
- **Use Case:** [TBD]
- **Mythoras Differentiation:** Leverages unique tag system

#### **Agent of [TBD - Scavenge operation]**
- **Operation:** Destroys item, extracts 1 mod as tradable "Shard" item
- **Mechanic Details:**
  - Random mod selection (or based on item level)
  - Shard is tradable, stackable currency
  - Shard can be applied via separate Agent
- **Availability:** Act 7+, rare drop
- **Use Case:** Transfer perfect mods between items
- **Economy Role:** High-end crafting, creates mod market
- **Mythoras Differentiation:** Related to PoE Recombinators but more controlled

#### **Agent of [TBD - Recombinator-inspired]**
- **Operation:** Consumes 2 Rare items, creates 1 new Rare with mods from both
- **Mechanic Details:**
  - Random selection of 4-6 mods from pool of both items
  - Weighting based on mod tiers
  - Both items destroyed
- **Availability:** Endgame, very rare
- **Use Case:** Combine two mediocre items into one great item
- **Economy Role:** High-stakes crafting sequences
- **Mythoras Differentiation:** [NEEDS REFINEMENT]

### 3.4 Special Transformation Agents

#### **Agent of [TBD - Chance Orb equivalent]**
- **Operation:** Randomly transforms item
  - 85%: No change (waste)
  - 10%: Standard → Magic
  - 4%: Standard → Rare  
  - 1%: Standard → Unique (from base-specific pool)
- **Availability:** Act 3+, common drop
- **Use Case:** Gambling for base-specific Uniques
- **Economy Role:** Unique farming, gambling

#### **Agent of [TBD - Ancient Orb equivalent]**
- **Operation:** Rerolls Unique to different Unique of same base type
- **Availability:** Endgame, very rare
- **Use Case:** Chase specific Unique variants
- **Economy Role:** Unique market manipulation

#### **Agent of [TBD - Binding Orb equivalent]**
- **Operation:** Standard → Rare with special condition
  - **Potential conditions:**
    - All mods share 1 tag
    - Guaranteed 1 mod of each Power tag
    - All mods are Flat/Increased type only
- **Availability:** Act 4+, uncommon
- **Use Case:** Targeted Rare creation
- **Mythoras Differentiation:** [NEEDS SPECIFIC CONDITION DESIGN]

### 3.5 Gl!tch Agents (Corruption System)

#### **Agent of [TBD - Positive Gl!tch]**
- **Operation:** Item becomes Gl!tched (cannot craft further), deterministic positive outcome
- **Potential Outcomes (Choose one):**
  - All mod tiers improve by 1 (T5→T4)
  - Add powerful Gl!tch implicit
  - Transform 1 mod to "Elevated" (doubled effectiveness)
  - [OTHER OPTIONS TBD]
- **Availability:** Endgame, rare
- **Use Case:** Final upgrade on finished item
- **Economy Role:** High-value crafting finish

#### **Agent of [TBD - Negative Gl!tch]**
- **Operation:** Item becomes Gl!tched, deterministic high-risk outcome
- **Potential Outcomes (Choose one):**
  - All mods become T1-T2 (jackpot)
  - Add 2 Gl!tch implicits
  - Item becomes Standard (brick)
  - Item transforms to random Unique of base
- **Availability:** Endgame, rare
- **Use Case:** Last-resort gambling on bricked items
- **Economy Role:** High-stakes endgame crafting

---

## 4. Reagent System (Conditional Crafting)

**Definition:** Reagents are consumable modifiers applied to items that condition the next crafting operation. They are NOT standalone crafts.

**Philosophy:** 
- Introduce mid-campaign (Act 3-4) to enable "small, easy patterns"
- NOT essences (no guaranteed mods)
- Create diversity through conditional weighting/targeting
- Must be balanced for campaign use

### 4.1 Weighting Reagents (Campaign, Common)

#### **Reagent: [Domain] Bias** (e.g., Reagent: Infernal Bias)
- **Effect:** Item gains temporary buff (visual glow)
- **Condition:** Next add/reroll operation has +300% weighting toward `[Infernal]` tag mods
- **Does NOT guarantee, heavily weights**
- **Consumed:** On next crafting operation
- **Availability:** Act 3+, common drop
- **Variants:** One per Domain (Infernal, Tidal, Seismic, Voltaic, etc.)

#### **Reagent: Offensive/Defensive Focus**
- **Effect:** Next add/reroll has +300% weighting toward `[Offensive]` or `[Defensive]` tag
- **Availability:** Act 3+, common drop

#### **Reagent: Attribute Surge** (e.g., Authority Surge)
- **Effect:** Next add/reroll has +300% weighting toward attribute mods (Authority, Invictus, etc.)
- **Availability:** Act 4+, common drop
- **Variants:** One per core attribute

### 4.2 Conditional Reagents (Mid-Campaign)

#### **Reagent: [TBD - Selective targeting]**
- **Effect:** Next reroll operation only affects mods with specific tag (e.g., `[Increased]`)
- **Example:** "Reroll all scaling mods without touching flat life/resists"
- **Availability:** Act 5+, uncommon
- **Variants:** [NEEDS SPECIFIC TAG COMBINATIONS]

#### **Reagent: [TBD - Risk mitigation]**
- **Effect:** Next removal operation targets lowest-tier mod (removes Annul randomness)
- **Availability:** Act 6+, uncommon

#### **Reagent: [TBD - Tier manipulation]**
- **Effect:** Next add operation guarantees T1-T4 tiers (but still random mod)
- **Availability:** Act 6+, rare

### 4.3 Advanced Reagents (Endgame)

#### **Reagent: [TBD - Meta-craft replacement]**
- **Effect:** Locks all mods with specific tag (e.g., all `[Offensive]`)
- **Condition:** Next reroll only affects unlocked mods
- **Availability:** Endgame, very rare
- **Mythoras Differentiation:** Uses tag system instead of Prefix/Suffix
- **Example:** Lock all `[Offensive]`, reroll `[Defensive]` mods

#### **Reagent: [TBD - Domain conversion]**
- **Effect:** Changes all mods with one Domain tag to another (e.g., `[Infernal]` → `[Glacial]`)
- **Availability:** Endgame, very rare
- **Use Case:** Convert element on finished item

---

## 5. Extended Agents (Endgame Mechanic-Specific)

**Definition:** Extended Agents are acquired through specific endgame systems (Network Ciphers, boss encounters, league mechanics). They provide parallel crafting pathways and enable complex sequences.

### 5.1 [System Name TBD] - Fossil-Inspired

**Currency Name: [TBD]**

**Function:** Tag-based mod pool manipulation, used in combination with Core reroll Agents

**Mechanic:**
- Applied in Foundry crafting station
- Used WITH a reroll Agent (not standalone)
- Example: `[TBD Currency: Scorched]` + Agent of [Chaos equivalent]
  - "More `[Infernal]` mods, fewer `[Glacial]` mods"

**Available Modifications:**
- Domain weighting (more Fire, less Cold)
- Power tag weighting (more Offensive, less Defensive)  
- Attribute weighting (more Authority, less Animus)
- **Does NOT remove mods from pool** (simpler than PoE Fossils)
- Multiple can be used together for compound effects

**Acquisition:** Network Cipher exploration, special nodes

**Variants Needed:** [FULL LIST TBD - one per major Domain/tag combination]

### 5.2 [System Name TBD] - Essence-Inspired

**Currency Name: [TBD]**

**Function:** Reroll item with guaranteed specific high-tier mod

**Mechanic:**
- Rerolls item to Rare (if not already)
- Guarantees 1 specific mod at T1-T3 tier
- All other mods random
- Example: `[TBD Currency: Juggernaut]`
  - Guarantees T1-T3 "+Maximum Life" mod

**Acquisition:** Creature encounters, special variants

**Variants Needed:** [FULL LIST TBD - one per build-defining mod type]

**Mythoras Differentiation:** 
- Acquired from creature encounters (thematic)
- Possibly Origin/Domain specific drops

### 5.3 [System Name TBD] - Eldritch-Inspired

**Currency Name: [TBD - Prefix Lock] / [TBD - Suffix Lock]**

**Function:** Meta-crafting operations that lock half of item's affixes

**Mechanic:**
- Rare endgame currency from pinnacle content
- Used in Foundry before reroll operation
- Locks all Prefixes OR all Suffixes
- Next reroll only affects unlocked half

**Acquisition:** Endgame boss encounters, pinnacle content

**Mythoras Differentiation:**
- Still uses Prefix/Suffix for this (keeps familiar meta-craft)
- Could potentially have tag-based variants via Reagents instead

### 5.4 [System Name TBD] - New System

**[OPEN DESIGN SPACE]**

Potential mechanics:
- Creature-specific crafting materials from captures
- Cipher-exclusive crafting operations
- Imprint-specific operations for Idol Grid
- Symbiotic Slot exclusive crafting

---

## 6. Crafting Bench System

**Concept:** NPC crafting station in hub that provides deterministic, temporary fixes during campaign

**Philosophy:**
- Costs other crafting currency (Agents) + gold
- NOT optimal crafts, but "good enough" to progress
- Unlocks through campaign progression
- Helps fix resist/attribute gaps without perfect RNG

**Example Operations:**
- "Add +15% to Fire Resistance" (Cost: 3x Chaos equivalent + 500 gold)
- "Add +20 to Maximum Life" (Cost: 5x Chaos equivalent + 1000 gold)
- "Add +15 Authority" (Cost: 2x Chaos equivalent + 300 gold)

**Unlock Progression:**
- Act 2: Basic resist crafts
- Act 4: Life/attribute crafts  
- Act 6: Damage crafts
- Act 8: Advanced crafts

**Mythoras Differentiation:**
- Explicitly temporary campaign solution
- More expensive than PoE's bench
- [NEEDS FURTHER DESIGN]

---

## 7. Campaign Progression Framework

### Act 1-2 (Badges 1-2) - Loot is King

**Available Currency:**
- [Transmute], [Augmentation], [Alteration] - Magic manipulation
- 2-3x [Chaos] equivalent
- 5-10x Weighting Reagents (Infernal Bias, etc.)
- 10-15x [Alchemy] equivalent

**Player Strategy:**
- Equip found Rares as-is
- Occasionally reroll terrible Rare with [Chaos]
- Use Reagent + [Alchemy]/[Chaos] for "smart" first craft
- Magic items with 2-3 good mods are viable

**Crafting Bench:**
- Unlock basic resistance crafts

### Act 3-5 (Badges 3-4) - Sequence Introduction

**New Currency:**
- [Regal] becomes accessible
- First [Exalt] equivalent (maybe 1)
- Conditional Reagents available
- 5-8x [Chaos] equivalent

**Player Strategy:**
- Alt-spam for 2-mod Magic items
- Regal to Rare
- Use Reagent combinations for targeted rerolls
- First "sequence thinking" emerges

**Crafting Bench:**
- Life/attribute crafts unlock

### Act 6-8 (Badges 5-8) - Advanced Sequences

**New Currency:**
- [Scour] becomes available
- [Annul] equivalent (1-2)
- [Divine] equivalent (2-3)
- First Extended Agents appear
- 5-7x [Chaos] equivalent

**Player Strategy:**
- Multi-step sequences combining Agents
- First use of Scavenge/Transfer operations
- Tag-based crafting with Extended Agents

**Crafting Bench:**
- Damage crafts unlock

### Endgame (Elite Four+, Network Ciphers) - Mastery

**Available Systems:**
- All Core Agents
- Full Reagent suite
- Extended Agents from all systems
- Gl!tch operations
- Complex meta-crafting

**Player Strategy:**
- Multi-item sequences (scavenge perfect mod, transfer)
- Recombinator strategies
- Prefix/Suffix lock sequences  
- Gl!tch gambling on finished items

---

## 8. Design Questions Requiring Resolution

### 8.1 Core Agent Naming Convention
- Need unique names that fit "Technician/Artificer" theme
- Must avoid PoE direct copies
- Should be memorable and intuitive
- **[NEEDS FULL NAMING PASS]**

### 8.2 Differentiation Strategy
Current overlap with PoE:
- [Transmute/Aug/Alt/Regal/Alch/Chaos/Scour/Exalt/Annul/Divine equivalents]

**Where should we differentiate?**
- Make [Chaos] equivalent more common (15-20 vs PoE's 6-7)
- Make [Exalt] equivalent... what? More common? Different mechanic?
- Replace some operations with context-based variants?
- **[NEEDS DECISION]**

### 8.3 Tiered Currency Problem
- How to avoid "Lesser/Greater" variants that become obsolete?
- Use context-based operations instead (same currency, different outcome based on item level)?
- **[NEEDS DESIGN]**

### 8.4 Reagent Balance
- How many Reagents should drop per act?
- What's the correct weighting bonus? (+300% or different?)
- Should advanced Reagents replace meta-craft currency entirely?
- **[NEEDS TUNING]**

### 8.5 Extended Agent Systems
- Need to design 2-3 full endgame systems that drop Extended Agents
- How do these integrate with Network Cipher progression?
- Which mechanics from PoE should we adapt vs invent new?
- **[NEEDS FULL SYSTEM DESIGN]**

### 8.6 Economy Considerations
- Which Core Agents become primary trade currency?
- How do we prevent currency devaluation?
- What are the major sinks?
- **[NEEDS ECONOMIC MODELING]**
