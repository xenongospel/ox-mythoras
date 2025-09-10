import { useState, useCallback, useEffect } from 'react';
import { Panel } from '../types/panel';
import { PANEL_CONFIGS } from '../config/panels';
import { GRID_SIZE, HEADER_HEIGHT, SIDEBAR_WIDTH, MIN_PANEL_GAP, snapToGrid } from '../constants/layout';

export const usePanelManagement = (sidebarOpen: boolean) => {
  const getAvailableWidth = useCallback(() => {
    return sidebarOpen ? window.innerWidth - SIDEBAR_WIDTH : window.innerWidth;
  }, [sidebarOpen]);

  const getAvailableHeight = useCallback(() => {
    return window.innerHeight - HEADER_HEIGHT;
  }, []);

  const hasCollision = useCallback((
    x: number,
    y: number,
    width: number,
    height: number,
    existingPanels: Panel[],
    excludeId?: string,
  ): boolean => {
    return existingPanels
      .filter((panel) => panel.id !== excludeId)
      .some((panel) => {
        return !(
          x >= panel.x + panel.width + MIN_PANEL_GAP ||
          x + width <= panel.x - MIN_PANEL_GAP ||
          y >= panel.y + panel.height + MIN_PANEL_GAP ||
          y + height <= panel.y - MIN_PANEL_GAP
        );
      });
  }, []);

  const getSimplePosition = useCallback((
    panelType: string,
    existingPanels: Panel[],
  ): { x: number; y: number; width: number; height: number } => {
    const config = PANEL_CONFIGS[panelType];
    if (!config) {
      return { x: 0, y: 0, width: 320, height: 200 };
    }

    const availableWidth = getAvailableWidth();
    const availableHeight = getAvailableHeight();

    const gameView = existingPanels.find((p) => p.type === "gameview");
    if (gameView && panelType !== "gameview") {
      const x = gameView.x + gameView.width + MIN_PANEL_GAP;
      const y = gameView.y;

      if (x + config.minWidth <= availableWidth) {
        return {
          x,
          y,
          width: config.minWidth,
          height: config.minHeight,
        };
      }
    }

    for (let y = 0; y <= availableHeight - config.minHeight; y += GRID_SIZE) {
      for (let x = 0; x <= availableWidth - config.minWidth; x += GRID_SIZE) {
        if (!hasCollision(x, y, config.minWidth, config.minHeight, existingPanels)) {
          return { x, y, width: config.minWidth, height: config.minHeight };
        }
      }
    }

    return { x: 0, y: 0, width: config.minWidth, height: config.minHeight };
  }, [getAvailableWidth, getAvailableHeight, hasCollision]);

  // Initialize panels with default layout
  const [panels, setPanels] = useState<Panel[]>(() => {
    // Will be set properly after mount when window dimensions are available
    return [];
  });

  const addPanel = useCallback((type: string) => {
    const config = PANEL_CONFIGS[type];
    if (!config) return;

    const position = getSimplePosition(type, panels);
    const newPanel: Panel = {
      id: Date.now().toString(),
      type,
      x: position.x,
      y: position.y,
      width: position.width,
      height: position.height,
      title: config.title,
      locked: false,
    };
    setPanels((prev) => [...prev, newPanel]);
  }, [panels, getSimplePosition]);

  const removePanel = useCallback((id: string) => {
    setPanels((prev) => prev.filter((panel) => panel.id !== id));
  }, []);

  const togglePanelLock = useCallback((id: string) => {
    setPanels((prev) =>
      prev.map((panel) =>
        panel.id === id ? { ...panel, locked: !panel.locked } : panel,
      ),
    );
  }, []);

  const createDefaultLayout = useCallback(() => {
    const availableWidth = getAvailableWidth();
    const availableHeight = getAvailableHeight();
    
    // Calculate dimensions for the layout
    const gap = MIN_PANEL_GAP;
    const topRowHeight = Math.floor(availableHeight * 0.6); // 60% for top row
    const bottomRowHeight = availableHeight - topRowHeight - gap; // Remaining for bottom row
    
    // Top row: Game View (2/3) + World Map (1/3)
    const gameViewWidth = Math.floor(availableWidth * 0.65);
    const worldMapWidth = availableWidth - gameViewWidth - gap;
    
    // Bottom row: Inventory + Squad + Competitions (equal thirds)
    const bottomPanelWidth = Math.floor((availableWidth - (2 * gap)) / 3);
    
    const panels: Panel[] = [
      // Game View - top left (primary panel)
      {
        id: "main-game",
        type: "gameview",
        x: 0,
        y: 0,
        width: gameViewWidth,
        height: topRowHeight,
        title: "Game View",
        locked: true,
      },
      
      // World Map - top right
      {
        id: "world-map-top",
        type: "worldmap",
        x: gameViewWidth + gap,
        y: 0,
        width: worldMapWidth,
        height: topRowHeight,
        title: "World Map",
        locked: false,
      },
      
      // Inventory - bottom left
      {
        id: "inventory-panel",
        type: "inventory",
        x: 0,
        y: topRowHeight + gap,
        width: bottomPanelWidth,
        height: bottomRowHeight,
        title: "Inventory",
        locked: false,
      },
      
      // Squad - bottom center
      {
        id: "squad-panel",
        type: "squad",
        x: bottomPanelWidth + gap,
        y: topRowHeight + gap,
        width: bottomPanelWidth,
        height: bottomRowHeight,
        title: "Squad",
        locked: false,
      },
      
      // Competitions - bottom right
      {
        id: "competitions-panel",
        type: "competitions",
        x: (bottomPanelWidth + gap) * 2,
        y: topRowHeight + gap,
        width: bottomPanelWidth,
        height: bottomRowHeight,
        title: "Competitions",
        locked: false,
      },
    ];
    
    return panels;
  }, [getAvailableWidth, getAvailableHeight]);

  const resetLayout = useCallback(() => {
    setPanels(createDefaultLayout());
  }, [createDefaultLayout]);

  // Initialize default layout on mount and handle sidebar toggles
  useEffect(() => {
    if (panels.length === 0) {
      // Initialize with default layout on first mount
      setPanels(createDefaultLayout());
    } else {
      // Auto-reposition panels when sidebar toggles
      setPanels((prev) => {
        const availableWidth = getAvailableWidth();
        return prev.map((panel) => {
          if (!panel.locked && panel.x + panel.width > availableWidth) {
            return {
              ...panel,
              x: Math.max(0, availableWidth - panel.width),
            };
          }
          return panel;
        });
      });
    }
  }, [sidebarOpen, getAvailableWidth, createDefaultLayout, panels.length]);

  return {
    panels,
    setPanels,
    addPanel,
    removePanel,
    togglePanelLock,
    resetLayout,
    createDefaultLayout,
    getAvailableWidth,
    getAvailableHeight,
  };
};