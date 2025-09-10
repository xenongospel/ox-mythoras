import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Search, Star, Zap, Shield, Sword, Brain, Heart } from 'lucide-react';

interface CreatureStats {
  authority: number; // Leadership/Command
  order: number;     // Organization/Strategy  
  animus: number;    // Life force/Spirit
  invictus: number;  // Courage/Determination
  myth: number;      // Mystical power
}

interface Creature {
  id: string;
  name: string;
  species: string;
  type: 'fire' | 'ice' | 'earth' | 'air' | 'shadow' | 'light';
  level: number;
  experience: number;
  maxExperience: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  color: string;
  contracted: boolean;
  inSquad: boolean;
  stats: CreatureStats;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  abilities: string[];
  lore: string;
  discoveredAt: string;
  evolutions?: string[];
}

const CREATURE_COLLECTION: Creature[] = [
  {
    id: '1',
    name: 'Pyraxis',
    species: 'Flame Wyrm',
    type: 'fire',
    level: 27,
    experience: 8750,
    maxExperience: 10000,
    rarity: 'epic',
    icon: '🐉',
    color: '#ff4444',
    contracted: true,
    inSquad: true,
    stats: { authority: 85, order: 72, animus: 90, invictus: 88, myth: 95 },
    health: 850,
    maxHealth: 1000,
    energy: 420,
    maxEnergy: 500,
    abilities: ['Flame Breath', 'Wing Buffet', 'Molten Armor', 'Phoenix Rebirth'],
    lore: 'Ancient dragons of the volcanic peaks, Flame Wyrms are prideful beings that bond only with those who prove their worth in combat.',
    discoveredAt: 'Ember Desert - Volcanic Depths',
    evolutions: ['Greater Flame Wyrm', 'Inferno Dragon']
  },
  {
    id: '2',
    name: 'Frost',
    species: 'Ice Wolf',
    type: 'ice',
    level: 24,
    experience: 6200,
    maxExperience: 7500,
    rarity: 'rare',
    icon: '🐺',
    color: '#4488ff',
    contracted: true,
    inSquad: true,
    stats: { authority: 78, order: 82, animus: 75, invictus: 80, myth: 65 },
    health: 680,
    maxHealth: 750,
    energy: 290,
    maxEnergy: 400,
    abilities: ['Frost Bite', 'Pack Hunt', 'Ice Barrier', 'Howl of Winter'],
    lore: 'Noble creatures of the frozen tundra, Ice Wolves form strong pack bonds and are fiercely loyal to their chosen companions.',
    discoveredAt: 'Frozen Peaks - Crystal Caves',
    evolutions: ['Alpha Ice Wolf', 'Frost Fenrir']
  },
  {
    id: '3',
    name: 'Boulder',
    species: 'Earth Golem',
    type: 'earth',
    level: 29,
    experience: 9100,
    maxExperience: 11000,
    rarity: 'epic',
    icon: '🗿',
    color: '#44aa44',
    contracted: true,
    inSquad: true,
    stats: { authority: 70, order: 95, animus: 85, invictus: 92, myth: 88 },
    health: 1200,
    maxHealth: 1200,
    energy: 150,
    maxEnergy: 300,
    abilities: ['Stone Throw', 'Earthquake', 'Rock Armor', 'Mountain Guard'],
    lore: 'Living embodiments of the earth itself, Golems are patient and methodical, serving as unwavering guardians.',
    discoveredAt: 'Ancient Ruins - Stone Gardens',
    evolutions: ['Titan Golem', 'World Shaper']
  },
  {
    id: '4',
    name: 'Whisper',
    species: 'Shadow Cat',
    type: 'shadow',
    level: 22,
    experience: 4800,
    maxExperience: 6000,
    rarity: 'rare',
    icon: '🐱',
    color: '#888888',
    contracted: true,
    inSquad: false,
    stats: { authority: 82, order: 75, animus: 88, invictus: 70, myth: 92 },
    health: 520,
    maxHealth: 550,
    energy: 380,
    maxEnergy: 420,
    abilities: ['Shadow Step', 'Void Claw', 'Dark Veil', 'Nightmare'],
    lore: 'Mysterious felines that phase between dimensions, Shadow Cats are cunning and prefer stealth over direct confrontation.',
    discoveredAt: 'Shadow Woods - Twilight Grove',
    evolutions: ['Void Stalker', 'Abyss Cat']
  },
  {
    id: '5',
    name: 'Zephyr',
    species: 'Storm Eagle',
    type: 'air',
    level: 26,
    experience: 7200,
    maxExperience: 8500,
    rarity: 'epic',
    icon: '🦅',
    color: '#aa44ff',
    contracted: true,
    inSquad: false,
    stats: { authority: 90, order: 78, animus: 82, invictus: 85, myth: 80 },
    health: 650,
    maxHealth: 700,
    energy: 420,
    maxEnergy: 480,
    abilities: ['Lightning Strike', 'Wind Slash', 'Thunder Call', 'Storm Flight'],
    lore: 'Majestic rulers of the skies, Storm Eagles command the winds and lightning with their piercing cries.',
    discoveredAt: 'Thunder Valley - Sky Fortress',
    evolutions: ['Thunder Lord', 'Tempest Phoenix']
  },
  {
    id: '6',
    name: 'Shimmer',
    species: 'Light Sprite',
    type: 'light',
    level: 18,
    experience: 2800,
    maxExperience: 3500,
    rarity: 'uncommon',
    icon: '✨',
    color: '#ffdd44',
    contracted: true,
    inSquad: false,
    stats: { authority: 65, order: 88, animus: 95, invictus: 60, myth: 98 },
    health: 350,
    maxHealth: 400,
    energy: 480,
    maxEnergy: 500,
    abilities: ['Heal Light', 'Blinding Flash', 'Holy Barrier', 'Purify'],
    lore: 'Benevolent spirits of pure light, these creatures bring healing and hope to those in need.',
    discoveredAt: 'World Tree - Sacred Grove',
    evolutions: ['Radiant Angel', 'Seraph']
  }
];

const RARITY_COLORS = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
  mythic: '#ef4444'
};

const TYPE_COLORS = {
  fire: '#ff4444',
  ice: '#4488ff',
  earth: '#44aa44',
  air: '#aa44ff',
  shadow: '#888888',
  light: '#ffdd44'
};

const STAT_ICONS = {
  authority: Sword,
  order: Shield,
  animus: Heart,
  invictus: Star,
  myth: Brain
};

export const CreatureCollectionPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [pinnedCreature, setPinnedCreature] = useState<string | null>(null);

  const filteredCreatures = CREATURE_COLLECTION.filter(creature => {
    const matchesSearch = creature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creature.species.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'squad') return matchesSearch && creature.inSquad;
    if (selectedFilter === 'contracted') return matchesSearch && creature.contracted;
    return matchesSearch && creature.type === selectedFilter;
  });

  const renderCreatureCard = (creature: Creature) => {
    const experiencePercent = (creature.experience / creature.maxExperience) * 100;
    const healthPercent = (creature.health / creature.maxHealth) * 100;
    const energyPercent = (creature.energy / creature.maxEnergy) * 100;

    return (
      <div className="group border border-gray-700 bg-gray-900/50 hover:bg-blue-accent hover:bg-opacity-20 hover:border-blue-accent hover-transition">
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className="relative">
              <div 
                className="w-12 h-12 flex items-center justify-center border-2 bg-gray-800"
                style={{ borderColor: creature.color }}
              >
                <span className="text-2xl">{creature.icon}</span>
              </div>
              {creature.inSquad && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 border border-black" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-mono text-white group-hover:text-bg-canvas hover-transition truncate">{creature.name}</h4>
                <Badge 
                  variant="outline" 
                  className="text-xs border-gray-600"
                  style={{ 
                    borderColor: RARITY_COLORS[creature.rarity],
                    color: RARITY_COLORS[creature.rarity]
                  }}
                >
                  {creature.rarity.toUpperCase()}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-400 font-mono mb-2 group-hover:text-bg-canvas hover-transition">{creature.species}</div>
              
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-gray-300 group-hover:text-bg-canvas hover-transition">LV.{creature.level}</span>
                <div 
                  className="px-2 py-1 border text-center min-w-[60px]"
                  style={{ 
                    borderColor: TYPE_COLORS[creature.type],
                    color: TYPE_COLORS[creature.type]
                  }}
                >
                  {creature.type.toUpperCase()}
                </div>
              </div>

              {/* Quick stats bars */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400 w-8 group-hover:text-bg-canvas hover-transition">HP</div>
                  <div className="flex-1 h-1 bg-gray-800 border border-gray-700">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        width: `${healthPercent}%`,
                        backgroundColor: healthPercent > 50 ? '#00ff88' : '#ff4444'
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 w-16 text-right group-hover:text-bg-canvas hover-transition">
                    {creature.health}/{creature.maxHealth}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-xs text-gray-400 w-8 group-hover:text-bg-canvas hover-transition">EN</div>
                  <div className="flex-1 h-1 bg-gray-800 border border-gray-700">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${energyPercent}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 w-16 text-right group-hover:text-bg-canvas hover-transition">
                    {creature.energy}/{creature.maxEnergy}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailedView = (creature: Creature) => (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div 
          className="w-16 h-16 flex items-center justify-center border-2 bg-gray-800"
          style={{ borderColor: creature.color }}
        >
          <span className="text-4xl">{creature.icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-mono text-white">{creature.name}</h3>
          <p className="text-gray-400 font-mono">{creature.species}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                borderColor: RARITY_COLORS[creature.rarity],
                color: RARITY_COLORS[creature.rarity]
              }}
            >
              {creature.rarity.toUpperCase()}
            </Badge>
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ 
                borderColor: TYPE_COLORS[creature.type],
                color: TYPE_COLORS[creature.type]
              }}
            >
              {creature.type.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border border-gray-700">
          <TabsTrigger value="stats" className="data-[state=active]:bg-gray-700 text-gray-300">Stats</TabsTrigger>
          <TabsTrigger value="abilities" className="data-[state=active]:bg-gray-700 text-gray-300">Abilities</TabsTrigger>
          <TabsTrigger value="lore" className="data-[state=active]:bg-gray-700 text-gray-300">Lore</TabsTrigger>
          <TabsTrigger value="evolution" className="data-[state=active]:bg-gray-700 text-gray-300">Evolution</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-mono text-gray-300 mb-2">CORE ATTRIBUTES</div>
              <div className="space-y-2">
                {Object.entries(creature.stats).map(([stat, value]) => {
                  const Icon = STAT_ICONS[stat as keyof typeof STAT_ICONS];
                  return (
                    <div key={stat} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-gray-400" />
                      <div className="text-sm font-mono text-white w-20 uppercase">{stat}</div>
                      <Progress value={value} className="flex-1 h-2" />
                      <div className="text-sm font-mono text-gray-300 w-8">{value}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-sm font-mono text-gray-300 mb-2">VITAL STATS</div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">HEALTH</span>
                    <span className="text-white">{creature.health}/{creature.maxHealth}</span>
                  </div>
                  <Progress value={(creature.health / creature.maxHealth) * 100} className="h-2 mt-1" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">ENERGY</span>
                    <span className="text-white">{creature.energy}/{creature.maxEnergy}</span>
                  </div>
                  <Progress value={(creature.energy / creature.maxEnergy) * 100} className="h-2 mt-1" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">EXPERIENCE</span>
                    <span className="text-white">{creature.experience}/{creature.maxExperience}</span>
                  </div>
                  <Progress value={(creature.experience / creature.maxExperience) * 100} className="h-2 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="abilities" className="space-y-3">
          {creature.abilities.map((ability, index) => (
            <div key={index} className="border border-gray-700 p-3 bg-gray-800/50">
              <h4 className="font-mono text-white mb-1">{ability}</h4>
              <p className="text-sm text-gray-400 font-mono">
                Powerful ability learned through combat experience and training.
              </p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="lore" className="space-y-3">
          <div className="border border-gray-700 p-4 bg-gray-800/50">
            <p className="text-sm text-gray-300 font-mono leading-relaxed">{creature.lore}</p>
          </div>
          <div className="text-xs font-mono text-gray-500">
            <div>DISCOVERED: {creature.discoveredAt}</div>
            <div>CONTRACT DATE: 2157.03.15</div>
          </div>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-3">
          {creature.evolutions ? (
            creature.evolutions.map((evolution, index) => (
              <div key={index} className="border border-gray-700 p-3 bg-gray-800/50">
                <h4 className="font-mono text-white mb-1">{evolution}</h4>
                <p className="text-sm text-gray-400 font-mono">
                  Next evolutionary stage - Requires level {creature.level + 10}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 font-mono py-8">
              NO KNOWN EVOLUTIONS
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-700 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-mono text-green-400 uppercase">Creature Collection</h3>
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            {filteredCreatures.length} Found
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search creatures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 text-gray-100 font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex gap-1 mt-2 overflow-x-auto">
          {['all', 'squad', 'contracted', 'fire', 'ice', 'earth', 'air', 'shadow', 'light'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`
                px-3 py-1 text-xs font-mono border whitespace-nowrap
                ${selectedFilter === filter 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                }
              `}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Creature Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-1 gap-2">
          {filteredCreatures.map((creature) => (
            <Popover key={creature.id}>
              <PopoverTrigger asChild>
                <button className="text-left w-full">
                  {renderCreatureCard(creature)}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                side="right" 
                className="w-96 max-h-[500px] overflow-y-auto bg-gray-900 border-gray-600 p-0"
                sideOffset={8}
              >
                {renderDetailedView(creature)}
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  );
};