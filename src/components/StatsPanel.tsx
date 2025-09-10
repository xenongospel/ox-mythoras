import React from 'react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Zap, Grid3x3, Trophy, Star, Brain } from 'lucide-react';

interface TechnicianStats {
  level: number;
  experience: number;
  maxExperience: number;
  gridTokens: number;
  maxGridTokens: number;
  usedGridTokens: number;
  masteryPoints: number;
  contractedCreatures: number;
  maxCreatures: number;
}

const TECHNICIAN_DATA: TechnicianStats = {
  level: 47,
  experience: 125400,
  maxExperience: 145000,
  gridTokens: 470, // 10 tokens per level
  maxGridTokens: 470,
  usedGridTokens: 380,
  masteryPoints: 23,
  contractedCreatures: 6,
  maxCreatures: 8
};

const MASTERY_CATEGORIES = [
  { name: 'Combat Efficiency', value: 8, max: 10, color: '#ff4444' },
  { name: 'Creature Bonding', value: 6, max: 10, color: '#44aa44' },
  { name: 'Tactical Analysis', value: 5, max: 10, color: '#4488ff' },
  { name: 'Resource Management', value: 4, max: 10, color: '#ffaa44' }
];

const PROGRESSION_MILESTONES = [
  { level: 50, reward: 'New Creature Slot', unlocked: false },
  { level: 75, reward: 'Advanced Contracts', unlocked: false },
  { level: 100, reward: 'Master Technician', unlocked: false },
  { level: 124, reward: 'Apex Authority', unlocked: false }
];

export const StatsPanel: React.FC = () => {
  const experiencePercent = (TECHNICIAN_DATA.experience / TECHNICIAN_DATA.maxExperience) * 100;
  const gridTokenPercent = ((TECHNICIAN_DATA.gridTokens - TECHNICIAN_DATA.usedGridTokens) / TECHNICIAN_DATA.gridTokens) * 100;
  const progressToNext = TECHNICIAN_DATA.level / 124 * 100;

  return (
    <div className="h-full p-3 bg-gray-900 space-y-4 overflow-y-auto">
      {/* Technician Identity */}
      <div className="text-center border-b border-gray-700 pb-3">
        <div className="text-xl font-bold text-green-400 font-mono">TECHNICIAN</div>
        <div className="text-sm text-gray-400 font-mono">Classification: Field Operator</div>
        <Badge 
          variant="outline" 
          className="mt-2 bg-green-600/20 border-green-500 text-green-300"
        >
          Level {TECHNICIAN_DATA.level}
        </Badge>
      </div>

      {/* Core Progression */}
      <div className="space-y-3">
        <h3 className="text-sm font-mono text-green-400 border-b border-gray-700 pb-1">
          CORE SYSTEMS
        </h3>
        
        {/* Experience */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-mono text-gray-300">Experience</span>
            </div>
            <span className="text-sm text-gray-300 font-mono">
              {TECHNICIAN_DATA.experience.toLocaleString()}/{TECHNICIAN_DATA.maxExperience.toLocaleString()}
            </span>
          </div>
          <Progress value={experiencePercent} className="h-2" />
          <div className="text-xs text-gray-500 font-mono">
            To Level {TECHNICIAN_DATA.level + 1}: {(TECHNICIAN_DATA.maxExperience - TECHNICIAN_DATA.experience).toLocaleString()} XP
          </div>
        </div>

        {/* Grid Tokens */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-mono text-gray-300">Grid Tokens</span>
            </div>
            <span className="text-sm text-gray-300 font-mono">
              {TECHNICIAN_DATA.gridTokens - TECHNICIAN_DATA.usedGridTokens}/{TECHNICIAN_DATA.gridTokens}
            </span>
          </div>
          <Progress value={gridTokenPercent} className="h-2" />
          <div className="text-xs text-gray-500 font-mono">
            Used: {TECHNICIAN_DATA.usedGridTokens} • Available: {TECHNICIAN_DATA.gridTokens - TECHNICIAN_DATA.usedGridTokens}
          </div>
        </div>

        {/* Mastery Points */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono text-gray-300">Mastery Points</span>
            </div>
            <span className="text-sm text-yellow-300 font-mono">
              {TECHNICIAN_DATA.masteryPoints}
            </span>
          </div>
        </div>
      </div>

      {/* Operational Status */}
      <div className="space-y-2">
        <h3 className="text-sm font-mono text-green-400 border-b border-gray-700 pb-1">
          OPERATIONAL STATUS
        </h3>
        
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-gray-800/50 border border-gray-700 p-2">
            <div className="text-gray-400">CONTRACTED</div>
            <div className="text-white text-lg">
              {TECHNICIAN_DATA.contractedCreatures}/{TECHNICIAN_DATA.maxCreatures}
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 p-2">
            <div className="text-gray-400">MASTERY</div>
            <div className="text-white text-lg">
              {TECHNICIAN_DATA.masteryPoints}
            </div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 p-2">
            <div className="text-gray-400">EFFICIENCY</div>
            <div className="text-green-400 text-lg">94%</div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 p-2">
            <div className="text-gray-400">SYNC RATE</div>
            <div className="text-blue-400 text-lg">87%</div>
          </div>
        </div>
      </div>

      {/* Mastery Breakdown */}
      <div className="space-y-2">
        <h3 className="text-sm font-mono text-green-400 border-b border-gray-700 pb-1">
          MASTERY ANALYSIS
        </h3>
        
        {MASTERY_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-gray-300">{category.name}</span>
              <span className="text-xs font-mono text-gray-400">
                {category.value}/{category.max}
              </span>
            </div>
            <div className="h-1 bg-gray-800 border border-gray-700">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${(category.value / category.max) * 100}%`,
                  backgroundColor: category.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Progression Milestones */}
      <div className="space-y-2">
        <h3 className="text-sm font-mono text-green-400 border-b border-gray-700 pb-1">
          PROGRESSION
        </h3>
        
        <div className="space-y-2">
          <div className="text-xs font-mono text-gray-400">
            Progress to Max Level: {progressToNext.toFixed(1)}%
          </div>
          <Progress value={progressToNext} className="h-1" />
        </div>
        
        <div className="space-y-2">
          {PROGRESSION_MILESTONES.map((milestone) => (
            <div 
              key={milestone.level} 
              className={`
                flex items-center justify-between text-xs font-mono p-2 border
                ${TECHNICIAN_DATA.level >= milestone.level 
                  ? 'border-green-600 bg-green-600/10 text-green-300' 
                  : 'border-gray-700 bg-gray-800/30 text-gray-400'
                }
              `}
            >
              <span>Level {milestone.level}</span>
              <span>{milestone.reward}</span>
              <span>{TECHNICIAN_DATA.level >= milestone.level ? '✓' : '○'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="space-y-2 border-t border-gray-700 pt-3">
        <h3 className="text-sm font-mono text-green-400 pb-1">
          SYSTEM INFO
        </h3>
        <div className="text-xs font-mono text-gray-500 space-y-1">
          <div>Grid Tokens: 10 per level (Max: 1,240)</div>
          <div>Max Creatures: Based on mastery</div>
          <div>Sync Rate: Creature compatibility</div>
          <div>Authority Level: {Math.floor(TECHNICIAN_DATA.level / 25) + 1}/5</div>
        </div>
      </div>
    </div>
  );
};