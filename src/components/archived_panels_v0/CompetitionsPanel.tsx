import React, { useState, useCallback } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  Users,
  Star,
  Award,
  Target,
  TrendingUp,
  MapPin,
  Zap,
  Shield,
  Sword,
  Crown,
  Medal,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Info,
  Lock
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ResponsiveTabs } from '../ResponsiveTabs';

// Types for competition system
interface Competition {
  id: string;
  name: string;
  type: 'tournament' | 'league' | 'championship' | 'qualifier' | 'exhibition';
  tier: 'regional' | 'national' | 'international' | 'elite';
  status: 'upcoming' | 'registration' | 'closed';
  startDate: Date;
  endDate: Date;
  location: string;
  regionId: string;
  participants: number;
  maxParticipants: number;
  prizePool: number;
  entryFee: number;
  level: { min: number; max: number };
  requirements: string[];
  description: string;
  category: 'individual' | 'team' | 'guild';
  format: string;
  registered: boolean;
  faction?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'combat' | 'exploration' | 'competition' | 'social';
  progress: number;
  maxProgress: number;
  completed: boolean;
  rewards: string[];
}

// Fresh start competitions for 2024 season
const COMPETITIONS: Competition[] = [
  {
    id: 'valdris-newcomer-cup',
    name: 'Valdris Newcomer Cup',
    type: 'tournament',
    tier: 'regional',
    status: 'upcoming',
    startDate: new Date('2024-08-15'),
    endDate: new Date('2024-08-18'),
    location: 'Crystal City Arena',
    regionId: 'valdris-reach',
    participants: 0,
    maxParticipants: 32,
    prizePool: 5000,
    entryFee: 0,
    level: { min: 1, max: 10 },
    requirements: ['New Technician Status', 'First Creature Bonded'],
    description: 'A welcoming tournament for Technicians just beginning their journey. Perfect for gaining experience.',
    category: 'individual',
    format: 'Single Elimination',
    registered: false,
    faction: 'technician-guild'
  },
  // ... other competitions omitted for brevity
];

// Fresh start achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first training session',
    icon: Star,
    rarity: 'common',
    category: 'competition',
    progress: 0,
    maxProgress: 1,
    completed: false,
    rewards: ['50 XP', 'Training Badge']
  },
  // ... other achievements omitted for brevity
];

// Helper functions
const getStatusColor = (status: Competition['status']) => {
  switch (status) {
    case 'upcoming': return 'text-info border-info bg-info';
    case 'registration': return 'text-ok border-ok bg-ok';
    case 'closed': return 'text-text-3 border-text-3 bg-text-3';
    default: return 'text-text-3 border-border bg-surface-1';
  }
};

const getTierColor = (tier: Competition['tier']) => {
  switch (tier) {
    case 'regional': return 'text-teal-500';
    case 'national': return 'text-violet-500';
    case 'international': return 'text-warn';
    case 'elite': return 'text-danger';
    default: return 'text-text-3';
  }
};

const getRarityColor = (rarity: Achievement['rarity']) => {
  switch (rarity) {
    case 'common': return 'text-text-2 border-text-3';
    case 'rare': return 'text-info border-info';
    case 'epic': return 'text-violet-500 border-violet-500';
    case 'legendary': return 'text-warn border-warn';
    default: return 'text-text-3 border-border';
  }
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface CompetitionsPanelProps {
  width?: number;
  height?: number;
}

export const CompetitionsPanel: React.FC<CompetitionsPanelProps> = ({
  width = 450,
  height = 500
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState<string | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('competitions');

  // Filter competitions based on search and filters
  const filteredCompetitions = COMPETITIONS.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClosed = showClosed || comp.status !== 'closed';
    const matchesTier = filterTier === 'all' || comp.tier === filterTier;
    const matchesRegion = filterRegion === 'all' || comp.regionId === filterRegion;
    
    return matchesSearch && matchesClosed && matchesTier && matchesRegion;
  });

  const handleCompetitionClick = useCallback((competitionId: string) => {
    setSelectedCompetition(prev => prev === competitionId ? null : competitionId);
  }, []);

  const handleRegister = useCallback((competitionId: string) => {
    console.log('Registering for competition:', competitionId);
  }, []);

  // Tab configuration
  const tabConfigs = [
    { id: 'competitions', label: 'Events', icon: Trophy },
    { id: 'achievements', label: 'Progress', icon: Award }
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full bg-surface-0 flex flex-col p-4">
        {/* Search and Tabs Row */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3">
            {/* Search - takes up remaining space */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-3" />
              <Input
                type="text"
                placeholder="Search competitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-surface-1 border-border text-text-1 placeholder-text-3 h-8 tracking-wide text-sm"
              />
            </div>

            {/* Responsive Tabs */}
            <ResponsiveTabs
              tabs={tabConfigs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              minWidthForText={250}
            />

            {/* Season info */}
            <div className="text-xs text-text-3 mono tracking-wide">
              2024 Season • Week 1
            </div>
          </div>
        </div>

        {/* Content Area with Fixed Scrolling */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'competitions' ? (
            // Competitions Tab - Fixed scrolling
            <div className="h-full overflow-y-auto space-y-3 pr-2">
              {filteredCompetitions.map(competition => (
                <div
                  key={competition.id}
                  className={`group p-3 border border-border cursor-pointer hover-transition ${
                    selectedCompetition === competition.id 
                      ? 'border-violet-500 bg-violet-500 bg-opacity-10' 
                      : 'hover:border-blue-accent hover:bg-blue-accent hover:bg-opacity-20'
                  }`}
                  style={{ borderRadius: '8px' }}
                  onClick={() => handleCompetitionClick(competition.id)}
                >
                  {/* Competition Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-text-1 tracking-wider text-sm group-hover:text-white hover-transition" style={{ fontFamily: 'Cinzel, serif' }}>
                          {competition.name}
                        </h4>
                        <Badge className={`${getTierColor(competition.tier)} bg-opacity-20 text-xs capitalize`}>
                          {competition.tier}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <Badge className={`${getStatusColor(competition.status)} bg-opacity-20 text-xs capitalize`}>
                          {competition.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-text-3">
                          <MapPin className="w-3 h-3" />
                          {competition.location}
                        </div>
                        <div className="flex items-center gap-1 text-text-3">
                          <Users className="w-3 h-3" />
                          {competition.participants}/{competition.maxParticipants}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-teal-500 text-sm mono tracking-wide">
                        {formatCurrency(competition.prizePool)}
                      </div>
                      <div className="text-xs text-text-3 tracking-wide">
                        Prize Pool
                      </div>
                    </div>
                  </div>

                  {/* Competition Details */}
                  <div className="text-xs text-text-2 tracking-wide leading-relaxed mb-2">
                    {competition.description}
                  </div>

                  {/* Competition Info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="text-text-3">
                        Level {competition.level.min}-{competition.level.max}
                      </div>
                      <div className="text-text-3">
                        {formatDate(competition.startDate)} - {formatDate(competition.endDate)}
                      </div>
                    </div>
                    
                    {/* Registration Button */}
                    {competition.status === 'registration' && !competition.registered ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRegister(competition.id);
                        }}
                        className="bg-teal-500 hover:bg-teal-600 text-bg-canvas h-6 text-xs px-2 tracking-wide"
                      >
                        Register
                      </Button>
                    ) : competition.status === 'closed' ? (
                      <div className="flex items-center gap-1 text-text-3">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs">Locked</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Expanded Details */}
                  {selectedCompetition === competition.id && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-text-3 tracking-wide mb-1">Format</div>
                          <div className="text-text-1 tracking-wide">{competition.format}</div>
                        </div>
                        <div>
                          <div className="text-text-3 tracking-wide mb-1">Entry Fee</div>
                          <div className="text-text-1 tracking-wide mono">
                            {competition.entryFee > 0 ? formatCurrency(competition.entryFee) : 'Free'}
                          </div>
                        </div>
                      </div>
                      
                      {competition.requirements.length > 0 && (
                        <div>
                          <div className="text-text-3 tracking-wide mb-1 text-xs">Requirements</div>
                          <div className="flex flex-wrap gap-1">
                            {competition.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {competition.status === 'closed' && (
                        <div className="flex items-center gap-2 text-xs">
                          <Lock className="w-4 h-4 text-text-3" />
                          <span className="text-text-3 tracking-wide">
                            This competition requires access to {competition.regionId.replace('-', ' ')} region.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {filteredCompetitions.length === 0 && (
                <div className="text-center py-8 text-text-3">
                  <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm tracking-wide">No competitions found</div>
                  <div className="text-xs tracking-wide">Try adjusting your search or filters</div>
                </div>
              )}
            </div>
          ) : (
            // Achievements Tab - Fixed scrolling
            <div className="h-full overflow-y-auto space-y-3 pr-2">
              {ACHIEVEMENTS.map(achievement => (
                <div
                  key={achievement.id}
                  className={`p-3 border border-border ${
                    achievement.completed ? 'bg-ok bg-opacity-5 border-ok' : 'hover:border-violet-500 hover:bg-violet-500 hover:bg-opacity-2'
                  } hover-transition`}
                  style={{ borderRadius: '8px' }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full border ${getRarityColor(achievement.rarity)} bg-opacity-10`}>
                      <achievement.icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-text-1 text-sm tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                          {achievement.name}
                        </h4>
                        <Badge className={`${getRarityColor(achievement.rarity)} bg-opacity-20 text-xs capitalize`}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-text-2 tracking-wide leading-relaxed mb-2">
                        {achievement.description}
                      </div>
                      
                      {!achievement.completed && (
                        <div className="flex items-center gap-2 mb-2">
                          <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="flex-1 h-1" />
                          <div className="text-xs text-text-3 mono tracking-wide">
                            {achievement.progress}/{achievement.maxProgress}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-text-3 capitalize tracking-wide">
                          {achievement.category}
                        </div>
                        {achievement.completed && (
                          <div className="text-xs text-ok tracking-wide">
                            ✓ Completed
                          </div>
                        )}
                      </div>
                      
                      {achievement.rewards.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-violet-500 tracking-wide mb-1">Rewards:</div>
                          <div className="flex flex-wrap gap-1">
                            {achievement.rewards.map((reward, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {reward}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};



