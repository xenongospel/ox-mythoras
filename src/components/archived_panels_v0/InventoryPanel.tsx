import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Package,
  Search,
  Package2,
  Beaker,
  Filter,
  Grid3X3,
  List,
  Star,
  Zap,
  Shield,
  Sword,
  Settings,
  RotateCcw,
  Info
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { ResponsiveTabs } from '../ResponsiveTabs';

// Enhanced item types with proper stackability rules
interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'material' | 'consumable' | 'currency' | 'key';
  subtype?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  maxStack: number; // Items with maxStack > 1 are stackable
  icon: React.ComponentType<any>;
  description: string;
  level?: number;
  attributes?: { [key: string]: number };
  effects?: string[];
  value?: number;
  gridSize: { width: number; height: number };
}

// Grid position for items
interface GridPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Enhanced inventory data with proper stackability
const INVENTORY_ITEMS: Item[] = [
  // Non-stackable equipment (maxStack: 1)
  {
    id: 'sword-001',
    name: 'Crystal Blade',
    type: 'weapon',
    subtype: 'sword',
    rarity: 'rare',
    quantity: 1,
    maxStack: 1, // Equipment cannot stack
    icon: Sword,
    description: 'A blade infused with crystal energy, enhancing magical attacks.',
    level: 12,
    attributes: { authority: 15, animus: 8 },
    effects: ['Crystal Resonance: +20% magic damage'],
    value: 850,
    gridSize: { width: 1, height: 3 }
  },
  // ... items omitted for brevity
];

const GRID_WIDTH = 12;
const GRID_HEIGHT = 12;
const CELL_SIZE = 32;

// Helper functions
const getRarityColor = (rarity: Item['rarity']) => {
  switch (rarity) {
    case 'common': return 'text-text-2 border-text-3 bg-text-3';
    case 'rare': return 'text-info border-info bg-info';
    case 'epic': return 'text-violet-500 border-violet-500 bg-violet-500';
    case 'legendary': return 'text-warn border-warn bg-warn';
    default: return 'text-text-3 border-border bg-surface-1';
  }
};

const getTypeIcon = (type: Item['type']) => {
  switch (type) {
    case 'weapon': return Sword;
    case 'armor': return Shield;
    case 'accessory': return Star;
    case 'material': return Package;
    case 'consumable': return Package2;
    case 'currency': return Star;
    case 'key': return Settings;
    default: return Package;
  }
};

const canItemsStack = (item1: Item, item2: Item): boolean => {
  return item1.id === item2.id && 
         item1.maxStack > 1 && 
         (item1.quantity + item2.quantity) <= item1.maxStack;
};

interface InventoryPanelProps {
  width?: number;
  height?: number;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({
  width = 400,
  height = 500
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Auto-layout items in grid positions
  const [itemPositions, setItemPositions] = useState<Map<string, GridPosition>>(new Map());

  // Calculate container size for proper grid bounds
  useEffect(() => {
    const updateSize = () => {
      if (gridContainerRef.current) {
        const rect = gridContainerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Simple auto-layout algorithm
  useEffect(() => {
    const positions = new Map<string, GridPosition>();
    const occupiedSlots = new Set<string>();
    
    INVENTORY_ITEMS.forEach((item) => {
      // Find first available position for this item
      for (let y = 0; y <= GRID_HEIGHT - item.gridSize.height; y++) {
        for (let x = 0; x <= GRID_WIDTH - item.gridSize.width; x++) {
          // Check if this position is available
          let canPlace = true;
          for (let dy = 0; dy < item.gridSize.height; dy++) {
            for (let dx = 0; dx < item.gridSize.width; dx++) {
              const slotKey = `${x + dx},${y + dy}`;
              if (occupiedSlots.has(slotKey)) {
                canPlace = false;
                break;
              }
            }
            if (!canPlace) break;
          }
          
          if (canPlace) {
            // Place the item
            positions.set(item.id, {
              x,
              y,
              width: item.gridSize.width,
              height: item.gridSize.height
            });
            
            // Mark slots as occupied
            for (let dy = 0; dy < item.gridSize.height; dy++) {
              for (let dx = 0; dx < item.gridSize.width; dx++) {
                occupiedSlots.add(`${x + dx},${y + dy}`);
              }
            }
            
            y = GRID_HEIGHT; // Break outer loop
            break;
          }
        }
      }
    });
    
    setItemPositions(positions);
  }, []);

  // Filter items based on search only (no tabs)
  const filteredItems = INVENTORY_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleItemClick = useCallback((itemId: string) => {
    setSelectedItem(prev => prev === itemId ? null : itemId);
  }, []);

  // Drag handlers for grid items
  const handleItemDragStart = useCallback((e: React.MouseEvent, item: Item) => {
    e.preventDefault();
    setDraggedItem(item);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  const handleItemDragMove = useCallback((e: MouseEvent) => {
    if (draggedItem && gridContainerRef.current) {
      const containerRect = gridContainerRef.current.getBoundingClientRect();
      const x = e.clientX - containerRect.left - dragOffset.x;
      const y = e.clientY - containerRect.top - dragOffset.y;
      
      // Snap to grid
      const gridX = Math.max(0, Math.min(GRID_WIDTH - draggedItem.gridSize.width, Math.round(x / CELL_SIZE)));
      const gridY = Math.max(0, Math.min(GRID_HEIGHT - draggedItem.gridSize.height, Math.round(y / CELL_SIZE)));
      
      // Update position in state
      setItemPositions(prev => {
        const newPositions = new Map(prev);
        newPositions.set(draggedItem.id, {
          x: gridX,
          y: gridY,
          width: draggedItem.gridSize.width,
          height: draggedItem.gridSize.height
        });
        return newPositions;
      });
    }
  }, [draggedItem, dragOffset]);

  const handleItemDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (draggedItem) {
      document.addEventListener('mousemove', handleItemDragMove);
      document.addEventListener('mouseup', handleItemDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleItemDragMove);
        document.removeEventListener('mouseup', handleItemDragEnd);
      };
    }
  }, [draggedItem, handleItemDragMove, handleItemDragEnd]);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full bg-surface-0 flex flex-col p-4">
        {/* Search and View Toggle Row */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center gap-3">
            {/* Search - takes up remaining space */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-3" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-surface-1 border-border text-text-1 placeholder-text-3 h-8 tracking-wide text-sm"
              />
            </div>

            {/* View Toggle */}
            <div className="bg-surface-1 border border-border rounded-md overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2 py-2 text-xs tracking-wide hover-transition ${
                    viewMode === 'grid' 
                      ? 'bg-violet-500 text-bg-canvas' 
                      : 'text-text-2 hover:text-bg-canvas hover:bg-violet-500 hover:bg-opacity-2'
                  }`}
                >
                  <Grid3X3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2 py-2 text-xs tracking-wide hover-transition border-l border-border ${
                    viewMode === 'list' 
                      ? 'bg-violet-500 text-bg-canvas' 
                      : 'text-text-2 hover:text-bg-canvas hover:bg-violet-500 hover:bg-opacity-2'
                  }`}
                >
                  <List className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area with fixed bounds */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode === 'grid' ? (
            // Grid View with proper bounds and drag functionality
            <div className="flex-1 border border-border bg-surface-1 overflow-hidden relative" style={{ borderRadius: '8px' }}>
              <div
                ref={gridContainerRef}
                className="absolute inset-0 overflow-auto"
                style={{ padding: '8px' }}
              >
                {/* Grid Background */}
                <div
                  className="relative"
                  style={{
                    width: GRID_WIDTH * CELL_SIZE,
                    height: GRID_HEIGHT * CELL_SIZE,
                    backgroundImage: `
                      linear-gradient(rgba(46, 42, 54, 0.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(46, 42, 54, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
                  }}
                >
                  {/* Render items */}
                  {filteredItems.map((item) => {
                    const position = itemPositions.get(item.id);
                    if (!position) return null;

                    const Icon = item.icon;
                    
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <div
                            className={`group absolute border-2 cursor-grab hover-transition flex flex-col items-center justify-center text-center p-1 ${
                              selectedItem === item.id
                                ? 'border-violet-500 bg-violet-500 bg-opacity-20'
                                : `${getRarityColor(item.rarity)} bg-opacity-20 hover:border-blue-accent hover:bg-blue-accent hover:bg-opacity-20`
                            } ${draggedItem?.id === item.id ? 'opacity-50' : ''}`}
                            style={{
                              left: position.x * CELL_SIZE,
                              top: position.y * CELL_SIZE,
                              width: position.width * CELL_SIZE,
                              height: position.height * CELL_SIZE,
                              borderRadius: '4px',
                              zIndex: draggedItem?.id === item.id ? 1000 : 1
                            }}
                            onClick={() => handleItemClick(item.id)}
                            onMouseDown={(e) => handleItemDragStart(e, item)}
                          >
                            <Icon className="w-4 h-4 mb-1 text-text-1 group-hover:text-white hover-transition" />
                            {item.maxStack > 1 && item.quantity > 1 && (
                              <div className="absolute bottom-0 right-0 bg-bg-canvas text-text-1 text-xs px-1 rounded-tl text-center min-w-4">
                                {item.quantity}
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="right" 
                          className="bg-surface-0 border-border text-text-1 p-3 max-w-xs"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-teal-500" />
                              <span className="text-sm tracking-wider" style={{ fontFamily: 'Cinzel, serif' }}>
                                {item.name}
                              </span>
                              <Badge className={`${getRarityColor(item.rarity)} bg-opacity-20 text-xs`}>
                                {item.rarity}
                              </Badge>
                            </div>
                            
                            <div className="text-xs text-text-2 tracking-wide leading-relaxed">
                              {item.description}
                            </div>
                            
                            {item.maxStack > 1 && (
                              <div className="text-xs text-teal-500 tracking-wide">
                                Quantity: {item.quantity}/{item.maxStack} {item.maxStack > 1 ? '(Stackable)' : ''}
                              </div>
                            )}
                            
                            {item.level && (
                              <div className="text-xs text-violet-500 tracking-wide">
                                Level: {item.level}
                              </div>
                            )}
                            
                            {item.attributes && Object.keys(item.attributes).length > 0 && (
                              <div>
                                <div className="text-xs text-violet-500 tracking-wide mb-1">Attributes:</div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                  {Object.entries(item.attributes).map(([attr, value]) => (
                                    <div key={attr} className="text-text-2 tracking-wide">
                                      {attr}: +{value}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {item.effects && item.effects.length > 0 && (
                              <div>
                                <div className="text-xs text-ok tracking-wide mb-1">Effects:</div>
                                <div className="space-y-1">
                                  {item.effects.map((effect, index) => (
                                    <div key={index} className="text-xs text-text-2 tracking-wide">
                                      • {effect}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {item.value && (
                              <div className="text-xs text-warn tracking-wide">
                                Value: {item.value * item.quantity} gold
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            // List View
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                
                return (
                  <div
                    key={item.id}
                    className={`group p-3 border cursor-pointer hover-transition ${
                      selectedItem === item.id
                        ? 'border-violet-500 bg-violet-500 bg-opacity-10'
                        : 'border-border hover:border-blue-accent hover:bg-blue-accent hover:bg-opacity-20'
                    }`}
                    style={{ borderRadius: '8px' }}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded border ${getRarityColor(item.rarity)} bg-opacity-20 flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-text-1 group-hover:text-white hover-transition" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm tracking-wider group-hover:text-white hover-transition" style={{ fontFamily: 'Cinzel, serif' }}>
                            {item.name}
                          </span>
                          <Badge className={`${getRarityColor(item.rarity)} bg-opacity-20 text-xs`}>
                            {item.rarity}
                          </Badge>
                          {item.maxStack > 1 && item.quantity > 1 && (
                            <Badge variant="outline" className="text-xs">
                              x{item.quantity}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-text-3 tracking-wide group-hover:text-white hover-transition">
                          {item.type} • {item.description.substring(0, 60)}...
                        </div>
                      </div>
                      
                      {item.value && (
                        <div className="text-xs text-warn mono tracking-wide">
                          {item.value * item.quantity}g
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};



