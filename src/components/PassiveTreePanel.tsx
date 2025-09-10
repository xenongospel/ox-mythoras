import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Crown, Shield, Heart, Sword, Star, Plus, Minus, Users } from 'lucide-react';

interface PassiveNode {
  id: string;
  name: string;
  type: 'small' | 'notable' | 'keystone' | 'start';
  attribute?: 'authority' | 'order' | 'animus' | 'invictus' | 'myth';
  value?: number;
  description: string;
  cost: number;
  position: { x: number; y: number };
  connections: string[];
  allocated: boolean;
  available: boolean;
  assignedCreature?: string | null; // Which creature is assigned to this node
  cluster?: string;
}

interface Creature {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const CREATURES: Creature[] = [
  { id: '1', name: 'Pyraxis', icon: '🐉', color: '#ff4444' },
  { id: '2', name: 'Frost', icon: '🐺', color: '#4488ff' },
  { id: '3', name: 'Boulder', icon: '🗿', color: '#44aa44' },
  { id: '4', name: 'Tempest', icon: '🦅', color: '#aa44ff' },
  { id: '5', name: 'Shadow', icon: '🐱', color: '#888888' }
];

const ATTRIBUTE_ICONS = {
  authority: Crown,
  order: Shield,
  animus: Heart,
  invictus: Sword,
  myth: Star
};

const ATTRIBUTE_COLORS = {
  authority: '#ffd700',
  order: '#4169e1', 
  animus: '#dc143c',
  invictus: '#ff6347',
  myth: '#9370db'
};

// Generate motherboard-style passive tree
const generateMotherboardTree = (): PassiveNode[] => {
  const nodes: PassiveNode[] = [];
  
  // Central processing unit (start)
  nodes.push({
    id: 'cpu',
    name: 'Central Processing Unit',
    type: 'start',
    description: 'The core of the Technician\'s grid system',
    cost: 0,
    position: { x: 400, y: 300 },
    connections: ['cpu-north', 'cpu-south', 'cpu-east', 'cpu-west'],
    allocated: true,
    available: true,
    assignedCreature: null,
    cluster: 'center'
  });

  // Primary circuit paths (cardinal directions)
  const directions = [
    { id: 'north', angle: -Math.PI/2, attr: 'authority' as const },
    { id: 'south', angle: Math.PI/2, attr: 'invictus' as const },
    { id: 'east', angle: 0, attr: 'animus' as const },
    { id: 'west', angle: Math.PI, attr: 'order' as const }
  ];

  directions.forEach(({ id, angle, attr }) => {
    const baseX = 400;
    const baseY = 300;
    
    // Primary connection from CPU
    const primaryX = baseX + Math.cos(angle) * 80;
    const primaryY = baseY + Math.sin(angle) * 80;
    
    nodes.push({
      id: `cpu-${id}`,
      name: `${attr.toUpperCase()} Circuit`,
      type: 'notable',
      attribute: attr,
      value: 15,
      description: `Primary ${attr} processing circuit. +15 ${attr}`,
      cost: 2,
      position: { x: primaryX, y: primaryY },
      connections: [`${id}-branch-1`, `${id}-branch-2`],
      allocated: false,
      available: false,
      assignedCreature: null,
      cluster: attr
    });

    // Branch circuits
    for (let branch = 1; branch <= 2; branch++) {
      const branchAngle = angle + (branch === 1 ? -0.4 : 0.4);
      const branchX = baseX + Math.cos(branchAngle) * 160;
      const branchY = baseY + Math.sin(branchAngle) * 160;
      
      nodes.push({
        id: `${id}-branch-${branch}`,
        name: `${attr.toUpperCase()} Sub-Circuit ${branch}`,
        type: 'notable',
        attribute: attr,
        value: 10,
        description: `Secondary ${attr} processing. +10 ${attr}`,
        cost: 1,
        position: { x: branchX, y: branchY },
        connections: [`${id}-cluster-${branch}-1`, `${id}-cluster-${branch}-2`, `${id}-cluster-${branch}-3`],
        allocated: false,
        available: false,
        assignedCreature: null,
        cluster: attr
      });

      // Small node clusters
      for (let i = 1; i <= 3; i++) {
        const clusterAngle = branchAngle + (i - 2) * 0.3;
        const clusterX = baseX + Math.cos(clusterAngle) * 240;
        const clusterY = baseY + Math.sin(clusterAngle) * 240;
        
        nodes.push({
          id: `${id}-cluster-${branch}-${i}`,
          name: `${attr.toUpperCase()} Node`,
          type: 'small',
          attribute: attr,
          value: 5,
          description: `+5 ${attr}`,
          cost: 1,
          position: { x: clusterX, y: clusterY },
          connections: i === 2 ? [`${id}-keystone-${branch}`] : [],
          allocated: false,
          available: false,
          assignedCreature: null,
          cluster: attr
        });
      }

      // Keystone at end of branch
      const keystoneX = baseX + Math.cos(branchAngle) * 320;
      const keystoneY = baseY + Math.sin(branchAngle) * 320;
      
      const keystoneDescriptions = {
        authority: 'Creatures gain leadership bonuses. All squad creatures +20% effectiveness',
        order: 'Enhanced coordination protocols. Grid Token efficiency +25%',
        animus: 'Spiritual amplification matrix. All creatures +30% mystical power',
        invictus: 'Combat optimization systems. All creatures +25% combat effectiveness',
        myth: 'Forbidden knowledge access. Unlock mythic creature evolutions'
      };
      
      nodes.push({
        id: `${id}-keystone-${branch}`,
        name: `${attr.toUpperCase()} Keystone`,
        type: 'keystone',
        attribute: attr,
        description: keystoneDescriptions[attr],
        cost: 5,
        position: { x: keystoneX, y: keystoneY },
        connections: [],
        allocated: false,
        available: false,
        assignedCreature: null,
        cluster: attr
      });
    }
  });

  // MYTH central cluster (unique attribute)
  const mythPositions = [
    { x: 400, y: 200, id: 'myth-1' },
    { x: 450, y: 220, id: 'myth-2' },
    { x: 350, y: 220, id: 'myth-3' },
    { x: 400, y: 180, id: 'myth-keystone' }
  ];

  mythPositions.forEach((pos, index) => {
    if (index < 3) {
      nodes.push({
        id: pos.id,
        name: 'M.Y.T.H. Processing Node',
        type: 'notable',
        attribute: 'myth',
        value: 8,
        description: '+8 M.Y.T.H. - Enhances mystical capabilities',
        cost: 2,
        position: pos,
        connections: index === 0 ? ['myth-keystone'] : [],
        allocated: false,
        available: false,
        assignedCreature: null,
        cluster: 'myth'
      });
    } else {
      nodes.push({
        id: pos.id,
        name: 'M.Y.T.H. Core',
        type: 'keystone',
        attribute: 'myth',
        description: 'Unlock the true potential of M.Y.T.H. - All creatures gain mythical properties',
        cost: 8,
        position: pos,
        connections: [],
        allocated: false,
        available: false,
        assignedCreature: null,
        cluster: 'myth'
      });
    }
  });

  return nodes;
};

export const PassiveTreePanel: React.FC = () => {
  const [nodes, setNodes] = useState<PassiveNode[]>(generateMotherboardTree());
  const [selectedCreature, setSelectedCreature] = useState<string | null>(null);
  const [availablePoints, setAvailablePoints] = useState(47);
  const [zoomLevel, setZoomLevel] = useState(0.8);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const updateAvailability = useCallback((updatedNodes: PassiveNode[]) => {
    return updatedNodes.map(node => {
      if (node.type === 'start' || node.allocated) {
        return { ...node, available: true };
      }

      const hasAllocatedConnection = node.connections.some(connId => 
        updatedNodes.find(n => n.id === connId)?.allocated
      );

      const hasIncomingConnection = updatedNodes.some(n => 
        n.allocated && n.connections.includes(node.id)
      );

      return { 
        ...node, 
        available: hasAllocatedConnection || hasIncomingConnection 
      };
    });
  }, []);

  const allocateNode = useCallback((nodeId: string) => {
    if (!selectedCreature) return;
    
    setNodes(prevNodes => {
      const node = prevNodes.find(n => n.id === nodeId);
      if (!node || !node.available || node.allocated || availablePoints < node.cost) {
        return prevNodes;
      }

      const updatedNodes = prevNodes.map(n => 
        n.id === nodeId 
          ? { ...n, allocated: true, assignedCreature: selectedCreature } 
          : n
      );

      setAvailablePoints(prev => prev - node.cost);
      return updateAvailability(updatedNodes);
    });
  }, [availablePoints, selectedCreature, updateAvailability]);

  const deallocateNode = useCallback((nodeId: string) => {
    setNodes(prevNodes => {
      const node = prevNodes.find(n => n.id === nodeId);
      if (!node || !node.allocated || node.type === 'start') {
        return prevNodes;
      }

      const updatedNodes = prevNodes.map(n => 
        n.id === nodeId 
          ? { ...n, allocated: false, assignedCreature: null } 
          : n
      );

      setAvailablePoints(prev => prev + node.cost);
      return updateAvailability(updatedNodes);
    });
  }, [updateAvailability]);

  const renderNode = (node: PassiveNode) => {
    const nodeSize = node.type === 'keystone' ? 32 : 
                    node.type === 'notable' ? 24 : 
                    node.type === 'start' ? 28 : 16;
    
    const borderColor = node.allocated ? '#00ff88' : 
                       node.available ? '#666666' : '#333333';
    
    const bgColor = node.allocated ? 
                   (node.attribute ? ATTRIBUTE_COLORS[node.attribute] : '#00ff88') :
                   node.available ? '#444444' : '#222222';

    const assignedCreature = node.assignedCreature ? 
      CREATURES.find(c => c.id === node.assignedCreature) : null;

    return (
      <TooltipProvider key={node.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110"
              style={{
                left: (node.position.x + panOffset.x) * zoomLevel,
                top: (node.position.y + panOffset.y) * zoomLevel,
                width: nodeSize * zoomLevel,
                height: nodeSize * zoomLevel
              }}
              onClick={() => node.allocated ? deallocateNode(node.id) : allocateNode(node.id)}
            >
              {/* Main node */}
              <div
                className="w-full h-full border-2 flex items-center justify-center relative"
                style={{
                  backgroundColor: bgColor,
                  borderColor: borderColor,
                  opacity: node.available || node.allocated ? 1 : 0.4
                }}
              >
                {/* Attribute icon */}
                {node.attribute && ATTRIBUTE_ICONS[node.attribute] && (
                  <div className="w-full h-full flex items-center justify-center">
                    {React.createElement(ATTRIBUTE_ICONS[node.attribute], { 
                      className: `w-${Math.floor(nodeSize * zoomLevel/4)} h-${Math.floor(nodeSize * zoomLevel/4)} text-white` 
                    })}
                  </div>
                )}
                
                {/* Start node icon */}
                {node.type === 'start' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Assigned creature indicator */}
                {assignedCreature && (
                  <div 
                    className="absolute -bottom-2 -right-2 w-4 h-4 border border-black flex items-center justify-center text-xs"
                    style={{ backgroundColor: assignedCreature.color }}
                  >
                    {assignedCreature.icon}
                  </div>
                )}
              </div>

              {/* Circuit trace effects for allocated nodes */}
              {node.allocated && (
                <div 
                  className="absolute inset-0 animate-pulse border-2"
                  style={{ borderColor: '#00ff88', opacity: 0.3 }}
                />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="right"
            className="max-w-xs bg-gray-900 border-gray-600 p-3"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-white">{node.name}</h4>
                <Badge 
                  variant="outline"
                  className={`text-xs ${
                    node.type === 'keystone' ? 'border-yellow-500 text-yellow-400' :
                    node.type === 'notable' ? 'border-blue-500 text-blue-400' :
                    'border-gray-500 text-gray-400'
                  }`}
                >
                  {node.type.toUpperCase()}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-300">{node.description}</p>
              
              {node.value && node.attribute && (
                <div className="text-sm text-green-400">
                  +{node.value} {node.attribute.toUpperCase()}
                </div>
              )}

              {assignedCreature && (
                <div className="text-sm" style={{ color: assignedCreature.color }}>
                  Assigned to: {assignedCreature.name} {assignedCreature.icon}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                <span className="text-xs text-gray-400">Cost: {node.cost} Grid Tokens</span>
                <span className={`text-xs ${node.allocated ? 'text-green-400' : 'text-gray-400'}`}>
                  {node.allocated ? 'ALLOCATED' : node.available ? 'AVAILABLE' : 'LOCKED'}
                </span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderConnections = () => {
    return nodes.map(node => 
      node.connections.map(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (!target) return null;

        const startX = (node.position.x + panOffset.x) * zoomLevel;
        const startY = (node.position.y + panOffset.y) * zoomLevel;
        const endX = (target.position.x + panOffset.x) * zoomLevel;
        const endY = (target.position.y + panOffset.y) * zoomLevel;

        const isAllocated = node.allocated && target.allocated;

        return (
          <svg
            key={`${node.id}-${targetId}`}
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: -1 }}
          >
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={isAllocated ? '#00ff88' : '#444444'}
              strokeWidth={isAllocated ? "3" : "2"}
              opacity={isAllocated ? "0.8" : "0.6"}
            />
            {isAllocated && (
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="#ffffff"
                strokeWidth="1"
                opacity="0.5"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            )}
          </svg>
        );
      })
    );
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="border-b border-gray-700 p-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-green-400 uppercase">Motherboard Passive Tree</h3>
            <p className="text-xs text-gray-400">Shared Grid Token Investment</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-400">{availablePoints} Available</div>
            <div className="text-xs text-gray-500">Grid Tokens</div>
          </div>
        </div>

        {/* Creature Selection */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Assign to:</span>
          {CREATURES.map(creature => (
            <button
              key={creature.id}
              onClick={() => setSelectedCreature(
                selectedCreature === creature.id ? null : creature.id
              )}
              className={`
                flex items-center gap-1 px-2 py-1 border text-xs transition-colors
                ${selectedCreature === creature.id 
                  ? 'border-green-400 bg-green-400/20 text-green-400' 
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
                }
              `}
            >
              <span>{creature.icon}</span>
              <span>{creature.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-black">
        {/* Circuit board background pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #00ff88 2px, transparent 2px),
              radial-gradient(circle at 80% 50%, #00ff88 1px, transparent 1px),
              linear-gradient(90deg, transparent 49%, #00ff88 50%, transparent 51%)
            `,
            backgroundSize: '100px 100px, 150px 150px, 50px 50px'
          }}
        />

        {/* Render connections */}
        {renderConnections()}
        
        {/* Render nodes */}
        {nodes.map(renderNode)}

        {/* Controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))}
            className="bg-gray-800 border-gray-600 text-gray-300"
          >
            <Plus className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setZoomLevel(prev => Math.max(0.3, prev - 0.1))}
            className="bg-gray-800 border-gray-600 text-gray-300"
          >
            <Minus className="w-3 h-3" />
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-black/80 border border-gray-700 p-2 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 border border-yellow-600" />
              <span className="text-gray-300">Keystone (Major)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 border border-blue-600" />
              <span className="text-gray-300">Notable (Medium)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 border border-gray-600" />
              <span className="text-gray-300">Small</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3 text-green-400" />
              <span className="text-gray-300">Creature Assigned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};