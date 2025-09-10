import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface GearModifier {
  id: string;
  type: 'prefix' | 'suffix' | 'implicit';
  stat: string;
  value: number | string;
  tier: number;
}

interface GearItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  slot: 'main_hand' | 'off_hand' | 'body_armor' | 'helmet' | 'gloves' | 'boots' | 'belt' | 'ring_1' | 'ring_2' | 'amulet';
  rarity: 'normal' | 'magic' | 'rare' | 'unique' | 'legendary';
  itemLevel: number;
  baseType: string;
  icon: string;
  modifiers: GearModifier[];
  requirements?: {
    level: number;
    authority?: number;
    order?: number;
    animus?: number;
    invictus?: number;
    myth?: number;
  };
}

const RARITY_COLORS = {
  normal: '#c8c8c8',
  magic: '#8888ff',
  rare: '#ffff77',
  unique: '#af6025',
  legendary: '#aa0000'
};

const EQUIPPED_GEAR: { [key: string]: GearItem | null } = {
  main_hand: {
    id: 'weapon_1',
    name: 'Searing Edge',
    type: 'weapon',
    slot: 'main_hand',
    rarity: 'rare',
    itemLevel: 45,
    baseType: 'Crystalline Blade',
    icon: '⚔️',
    requirements: { level: 40, invictus: 75, authority: 50 },
    modifiers: [
      { id: '1', type: 'prefix', stat: 'Physical Damage', value: '+25%', tier: 3 },
      { id: '2', type: 'prefix', stat: 'Fire Damage', value: '15-30', tier: 2 },
      { id: '3', type: 'suffix', stat: 'Critical Strike Chance', value: '+12%', tier: 2 },
      { id: '4', type: 'suffix', stat: 'Attack Speed', value: '+8%', tier: 1 },
      { id: '5', type: 'implicit', stat: 'Ignites Enemies', value: 'On Critical Strike', tier: 1 }
    ]
  },
  body_armor: {
    id: 'armor_1',
    name: 'Technician\'s Harness',
    type: 'armor',
    slot: 'body_armor',
    rarity: 'unique',
    itemLevel: 52,
    baseType: 'Reinforced Vest',
    icon: '🛡️',
    requirements: { level: 48, order: 80 },
    modifiers: [
      { id: '6', type: 'prefix', stat: 'Maximum Health', value: '+180', tier: 4 },
      { id: '7', type: 'prefix', stat: 'Physical Damage Reduction', value: '+15%', tier: 3 },
      { id: '8', type: 'suffix', stat: 'Creature Sync Rate', value: '+25%', tier: 4 },
      { id: '9', type: 'suffix', stat: 'Grid Token Efficiency', value: '+10%', tier: 3 },
      { id: '10', type: 'implicit', stat: 'Creatures gain', value: '+5% All Resistances', tier: 1 }
    ]
  },
  ring_1: {
    id: 'ring_1',
    name: 'Band of Command',
    type: 'accessory',
    slot: 'ring_1',
    rarity: 'magic',
    itemLevel: 35,
    baseType: 'Gold Ring',
    icon: '💍',
    requirements: { level: 30, authority: 60 },
    modifiers: [
      { id: '11', type: 'prefix', stat: 'Authority', value: '+15', tier: 2 },
      { id: '12', type: 'suffix', stat: 'Creature Damage', value: '+8%', tier: 2 }
    ]
  },
  amulet: {
    id: 'amulet_1',
    name: 'Conduit of Binding',
    type: 'accessory',
    slot: 'amulet',
    rarity: 'legendary',
    itemLevel: 60,
    baseType: 'Mystic Pendant',
    icon: '📿',
    requirements: { level: 55, myth: 90, animus: 80 },
    modifiers: [
      { id: '13', type: 'prefix', stat: 'Maximum Creatures', value: '+1', tier: 5 },
      { id: '14', type: 'prefix', stat: 'Animus', value: '+20', tier: 4 },
      { id: '15', type: 'prefix', stat: 'M.Y.T.H', value: '+25', tier: 4 },
      { id: '16', type: 'suffix', stat: 'Creature Evolution Speed', value: '+50%', tier: 4 },
      { id: '17', type: 'suffix', stat: 'Contract Success Rate', value: '+15%', tier: 3 },
      { id: '18', type: 'implicit', stat: 'Enables Dual Contracts', value: 'Same Species', tier: 1 }
    ]
  }
};

const GEAR_SLOTS = [
  { id: 'main_hand', name: 'Main Hand', icon: '⚔️', x: 1, y: 1 },
  { id: 'off_hand', name: 'Off Hand', icon: '🛡️', x: 3, y: 1 },
  { id: 'helmet', name: 'Helmet', icon: '⛑️', x: 2, y: 0 },
  { id: 'body_armor', name: 'Body Armor', icon: '🦺', x: 2, y: 1 },
  { id: 'gloves', name: 'Gloves', icon: '🧤', x: 0, y: 1 },
  { id: 'boots', name: 'Boots', icon: '🥾', x: 2, y: 2 },
  { id: 'belt', name: 'Belt', icon: '🔗', x: 2, y: 1.5 },
  { id: 'ring_1', name: 'Ring', icon: '💍', x: 0, y: 2 },
  { id: 'ring_2', name: 'Ring', icon: '💍', x: 4, y: 2 },
  { id: 'amulet', name: 'Amulet', icon: '📿', x: 2, y: -0.5 }
];

export const GearPanel: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<GearItem | null>(null);

  const renderGearSlot = (slot: typeof GEAR_SLOTS[0]) => {
    const equippedItem = EQUIPPED_GEAR[slot.id];
    
    return (
      <TooltipProvider key={slot.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`
                group w-12 h-12 border-2 flex items-center justify-center cursor-pointer transition-all
                ${equippedItem 
                  ? 'border-gray-500 bg-gray-800 hover:border-blue-accent hover:bg-blue-accent hover:bg-opacity-20' 
                  : 'border-gray-700 bg-gray-900 hover:border-blue-accent hover:bg-blue-accent hover:bg-opacity-20'
                }
              `}
              style={{
                gridColumn: slot.x + 1,
                gridRow: slot.y + 1
              }}
              onClick={() => equippedItem && setSelectedItem(equippedItem)}
            >
              {equippedItem ? (
                <span className="text-xl group-hover:text-white hover-transition">{equippedItem.icon}</span>
              ) : (
                <span className="text-gray-600 text-sm group-hover:text-white hover-transition">{slot.icon}</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="max-w-xs bg-gray-900 border-gray-600 p-0"
          >
            {equippedItem ? renderItemTooltip(equippedItem) : (
              <div className="p-2">
                <div className="text-gray-400 font-mono text-sm">{slot.name}</div>
                <div className="text-xs text-gray-500">Empty Slot</div>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderItemTooltip = (item: GearItem) => (
    <div className="p-3 space-y-2">
      <div>
        <h4 
          className="font-mono font-bold"
          style={{ color: RARITY_COLORS[item.rarity] }}
        >
          {item.name}
        </h4>
        <div className="text-xs text-gray-400 font-mono">{item.baseType}</div>
        <div className="text-xs text-gray-500 font-mono">Item Level: {item.itemLevel}</div>
      </div>

      {item.requirements && (
        <div className="border-t border-gray-700 pt-2">
          <div className="text-xs text-gray-400 mb-1">Requirements:</div>
          <div className="text-xs text-gray-300 font-mono space-y-1">
            <div>Level: {item.requirements.level}</div>
            {Object.entries(item.requirements).map(([attr, value]) => {
              if (attr === 'level' || !value) return null;
              return (
                <div key={attr}>
                  {attr.charAt(0).toUpperCase() + attr.slice(1)}: {value}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-gray-700 pt-2 space-y-1">
        {item.modifiers.map((mod) => (
          <div 
            key={mod.id} 
            className={`text-xs font-mono ${
              mod.type === 'implicit' 
                ? 'text-blue-300' 
                : mod.type === 'prefix' 
                  ? 'text-yellow-300' 
                  : 'text-green-300'
            }`}
          >
            {mod.stat}: {mod.value}
          </div>
        ))}
      </div>
    </div>
  );

  const calculateTotalStats = () => {
    const totals: { [key: string]: number } = {};
    
    Object.values(EQUIPPED_GEAR).forEach(item => {
      if (item) {
        item.modifiers.forEach(mod => {
          const statName = mod.stat;
          const value = typeof mod.value === 'string' ? 
            parseInt(mod.value.replace(/[^0-9-]/g, '')) || 0 : mod.value;
          
          if (!isNaN(value)) {
            totals[statName] = (totals[statName] || 0) + value;
          }
        });
      }
    });
    
    return totals;
  };

  const totalStats = calculateTotalStats();

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="border-b border-gray-700 p-3">
        <h3 className="text-green-400 font-mono uppercase">Equipment</h3>
      </div>

      <Tabs defaultValue="equipment" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 bg-gray-800 border-b border-gray-700">
          <TabsTrigger value="equipment" className="data-[state=active]:bg-gray-700 text-gray-300">
            Equipment
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-gray-700 text-gray-300">
            Stats Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="flex-1 p-4">
          {/* Equipment Grid */}
          <div 
            className="grid gap-2 mb-4"
            style={{ 
              gridTemplateColumns: 'repeat(5, 1fr)',
              gridTemplateRows: 'repeat(4, 1fr)'
            }}
          >
            {GEAR_SLOTS.map(renderGearSlot)}
          </div>

          {/* Selected Item Details */}
          {selectedItem && (
            <div className="border-t border-gray-700 pt-4">
              <div className="bg-gray-800/50 border border-gray-700 p-3">
                {renderItemTooltip(selectedItem)}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-3">
            <h4 className="text-sm font-mono text-green-400 border-b border-gray-700 pb-1">
              Equipment Bonuses
            </h4>
            
            <div className="space-y-2">
              {Object.entries(totalStats).map(([stat, value]) => (
                <div key={stat} className="flex justify-between text-sm font-mono">
                  <span className="text-gray-300">{stat}:</span>
                  <span className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                    {value > 0 ? '+' : ''}{value}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-3">
              <h4 className="text-sm font-mono text-green-400 mb-2">Equipped Items</h4>
              <div className="space-y-2">
                {Object.values(EQUIPPED_GEAR).map(item => item && (
                  <div key={item.id} className="text-xs font-mono">
                    <span 
                      className="font-bold"
                      style={{ color: RARITY_COLORS[item.rarity] }}
                    >
                      {item.name}
                    </span>
                    <span className="text-gray-500 ml-2">({item.baseType})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};