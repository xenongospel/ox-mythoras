import React, { useState } from 'react';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Skill {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  icon: string;
  category: 'combat' | 'crafting' | 'gathering' | 'magic';
}

const SKILLS: Skill[] = [
  // Combat Skills
  { id: '1', name: 'Swordsmanship', level: 34, experience: 8500, maxExperience: 10000, icon: '⚔️', category: 'combat' },
  { id: '2', name: 'Archery', level: 28, experience: 4200, maxExperience: 6500, icon: '🏹', category: 'combat' },
  { id: '3', name: 'Defense', level: 31, experience: 7100, maxExperience: 8800, icon: '🛡️', category: 'combat' },
  
  // Magic Skills
  { id: '4', name: 'Fire Magic', level: 25, experience: 3400, maxExperience: 5200, icon: '🔥', category: 'magic' },
  { id: '5', name: 'Ice Magic', level: 22, experience: 2100, maxExperience: 4100, icon: '❄️', category: 'magic' },
  { id: '6', name: 'Healing', level: 29, experience: 5800, maxExperience: 7200, icon: '✨', category: 'magic' },
  
  // Crafting Skills
  { id: '7', name: 'Blacksmithing', level: 18, experience: 1900, maxExperience: 3000, icon: '🔨', category: 'crafting' },
  { id: '8', name: 'Alchemy', level: 23, experience: 2800, maxExperience: 4500, icon: '⚗️', category: 'crafting' },
  { id: '9', name: 'Enchanting', level: 15, experience: 1200, maxExperience: 2200, icon: '🌟', category: 'crafting' },
  
  // Gathering Skills
  { id: '10', name: 'Mining', level: 26, experience: 4100, maxExperience: 5800, icon: '⛏️', category: 'gathering' },
  { id: '11', name: 'Herbalism', level: 21, experience: 2500, maxExperience: 3800, icon: '🌿', category: 'gathering' },
  { id: '12', name: 'Fishing', level: 19, experience: 2200, maxExperience: 3200, icon: '🎣', category: 'gathering' }
];

const CATEGORY_COLORS = {
  combat: 'text-red-300',
  magic: 'text-blue-300',
  crafting: 'text-yellow-300',
  gathering: 'text-green-300'
};

export const SkillsPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getFilteredSkills = (category: string) => {
    if (category === 'all') return SKILLS;
    return SKILLS.filter(skill => skill.category === category);
  };

  const renderSkillList = (skills: Skill[]) => (
    <div className="space-y-2 p-2">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="bg-purple-800/30 rounded-lg p-2 border border-purple-600/20 hover:border-purple-500/40 transition-colors"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">{skill.icon}</span>
              <span className="text-sm font-medium text-purple-200">{skill.name}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-yellow-300">Lv. {skill.level}</div>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-purple-400">
              <span>XP: {skill.experience.toLocaleString()}</span>
              <span>Next: {(skill.maxExperience - skill.experience).toLocaleString()}</span>
            </div>
            <div className="relative">
              <Progress 
                value={(skill.experience / skill.maxExperience) * 100} 
                className="h-2 bg-purple-900/50"
              />
              <div 
                className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${(skill.experience / skill.maxExperience) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const totalLevel = SKILLS.reduce((sum, skill) => sum + skill.level, 0);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-800/40 to-purple-900/40">
      {/* Header */}
      <div className="p-3 border-b border-purple-600/30">
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">Total Level: {totalLevel}</div>
          <div className="text-xs text-purple-300">Skill Overview</div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 bg-purple-800/50 rounded-none border-b border-purple-600/30">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-200 text-purple-200 text-xs"
          >
            All
          </TabsTrigger>
          <TabsTrigger 
            value="combat" 
            className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-200 text-purple-200 text-xs"
          >
            Combat
          </TabsTrigger>
          <TabsTrigger 
            value="magic" 
            className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-200 text-purple-200 text-xs"
          >
            Magic
          </TabsTrigger>
          <TabsTrigger 
            value="crafting" 
            className="data-[state=active]:bg-yellow-600/20 data-[state=active]:text-yellow-200 text-purple-200 text-xs"
          >
            Craft
          </TabsTrigger>
          <TabsTrigger 
            value="gathering" 
            className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-200 text-purple-200 text-xs"
          >
            Gather
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="all" className="mt-0">
            {renderSkillList(getFilteredSkills('all'))}
          </TabsContent>
          <TabsContent value="combat" className="mt-0">
            {renderSkillList(getFilteredSkills('combat'))}
          </TabsContent>
          <TabsContent value="magic" className="mt-0">
            {renderSkillList(getFilteredSkills('magic'))}
          </TabsContent>
          <TabsContent value="crafting" className="mt-0">
            {renderSkillList(getFilteredSkills('crafting'))}
          </TabsContent>
          <TabsContent value="gathering" className="mt-0">
            {renderSkillList(getFilteredSkills('gathering'))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};