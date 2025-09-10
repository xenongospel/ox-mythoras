import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sword, Shield, Zap, Heart, Eye, Target, RotateCcw } from 'lucide-react';

interface CreatureStats {
  authority: number;
  order: number;
  animus: number;
  invictus: number;
  myth: number;
}

interface Creature {
  id: string;
  name: string;
  type: string;
  level: number;
  health: number;
  maxHealth: number;
  bandwidth: number;
  maxBandwidth: number;
  stats: CreatureStats;
  abilities: string[];
  icon: string;
  color: string;
}

interface CombatAction {
  id: string;
  name: string;
  type: 'attack' | 'defend' | 'special' | 'item';
  cost: number;
  description: string;
  damage?: number;
  effect?: string;
}

const WILD_CREATURES: Creature[] = [
  {
    id: 'wild-1',
    name: 'Feral Prowler',
    type: 'Shadow',
    level: 15,
    health: 240,
    maxHealth: 240,
    bandwidth: 120,
    maxBandwidth: 120,
    stats: { authority: 45, order: 60, animus: 80, invictus: 55, myth: 70 },
    abilities: ['Shadow Strike', 'Stealth', 'Pounce'],
    icon: '🐾',
    color: '#666666'
  },
  {
    id: 'wild-2',
    name: 'Ember Sprite',
    type: 'Fire',
    level: 12,
    health: 180,
    maxHealth: 180,
    bandwidth: 140,
    maxBandwidth: 140,
    stats: { authority: 40, order: 50, animus: 90, invictus: 35, myth: 85 },
    abilities: ['Fireball', 'Burn', 'Heat Wave'],
    icon: '🔥',
    color: '#ff4444'
  },
  {
    id: 'wild-3',
    name: 'Crystal Guardian',
    type: 'Earth',
    level: 18,
    health: 320,
    maxHealth: 320,
    bandwidth: 80,
    maxBandwidth: 80,
    stats: { authority: 60, order: 85, animus: 55, invictus: 90, myth: 60 },
    abilities: ['Stone Throw', 'Fortress', 'Earthquake'],
    icon: '💎',
    color: '#44aa44'
  }
];

const COMBAT_ACTIONS: CombatAction[] = [
  {
    id: 'attack',
    name: 'Basic Attack',
    type: 'attack',
    cost: 10,
    description: 'Standard physical attack',
    damage: 25
  },
  {
    id: 'power-strike',
    name: 'Power Strike',
    type: 'attack',
    cost: 20,
    description: 'Heavy attack with increased damage',
    damage: 45
  },
  {
    id: 'defend',
    name: 'Defend',
    type: 'defend',
    cost: 5,
    description: 'Reduce incoming damage by 50%',
    effect: 'Defense +50%'
  },
  {
    id: 'special-ability',
    name: 'Special Ability',
    type: 'special',
    cost: 30,
    description: 'Use creature\'s unique ability',
    damage: 60,
    effect: 'Special effect'
  }
];

export const ScoutingPanel: React.FC = () => {
  const [selectedCreature, setSelectedCreature] = useState<Creature | null>(null);
  const [inCombat, setInCombat] = useState(false);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [playerCreature, setPlayerCreature] = useState<Creature | null>(null);
  const [enemyCreature, setEnemyCreature] = useState<Creature | null>(null);
  const [selectedAction, setSelectedAction] = useState<CombatAction | null>(null);

  const startCombat = (wildCreature: Creature) => {
    // Use first creature from squad as player creature
    const playerCreatureData: Creature = {
      id: 'player-1',
      name: 'Pyraxis',
      type: 'Fire',
      level: 27,
      health: 850,
      maxHealth: 850,
      bandwidth: 420,
      maxBandwidth: 420,
      stats: { authority: 85, order: 72, animus: 90, invictus: 88, myth: 95 },
      abilities: ['Flame Breath', 'Wing Buffet', 'Molten Armor'],
      icon: '🐉',
      color: '#ff4444'
    };

    setPlayerCreature(playerCreatureData);
    setEnemyCreature({ ...wildCreature });
    setInCombat(true);
    setTurn('player');
    setCombatLog([`Combat started! ${playerCreatureData.name} vs ${wildCreature.name}`]);
  };

  const executeAction = (action: CombatAction) => {
    if (!playerCreature || !enemyCreature) return;

    let newLog = [...combatLog];
    let newPlayerCreature = { ...playerCreature };
    let newEnemyCreature = { ...enemyCreature };

    // Player action
    if (turn === 'player') {
      newPlayerCreature.bandwidth -= action.cost;
      
      if (action.type === 'attack' && action.damage) {
        newEnemyCreature.health = Math.max(0, newEnemyCreature.health - action.damage);
        newLog.push(`${playerCreature.name} used ${action.name} for ${action.damage} damage!`);
      } else if (action.type === 'defend') {
        newLog.push(`${playerCreature.name} takes a defensive stance!`);
      } else if (action.type === 'special') {
        newEnemyCreature.health = Math.max(0, newEnemyCreature.health - (action.damage || 0));
        newLog.push(`${playerCreature.name} used ${action.name}!`);
      }

      // Check if enemy is defeated
      if (newEnemyCreature.health <= 0) {
        newLog.push(`${enemyCreature.name} has been defeated!`);
        newLog.push(`Victory! You can now attempt to contract with ${enemyCreature.name}.`);
        setInCombat(false);
      } else {
        setTurn('enemy');
      }
    }

    setPlayerCreature(newPlayerCreature);
    setEnemyCreature(newEnemyCreature);
    setCombatLog(newLog);
    setSelectedAction(null);

    // Enemy turn after a delay
    if (turn === 'player' && newEnemyCreature.health > 0) {
      setTimeout(() => {
        const enemyAction = COMBAT_ACTIONS[Math.floor(Math.random() * COMBAT_ACTIONS.length)];
        let enemyLog = [...newLog];
        let finalPlayerCreature = { ...newPlayerCreature };

        if (enemyAction.type === 'attack' && enemyAction.damage) {
          finalPlayerCreature.health = Math.max(0, finalPlayerCreature.health - enemyAction.damage);
          enemyLog.push(`${newEnemyCreature.name} used ${enemyAction.name} for ${enemyAction.damage} damage!`);
        }

        if (finalPlayerCreature.health <= 0) {
          enemyLog.push(`${playerCreature.name} has been defeated!`);
          enemyLog.push(`Defeat! Retreat to recover.`);
          setInCombat(false);
        }

        setPlayerCreature(finalPlayerCreature);
        setCombatLog(enemyLog);
        setTurn('player');
      }, 1500);
    }
  };

  const resetCombat = () => {
    setInCombat(false);
    setPlayerCreature(null);
    setEnemyCreature(null);
    setCombatLog([]);
    setTurn('player');
    setSelectedAction(null);
  };

  const renderCreatureCard = (creature: Creature, isWild: boolean = false) => {
    const healthPercent = (creature.health / creature.maxHealth) * 100;
    const bandwidthPercent = (creature.bandwidth / creature.maxBandwidth) * 100;

    return (
      <div className="border border-gray-700 bg-gray-900/50 p-3">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="w-12 h-12 flex items-center justify-center border-2 bg-gray-800"
            style={{ borderColor: creature.color }}
          >
            <span className="text-2xl">{creature.icon}</span>
          </div>
          <div>
            <h4 className="font-mono text-white">{creature.name}</h4>
            <p className="text-sm text-gray-400">{creature.type} • Level {creature.level}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Health</span>
              <span>{creature.health}/{creature.maxHealth}</span>
            </div>
            <Progress value={healthPercent} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Bandwidth</span>
              <span>{creature.bandwidth}/{creature.maxBandwidth}</span>
            </div>
            <Progress value={bandwidthPercent} className="h-2" />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-5 gap-1 text-xs">
          <div className="text-center">
            <div className="text-gray-400">AUT</div>
            <div className="text-white font-mono">{creature.stats.authority}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">ORD</div>
            <div className="text-white font-mono">{creature.stats.order}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">ANI</div>
            <div className="text-white font-mono">{creature.stats.animus}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">INV</div>
            <div className="text-white font-mono">{creature.stats.invictus}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400">MYT</div>
            <div className="text-white font-mono">{creature.stats.myth}</div>
          </div>
        </div>

        {isWild && !inCombat && (
          <Button 
            className="w-full mt-3 bg-red-700 hover:bg-red-600"
            onClick={() => startCombat(creature)}
          >
            <Sword className="w-4 h-4 mr-2" />
            ENGAGE
          </Button>
        )}
      </div>
    );
  };

  if (inCombat && playerCreature && enemyCreature) {
    return (
      <div className="h-full bg-gray-900 flex flex-col">
        <div className="border-b border-gray-700 p-3">
          <h3 className="text-green-400 font-mono uppercase">Combat Engine</h3>
        </div>

        <div className="flex-1 flex">
          {/* Player Side */}
          <div className="flex-1 p-3 border-r border-gray-700">
            <div className="text-sm text-green-400 mb-2 font-mono">YOUR CREATURE</div>
            {renderCreatureCard(playerCreature)}
          </div>

          {/* Enemy Side */}
          <div className="flex-1 p-3">
            <div className="text-sm text-red-400 mb-2 font-mono">WILD CREATURE</div>
            {renderCreatureCard(enemyCreature)}
          </div>
        </div>

        {/* Combat Actions */}
        <div className="border-t border-gray-700 p-3 max-h-[200px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-mono text-gray-300">
              {turn === 'player' ? 'YOUR TURN' : 'ENEMY TURN'}
            </h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetCombat}
              className="bg-gray-800 border-gray-600 text-gray-300"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              RETREAT
            </Button>
          </div>

          {turn === 'player' && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {COMBAT_ACTIONS.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  disabled={playerCreature.bandwidth < action.cost}
                  onClick={() => executeAction(action)}
                  className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <span className="mr-2">
                    {action.type === 'attack' && <Sword className="w-3 h-3" />}
                    {action.type === 'defend' && <Shield className="w-3 h-3" />}
                    {action.type === 'special' && <Zap className="w-3 h-3" />}
                  </span>
                  {action.name}
                  <span className="ml-auto text-xs">-{action.cost}</span>
                </Button>
              ))}
            </div>
          )}

          {/* Combat Log */}
          <div className="bg-black/50 border border-gray-700 p-2 h-20 overflow-y-auto">
            <div className="text-xs font-mono text-gray-300 space-y-1">
              {combatLog.slice(-3).map((log, index) => (
                <div key={index}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="border-b border-gray-700 p-3">
        <h3 className="text-green-400 font-mono uppercase">Area Scouting</h3>
        <p className="text-xs text-gray-400 font-mono">Training Grounds - Wild Creature Encounters</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          <div className="text-sm font-mono text-gray-300 mb-3">
            DETECTED CREATURES
          </div>
          
          {WILD_CREATURES.map((creature) => (
            <div key={creature.id}>
              {renderCreatureCard(creature, true)}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-700 p-3">
        <div className="text-xs font-mono text-gray-500 space-y-1">
          <div>• Engage creatures to test your squad</div>
          <div>• Victory allows contract negotiation</div>
          <div>• Defeat forces retreat to recover</div>
        </div>
      </div>
    </div>
  );
};