import React from 'react';
import { Monitor, Package, Map, MessageSquare, GitBranch, Users, Search, Trophy, Inbox } from 'lucide-react';

export interface Panel {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  locked: boolean;
}

interface PanelType {
  component: React.ComponentType;
  title: string;
  icon: React.ComponentType<any>;
  minWidth: number;
  minHeight: number;
  aspectRatio: number | null;
  isMainView?: boolean;
}

// Simple placeholder component for lazy loading
const LazyComponent = () => <div>Loading...</div>;

export const PANEL_TYPES: Record<string, PanelType> = {
  gameview: { 
    component: LazyComponent, 
    title: 'Game View', 
    icon: Monitor,
    minWidth: 400, 
    minHeight: 300,
    aspectRatio: 16/9,
    isMainView: true
  },
  inventory: { 
    component: LazyComponent, 
    title: 'Inventory', 
    icon: Package,
    minWidth: 400, 
    minHeight: 300,
    aspectRatio: null
  },
  worldmap: { 
    component: LazyComponent, 
    title: 'World Map', 
    icon: Map,
    minWidth: 400, 
    minHeight: 300,
    aspectRatio: null
  },
  chat: { 
    component: LazyComponent, 
    title: 'Chat', 
    icon: MessageSquare,
    minWidth: 300, 
    minHeight: 150,
    aspectRatio: null
  },
  passivetree: { 
    component: LazyComponent, 
    title: 'Passive Tree', 
    icon: GitBranch,
    minWidth: 500, 
    minHeight: 400,
    aspectRatio: 5/4
  },
  creatures: { 
    component: LazyComponent, 
    title: 'Creatures', 
    icon: Users,
    minWidth: 320, 
    minHeight: 400,
    aspectRatio: 4/5
  },
  squad: { 
    component: LazyComponent, 
    title: 'Squad', 
    icon: Users,
    minWidth: 400, 
    minHeight: 120,
    aspectRatio: 10/3
  },
  scouting: { 
    component: LazyComponent, 
    title: 'Scouting', 
    icon: Search,
    minWidth: 350, 
    minHeight: 400,
    aspectRatio: 7/8
  },
  competitions: {
    component: LazyComponent,
    title: 'Competitions',
    icon: Trophy,
    minWidth: 400,
    minHeight: 500,
    aspectRatio: 4/5
  },
  inbox: {
    component: LazyComponent,
    title: 'Inbox',
    icon: Inbox,
    minWidth: 350,
    minHeight: 400,
    aspectRatio: 7/8
  }
};

export const GRID_SIZE = 20;
export const HEADER_HEIGHT = 50;
export const SIDEBAR_WIDTH = 280;

export const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;