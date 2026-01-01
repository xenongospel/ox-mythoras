The Matrix: A Skill Move System Design

Core Concept & Player Fantasy
This system is built for the "Master Artificer" and "Arcane Engineer." The Technician does not find fully-formed power; they construct it. The core of a creature's customizable abilities is not its own gear, but a sophisticated, craftable artifact called a Soulforged Matrix.

This Matrix is a physical, tradable item that the Technician designs, modifies, and perfects. 

Foundational Objects
The system is comprised of several interacting objects: The Matrix (Container), and the contents (the Skill Moves).

The Matrix Frame (OLD IDEA)
The Matrix (Full name: Matrix Frame)  is the foundational item â€” the chassis upon which all skill configurations are built.
    Acquisition: Frames are acquired as loot from defeated enemies and chests. They are fully tradable. Common Frames with random configurations will drop regularly, while high-potential bases are rarer.
    Base Types: Frames come in various base types (e.g., "Heavy Plating Matrix," "Voltaic Circuit Matrix"), each aligned with one or more of the core attributes (Authority, Invictus, Order, Animus). This alignment biases the probabilities when rolling Node colors.
    Implicit Modifiers: Every Frame has powerful implicit modifiers. (1-3) scaling with item level. (Implicits might be - Socketed Moves are supported by 20% increased Area of Effect)

Sockets & Conduits (New Sockets & Links)
Matrix is built with Focused Sockets connected by Neural Pathways.
    Focusing Nodes (Sockets): These are the emplacements on the Frame that hold Skill Moves.
        Crafting: The number of Sockets is not static. A special currency item is used to re-roll the number of Sockets on a Matrix. This process is a blend of determinism and chance: using the currency guarantees a certain number of links based on the Matrix's item level, while the number and color of the Sockets are randomized. This mitigates the frustration of having many sockets but no links.
        Colors: Sockets can be one of five colors, corresponding to the Mythoras attributes: Authority, Invictus, Order, Animus, and M.Y.T.H. (White/Prismatic). While any gem can be placed in any Node, placing a gem in a Node of the matching attribute color provides a powerful augmentation, creating a deep late-game optimization puzzle.
    Links: These are the pathways that channel power between Sockets, allowing Support Moves to modify Active Skill Moves.
        Crafting: Conduits are created using a common currency item called Synaptic Agents. Due to the higher drop rate of this currency, the process of fully linking a Matrix is less about extreme luck and more about dedicated effort, reducing the frustration of the traditional link-spamming grind.

Skill Moves
Moves are the active and passive abilities socketed into the Matrix.
    Active & Utility moves: The core of the system, functioning as they do in classic ARPGs.
    Mythic moves: Exceptionally rare, drop-only moves that possess unique scaling mechanics and powerful, build-defining effects.
    Unawakened State: By default, all standard moves are "unawakened." They are powerful and effective in this state.

Core Mechanics & Progression Loops
The Crafting & Customization Loop
    Acquire Frame: The player finds or trades for a Matrix Frame with a desirable base type and powerful implicit modifiers.
    Roll Nodes: The player uses currency to roll the Frame, aiming for a high Node count while benefiting from the guaranteed number of Conduits appropriate for the item's level.
    Establish Conduits: The player uses Synaptic Agents to create any remaining Conduits needed to complete their desired setup.
    Optimize Colors: The player uses a chromatic-style currency to re-roll Node colors, aiming to match the attributes of their chosen gems to unlock powerful augmentations.
    Equip & Manage: The finished Matrix Frame is socketed into a dedicated slot on a creature's gear. A global, centralized UI allows the Technician to view and manage all equipped Matrices across their entire roster of creatures.

Polarity Pathways (The Evolution of Quality)
The standard "Quality" system is replaced by a more dynamic and strategic layer of customization called Polarity Pathways.
    Concept: Instead of a generic percentage bonus, gems can be imbued with one of five different Polarities. Each Polarity represents a different philosophical approach to augmenting a skill's power, inspired by legendary demigods of the world.
    Mechanics: Applying a Polarity Catalyst to a gem alters its fundamental properties in a unique way, far beyond a simple damage increase. For example:
        Synthetic Polarity
        Delirious Polarity
        Milataristic Polarity
        (Two other Polarities to be defined).
        
    Each Polarity is a unique, permanent change to a move's behavior defined by the Skill Move itself
    This system transforms the simple act of improving a move into a meaningful build choice, creating another deep layer for theorycrafting.

Skill Move Awakening & The Ritual Trial
This system provides a major endgame objective for empowering a single, core skill to its absolute limit.
    The Ritual Trial: To awaken a gem, the Technician must undertake a difficult, boss-focused challenge akin to Path of Exile's Labyrinth. This trial will test the player's skill and build comprehension.
    Awakening: Upon successful completion of the trial, the Technician can choose one unawakened gem socketed within the Matrix Frame used during the trial. This gem becomes "Awakened."
    Evolution: An Awakened gem is fundamentally transformed. The player is presented with three distinct, powerful new versions of the skill, similar to Transfigured Gems. This choice is permanent for that specific gem and represents the ultimate specialization of an ability. For example, an Awakened "Shattering Quake" might evolve into:
        Shattering Quake of Fissures: Loses the wave effect but creates permanent, damaging ground fissures.
        Shattering Quake of Resonance: Waves no longer deal damage but apply a stacking debuff that causes the target to explode after a delay.
        Shattering Quake of the Mountain: A single, massive, but much slower slam with a vastly larger area of effect.

Late-Game Frame Attunement
For the most dedicated Technicians, Attunement is the final stage of crafting.
    Concept: Once a Matrix Frame has been perfected, it can be taken through a high-stakes, late-game crafting process.
    Mechanics: Attunement allows the player to add a final, incredibly powerful effect to the Frame itself, potentially altering its function, adding a unique triggered ability, or further enhancing the gems socketed within it. This process is designed to be a significant resource sink and a pinnacle achievement for a player's build.

This condensed system, centered on the Soulforged Matrix, provides the tangible, item-centric progression and deep crafting puzzle you envisioned, while innovating on the core formula to reduce frustration and reward strategic planning.

**Synergy of Origin & Domain:** 
- Each creatureâ€™s combination of Origin and Domain should create a unique profile. For instance:
- A **Scalesbourne (Origin) + Flame (Domain)** is basically a fire dragon â€“ likely very strong in physical stats and fire offense, but maybe doubly weak to water (water hurts flame domain and perhaps draconic hides are weak to cold/water by design).
- A **Mystique + Frost** might be an ice elemental sprite â€“ very tricksy, high magic power, but fragile if physically hit or against heavy force.
- A **Nocturne + Venom** could be an undead venomous serpent â€“ excelling at DoT damage and hard to kill except with maybe holy/light attacks that exploit undead.
- We ensure that each combination is *viable* (no completely trash combo) by giving them tools in the passive tree or affixes to shore weaknesses. But some combos will naturally lend themselves to certain strategies.

**Asymmetric Advantages:** 
- Weâ€™ve touched on it â€“ unlike PokÃ©mon where type matchups are mostly symmetric (if A is super-effective vs B, B is often not vs A, except some like Dragon-Dragon which are mutual), we can design some imbalances:
- E.g., Light hurts Shadow strongly, but Shadow might hurt many other types and not necessarily Light as much.
- Martial (fighting) might excel against Steel (breaks Armour) and maybe even Avatar (mortal strength defying gods?), but Martial might not get extra damage from any Domain specifically â€“ it just is straightforward. Meanwhile, Mystique might not have a direct counter advantage but can adapt via magic to exploit elemental weaknesses.
- The goal is a web of relationships that encourage having a variety of Domains on your team and using smart tactics rather than always just brute-forcing with one type. Because even if you have the â€œwrongâ€ domain matchup, you might still win via stats or Origin advantages or good play.

**Damage, Damage Types and Damage Sources**
- **Hit**
--> A hit whether physical, arcane (spell), elemental or another damage classification (similar to Path of Exile) is used to determine the amount of damage a creature takes.
--> Physical (Countered by Armour, Physical Damage Reduction)
--> Arcane (Countered by Armour, Spell Suppression)
--> Elemental (Countered by Resistances - Can be countered by Armour if invested)
--> Other Damage Classification Buckets - (Countered by Resistance and other specific mechanics like Deflect)
- **Accuracy vs Evasion:** Unlike PokÃ©monâ€™s fixed accuracy per move, we might have an accuracy stat vs evasion stat. However, to avoid frustration we could keep base accuracy high (most moves hit unless evasion is stacked or thereâ€™s a specific blind condition). But having accuracy/evasion allows builds around being evasive (e.g., glass cannon that avoids hits instead of tanking them).
- **Damage Types and Tags:** There are many tags (Projectile, Melee, AoE, DoT, etc.) which can influence damage calculation (some defenses might specifically guard vs AoE but not single-target, etc.). For example, a shield might give extra block chance against Projectile attacks, meaning those have a chance to be negated or reduced. If a creature has a trait â€œAgile: 30% evasion against AoE attacksâ€, big AoEs can sometimes miss them.

Tags also tie directly to Domains: a move tagged [Infernal] will scale with Infernal damage bonuses, trigger Burn ailments, and be resisted by fire resistance. Choosing supports or passives that boost your primary tags is key. For instance, an Infernal-focused build might seek gear with â€œ+X to [Infernal] Spell Damageâ€ or motherboards nodes that add stacks of Burn. Likewise, creatures can adapt their damage vector: a raw punch might remain Neutral (Physical), but a modifier could convert 50% of it to an elemental domain, changing its scaling.

The battle tags enable powerful synergies. A [Chain] tag lets a lightning bolt arc between enemies; [Pierce] lets arrows hit multiple foes; [AoE] marks explosive areas. Unique combos emerge from tag interactions: for example, a [Status] tag on a water move could inflict â€œSoakedâ€, and then a [Voltaic]-tagged chain lightning will automatically bounce extra times through soaked targets (mimicking electricity conducting through water). Another concept: hitting a poisoned target with a fire [Infernal] attack could trigger â€œCombustionâ€ â€“ consuming the poison to deal bonus area damage. These mechanics are not hard-coded to each move but come from how tags and affixes interact, making the system extensible.