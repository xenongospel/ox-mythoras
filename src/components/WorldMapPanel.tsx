import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Map, 
  Mountain, 
  Trees, 
  Waves, 
  Flame, 
  Snowflake,
  Castle,
  Tent,
  Swords,
  Eye,
  Flag,
  Shield,
  Zap,
  Skull,
  Star,
  Search,
  Plane,
  Clock,
  ChevronRight,
  Home,
  Sword,
  Gem,
  Crown,
  HelpCircle
} from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Checkbox } from './ui/checkbox';
import { ResponsiveTabs } from './ResponsiveTabs';
import worldMapImage from 'figma:asset/a8a9af3f8784fd7e2838c97b3b3f0365de130249.png';

// Types for world map data
interface Region {
  id: string;
  name: string;
  description: string;
  level: { min: number; max: number };
  biome: 'forest' | 'mountain' | 'desert' | 'tundra' | 'volcanic' | 'coastal' | 'void';
  danger: 'safe' | 'low' | 'medium' | 'high' | 'extreme';
  faction: string;
  discovered: boolean;
  unlocked: boolean;
  x: number;
  y: number;
  connections: string[];
  resources: string[];
  threats: string[];
  lore?: string;
}

interface Waypoint {
  id: string;
  name: string;
  type: 'city' | 'outpost' | 'dungeon' | 'boss' | 'resource' | 'camp' | 'portal' | 'landmark';
  regionId: string;
  x: number;
  y: number;
  discovered: boolean;
  unlocked: boolean;
  completed?: boolean;
  visited?: boolean;
  icon: React.ComponentType<any>;
  description: string;
  requirements?: string[];
}

interface Faction {
  id: string;
  name: string;
  color: string;
  relationship: 'allied' | 'neutral' | 'hostile' | 'unknown';
  influence: number;
  description: string;
}

// Fresh start data with carefully calculated positions to avoid overlaps
const WAYPOINTS: Waypoint[] = [
  {
    id: 'crystal-city',
    name: 'Crystal City',
    type: 'city',
    regionId: 'valdris-reach',
    x: 25, // Lower left area
    y: 75,
    discovered: true,
    unlocked: true,
    visited: true, // Only starting location is visited
    icon: Home,
    description: 'The magnificent capital of the Technician Guild, built within and around massive crystal formations. Your journey begins here.',
    requirements: ['None']
  },
  {
    id: 'training-grounds',
    name: 'Training Grounds',
    type: 'outpost',
    regionId: 'valdris-reach',
    x: 40, // Well separated from crystal city
    y: 65,
    discovered: true,
    unlocked: true,
    visited: false,
    icon: Tent,
    description: 'Basic training facility where new Technicians learn to work with their first creatures.',
    requirements: ['Complete Tutorial']
  },
  {
    id: 'crystal-mines',
    name: 'Crystal Mines',
    type: 'resource',
    regionId: 'valdris-reach',
    x: 15, // Far left, well separated
    y: 55,
    discovered: true,
    unlocked: false, // Locked until player progresses
    visited: false,
    icon: Gem,
    description: 'Rich crystalline deposits that fuel Technician research and enhancement.',
    requirements: ['Guild Standing: Novice', 'Level 5+']
  },
  {
    id: 'forest-outpost',
    name: 'Forest Outpost',
    type: 'outpost',
    regionId: 'valdris-reach',
    x: 55, // Center right area
    y: 50,
    discovered: true,
    unlocked: false,
    visited: false,
    icon: Shield,
    description: 'Frontier outpost monitoring the borders of Valdris Reach.',
    requirements: ['Guild Standing: Apprentice', 'Level 10+']
  },
  {
    id: 'ancient-ruins',
    name: 'Ancient Ruins',
    type: 'dungeon',
    regionId: 'valdris-reach',
    x: 70, // Right side, well separated
    y: 40,
    discovered: false,
    unlocked: false,
    visited: false,
    icon: HelpCircle,
    description: 'Mysterious structures hidden deep within the crystal forests.',
    requirements: ['Discovery Event', 'Level 15+']
  },
  {
    id: 'void-portal',
    name: 'Void Portal Nexus',
    type: 'portal',
    regionId: 'shadow-vale',
    x: 85, // Far right, upper area
    y: 25,
    discovered: false, // Not discovered yet
    unlocked: false,
    visited: false,
    icon: Zap,
    description: 'A mysterious energy signature detected in the northern regions.',
    requirements: ['Complete Regional Championship', 'Level 20+']
  },
  {
    id: 'shadow-stronghold',
    name: 'Shadow Stronghold',
    type: 'boss',
    regionId: 'shadow-vale',
    x: 90, // Far top right
    y: 15,
    discovered: false,
    unlocked: false,
    visited: false,
    completed: false,
    icon: Crown,
    description: 'An ancient fortress shrouded in darkness. Few who venture here return.',
    requirements: ['Master Rank', 'Shadow Resistance 75%', 'Level 40+']
  },
  {
    id: 'ember-forge',
    name: 'The Great Forge',
    type: 'landmark',
    regionId: 'ember-peaks',
    x: 10, // Far left, lower area
    y: 85,
    discovered: false,
    unlocked: false,
    visited: false,
    icon: Flame,
    description: 'Legendary forge of the Ember Clan, visible from great distances by its eternal flame.',
    requirements: ['Ember Clan Relations: Neutral+', 'Fire Resistance 50%']
  },
  {
    id: 'ember-camp',
    name: 'Ember Camp',
    type: 'camp',
    regionId: 'ember-peaks',
    x: 30, // Lower center, well separated
    y: 90,
    discovered: false,
    unlocked: false,
    visited: false,
    icon: Tent,
    description: 'A nomadic camp of the Ember Clan warriors.',
    requirements: ['Fire Resistance 25%', 'Level 20+']
  }
];

const REGIONS: Region[] = [
  {
    id: 'valdris-reach',
    name: 'Valdris Reach',
    description: 'Ancient crystalline forests where the first Technicians discovered creature bonding. A safe haven for new Technicians.',
    level: { min: 1, max: 25 },
    biome: 'forest',
    danger: 'safe',
    faction: 'technician-guild',
    discovered: true,
    unlocked: true,
    x: 150,
    y: 300,
    connections: ['shadow-vale', 'ember-peaks'],
    resources: ['Valdris Crystal', 'Forest Herbs', 'Crystal Water'],
    threats: ['Wild Creatures', 'Crystal Wraiths'],
    lore: 'The birthplace of Technician civilization, where ancient crystals first resonated with human consciousness.'
  },
  {
    id: 'shadow-vale',
    name: 'Shadow Vale',
    description: 'A realm where void energy corrupts reality itself. Entry requires special preparation.',
    level: { min: 20, max: 45 },
    biome: 'void',
    danger: 'high',
    faction: 'void-touched',
    discovered: false, // Not discovered yet
    unlocked: false,
    x: 400,
    y: 200,
    connections: ['valdris-reach', 'frozen-wastes'],
    resources: ['Shadow Fragments', 'Void Essence', 'Obsidian'],
    threats: ['Void Stalkers', 'Shadow Beasts', 'Reality Tears'],
    lore: 'Once a prosperous valley, now consumed by otherworldly darkness that defies natural law.'
  },
  {
    id: 'ember-peaks',
    name: 'Ember Peaks',
    description: 'Volcanic mountains where fire creatures forge weapons in molten rivers.',
    level: { min: 25, max: 50 },
    biome: 'volcanic',
    danger: 'medium',
    faction: 'ember-clan',
    discovered: false,
    unlocked: false,
    x: 120,
    y: 500,
    connections: ['valdris-reach', 'iron-wastes'],
    resources: ['Inferno Shards', 'Molten Metal', 'Fire Crystals'],
    threats: ['Lava Elementals', 'Fire Drakes', 'Ember Wraiths'],
    lore: 'Sacred mountains where the Ember Clan maintains ancient forges powered by the earth\'s heart.'
  }
];

const FACTIONS: Faction[] = [
  {
    id: 'technician-guild',
    name: 'Technician Guild',
    color: '#2CC7A6',
    relationship: 'allied',
    influence: 85,
    description: 'The primary organization of Technicians working to understand and protect creature bonds.'
  },
  {
    id: 'void-touched',
    name: 'Void Touched',
    color: '#6E3CCF',
    relationship: 'unknown',
    influence: 0,
    description: 'Mysterious beings from the Shadow Vale. Little is known about their true nature.'
  },
  {
    id: 'ember-clan',
    name: 'Ember Clan',
    color: '#CF9E3C',
    relationship: 'unknown',
    influence: 0,
    description: 'Fire-wielding nomads who guard the volcanic regions and their ancient forging secrets.'
  }
];

// Enhanced waypoint button component
const WaypointButton: React.FC<{
  waypoint: Waypoint;
  onClick: (id: string) => void;
  selected: boolean;
  currentLocation?: string;
  containerWidth: number;
  containerHeight: number;
}> = ({ waypoint, onClick, selected, currentLocation, containerWidth, containerHeight }) => {
  const isCurrent = waypoint.id === currentLocation;
  const Icon = waypoint.icon;
  
  // Calculate absolute position from percentage
  const x = (waypoint.x / 100) * containerWidth;
  const y = (waypoint.y / 100) * containerHeight;
  
  // Determine waypoint state
  const isVisited = waypoint.visited && waypoint.discovered;
  const isUnknown = !waypoint.discovered;
  const isLocked = !waypoint.unlocked && waypoint.discovered;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ 
            left: x, 
            top: y,
            zIndex: selected ? 20 : isCurrent ? 15 : 10
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick(waypoint.id);
          }}
        >
          {/* Selection Ring */}
          {selected && (
            <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-violet-500 animate-pulse" 
                 style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }} />
          )}
          
          {/* Current Location Pulse */}
          {isCurrent && (
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-violet-500 opacity-30 animate-ping" 
                 style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }} />
          )}
          
          {/* Main Button */}
          <div 
            className="relative w-14 h-14 rounded-full border-2 border-black overflow-hidden group-hover:scale-110 hover-transition"
            style={{
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.6), 0 3px 6px rgba(0, 0, 0, 0.4)',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8))'
            }}
          >
            {/* Outer silvery ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 rounded-full">
              {/* Inner content area */}
              <div className="absolute inset-1 rounded-full overflow-hidden">
                {isVisited ? (
                  // Visited state - bright teal
                  <div 
                    className="w-full h-full bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 relative"
                    style={{
                      boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <div 
                      className="absolute inset-2 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-bg-canvas" style={{ filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8))', strokeWidth: 1.5 }} />
                    </div>
                  </div>
                ) : isUnknown ? (
                  // Unknown state - dark with question mark
                  <div 
                    className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 relative"
                    style={{
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.1), inset 0 -1px 3px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    <div 
                      className="absolute inset-3 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 70%)'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <HelpCircle className="w-7 h-7 text-text-3" style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6))', strokeWidth: 1.5 }} />
                    </div>
                  </div>
                ) : isLocked ? (
                  // Locked state - amber/orange but dimmed
                  <div 
                    className="w-full h-full bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 relative"
                    style={{
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 -1px 3px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <div 
                      className="absolute inset-2 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-bg-canvas opacity-80" style={{ filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8))', strokeWidth: 1.5 }} />
                    </div>
                  </div>
                ) : (
                  // Discovered but not visited
                  <div 
                    className="w-full h-full bg-gradient-to-br from-warn via-yellow-600 to-orange-600 relative"
                    style={{
                      boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.25), inset 0 -1px 2px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div 
                      className="absolute inset-2 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-bg-canvas" style={{ filter: 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8))', strokeWidth: 1.5 }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className="bg-surface-0 border-border text-text-1 p-3 max-w-xs"
        style={{ 
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
          borderRadius: '8px'
        }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-teal-500" />
            <span className="text-sm tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
              {waypoint.name}
            </span>
          </div>
          <div className="text-xs text-text-2 tracking-wide leading-relaxed">
            {waypoint.description}
          </div>
          {waypoint.requirements && waypoint.requirements.length > 0 && (
            <div className="text-xs text-text-3 tracking-wide">
              Requirements: {waypoint.requirements.join(', ')}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

// Connection path component
const ConnectionPath: React.FC<{
  start: Waypoint;
  end: Waypoint;
  containerWidth: number;
  containerHeight: number;
}> = ({ start, end, containerWidth, containerHeight }) => {
  // Only show paths between discovered waypoints
  if (!start.discovered || !end.discovered) return null;
  
  const startX = (start.x / 100) * containerWidth;
  const startY = (start.y / 100) * containerHeight;
  const endX = (end.x / 100) * containerWidth;
  const endY = (end.y / 100) * containerHeight;
  
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 - 20;
  
  const pathData = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
  
  return (
    <svg 
      className="absolute inset-0 pointer-events-none" 
      style={{ width: containerWidth, height: containerHeight }}
    >
      <path
        d={pathData}
        stroke="#7A53E6"
        strokeWidth="2"
        strokeDasharray="6,4"
        fill="none"
        opacity={0.6}
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      />
    </svg>
  );
};

// Helper functions
const getBiomeIcon = (biome: Region['biome']) => {
  switch (biome) {
    case 'forest': return Trees;
    case 'mountain': return Mountain;
    case 'desert': return Swords;
    case 'tundra': return Snowflake;
    case 'volcanic': return Flame;
    case 'coastal': return Waves;
    case 'void': return Zap;
    default: return Map;
  }
};

const getDangerColor = (danger: Region['danger']) => {
  switch (danger) {
    case 'safe': return 'text-ok border-ok bg-ok';
    case 'low': return 'text-teal-500 border-teal-500 bg-teal-500';
    case 'medium': return 'text-warn border-warn bg-warn';
    case 'high': return 'text-danger border-danger bg-danger';
    case 'extreme': return 'text-violet-500 border-violet-500 bg-violet-500';
    default: return 'text-text-3 border-border bg-surface-1';
  }
};

const getRelationshipColor = (relationship: Faction['relationship']) => {
  switch (relationship) {
    case 'allied': return 'text-ok';
    case 'neutral': return 'text-warn';
    case 'hostile': return 'text-danger';
    case 'unknown': return 'text-text-3';
    default: return 'text-text-3';
  }
};

interface WorldMapPanelProps {
  width?: number;
  height?: number;
}

export const WorldMapPanel: React.FC<WorldMapPanelProps> = ({ 
  width = 450, 
  height = 400 
}) => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('map');
  const [showWaypoints, setShowWaypoints] = useState(true);
  const [currentLocation] = useState('crystal-city');
  
  // Pan state
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        setMapDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Fixed single selection handler
  const handleWaypointClick = useCallback((waypointId: string) => {
    setSelectedWaypoint(prev => prev === waypointId ? null : waypointId);
  }, []);

  // Pan handling
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) { // Left mouse button
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setViewOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  const filteredRegions = REGIONS.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.biome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWaypoints = WAYPOINTS.filter(waypoint =>
    waypoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    waypoint.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab configuration
  const tabConfigs = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'regions', label: 'Regions', icon: Mountain },
    { id: 'factions', label: 'Factions', icon: Flag }
  ];

  const mapHeight = height - 120;

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
                placeholder="Search regions, waypoints..."
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
              minWidthForText={400}
            />

            {/* Region info moved here */}
            <div className="text-xs text-text-3 mono tracking-wide">
              {REGIONS.filter(r => r.discovered).length}/{REGIONS.length} Discovered
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map View */}
          {activeTab === 'map' && (
            <div 
              ref={mapContainerRef}
              className="relative border border-border bg-surface-1 overflow-hidden flex-1 cursor-grab active:cursor-grabbing" 
              style={{ 
                borderRadius: '8px', 
                height: mapHeight,
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Fixed Background Image */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${worldMapImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              
              {/* Pannable content container - ONLY waypoints pan */}
              <div 
                className="absolute inset-0"
                style={{
                  transform: `translate(${viewOffset.x}px, ${viewOffset.y}px)`,
                  transition: isPanning ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                {/* Connection Paths */}
                {showWaypoints && mapDimensions.width > 0 && (
                  <>
                    {/* Only show paths between discovered and nearby waypoints */}
                    <ConnectionPath
                      start={WAYPOINTS.find(w => w.id === 'crystal-city')!}
                      end={WAYPOINTS.find(w => w.id === 'training-grounds')!}
                      containerWidth={mapDimensions.width}
                      containerHeight={mapDimensions.height}
                    />
                    <ConnectionPath
                      start={WAYPOINTS.find(w => w.id === 'crystal-city')!}
                      end={WAYPOINTS.find(w => w.id === 'crystal-mines')!}
                      containerWidth={mapDimensions.width}
                      containerHeight={mapDimensions.height}
                    />
                  </>
                )}

                {/* Waypoint Buttons */}
                {showWaypoints && mapDimensions.width > 0 && filteredWaypoints.map(waypoint => (
                  <WaypointButton
                    key={waypoint.id}
                    waypoint={waypoint}
                    onClick={handleWaypointClick}
                    selected={selectedWaypoint === waypoint.id}
                    currentLocation={currentLocation}
                    containerWidth={mapDimensions.width}
                    containerHeight={mapDimensions.height}
                  />
                ))}
              </div>

              {/* Instructions overlay */}
              <div className="absolute bottom-2 left-2 bg-surface-0/80 border border-border p-2 text-xs backdrop-blur-sm" style={{ borderRadius: '6px' }}>
                <div className="text-text-3 tracking-wide mb-1">Controls:</div>
                <div className="text-text-2 tracking-wide">Drag: Pan • Click: Select</div>
              </div>
            </div>
          )}

          {/* Regions List */}
          {activeTab === 'regions' && (
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2 p-1">
                {filteredRegions.map(region => {
                  const BiomeIcon = getBiomeIcon(region.biome);
                  const faction = FACTIONS.find(f => f.id === region.faction);
                  
                  return (
                    <div
                      key={region.id}
                      className="p-3 border border-border cursor-pointer hover-transition hover:border-violet-500 hover:bg-violet-500 hover:bg-opacity-2"
                      style={{ borderRadius: '8px' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BiomeIcon className="w-4 h-4 text-violet-500" />
                          <div>
                            <div className="text-text-1 tracking-wider text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                              {region.name}
                            </div>
                            <div className="text-xs text-text-3 tracking-wide">
                              Level {region.level.min}-{region.level.max} • {region.biome}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getDangerColor(region.danger)} bg-opacity-20 text-xs`}>
                            {region.danger}
                          </Badge>
                          {faction && (
                            <div
                              className="w-2 h-2 rounded-full border border-bg-canvas"
                              style={{ backgroundColor: faction.color }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-text-2 tracking-wide leading-relaxed">
                        {region.description}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <div className={`${region.discovered ? 'text-ok' : 'text-text-3'}`}>
                          {region.discovered ? '✓ Discovered' : '○ Hidden'}
                        </div>
                        <div className={`${region.unlocked ? 'text-ok' : 'text-warn'}`}>
                          {region.unlocked ? '✓ Unlocked' : '⚠ Locked'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Factions List */}
          {activeTab === 'factions' && (
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-2 p-1">
                {FACTIONS.map(faction => (
                  <div
                    key={faction.id}
                    className="p-3 border border-border hover:border-violet-500 hover:bg-violet-500 hover:bg-opacity-2 hover-transition"
                    style={{ borderRadius: '8px' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-bg-canvas"
                          style={{ backgroundColor: faction.color }}
                        />
                        <div>
                          <div className="text-text-1 tracking-wider text-sm" style={{ fontFamily: 'Cinzel, serif' }}>
                            {faction.name}
                          </div>
                          <div className={`text-xs tracking-wide capitalize ${getRelationshipColor(faction.relationship)}`}>
                            {faction.relationship}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-text-1 mono tracking-wide">
                          {faction.influence}%
                        </div>
                        <div className="text-xs text-text-3 tracking-wide">
                          Influence
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-text-2 tracking-wide leading-relaxed mb-2">
                      {faction.description}
                    </div>
                    <div className="w-full bg-surface-1 h-1 border border-border" style={{ borderRadius: '4px' }}>
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${faction.influence}%`,
                          backgroundColor: faction.color,
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Layer Controls at Bottom */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="waypoints"
                  checked={showWaypoints}
                  onCheckedChange={(checked) => setShowWaypoints(!!checked)}
                />
                <label htmlFor="waypoints" className="text-xs text-text-2 tracking-wide">
                  Show Waypoints
                </label>
              </div>
            </div>
            <div className="text-xs text-text-3 mono tracking-wide">
              Drag to Pan • Click to Select
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};