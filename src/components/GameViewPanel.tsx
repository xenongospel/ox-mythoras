// DEPRECATED: Use SimpleGameViewPanel instead
import React, { useState, useCallback, useEffect } from 'react';

export const GameViewPanel: React.FC = () => {
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  const [currentZone, setCurrentZone] = useState('hideout');
  const [isFocused, setIsFocused] = useState(false);

  // Listen for fast travel events
  useEffect(() => {
    const handleFastTravel = (event: CustomEvent) => {
      const { locationId, template } = event.detail;
      setCurrentZone(template);
      setPlayerPos([0, 0]);
      console.log(`Traveled to ${locationId} with template ${template}`);
    };

    window.addEventListener('fastTravel', handleFastTravel as EventListener);
    return () => window.removeEventListener('fastTravel', handleFastTravel as EventListener);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayerPos(prev => {
      let newPos: [number, number] = [...prev];
      switch (direction) {
        case 'up':
          newPos[1] = Math.max(-10, prev[1] - 1);
          break;
        case 'down':
          newPos[1] = Math.min(10, prev[1] + 1);
          break;
        case 'left':
          newPos[0] = Math.max(-10, prev[0] - 1);
          break;
        case 'right':
          newPos[0] = Math.min(10, prev[0] + 1);
          break;
      }
      return newPos;
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isFocused) return;
    
    switch (e.key.toLowerCase()) {
      case 'w':
        movePlayer('up');
        break;
      case 's':
        movePlayer('down');
        break;
      case 'a':
        movePlayer('left');
        break;
      case 'd':
        movePlayer('right');
        break;
    }
  }, [isFocused, movePlayer]);

  useEffect(() => {
    if (isFocused) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFocused, handleKeyDown]);

  // Generate simple grid representation
  const generateGrid = () => {
    const grid = [];
    for (let y = -5; y <= 5; y++) {
      for (let x = -5; x <= 5; x++) {
        const isPlayer = x === playerPos[0] && y === playerPos[1];
        const isCenter = x === 0 && y === 0;
        const isPath = (x === 0 && Math.abs(y) <= 3) || (y === 0 && Math.abs(x) <= 3);
        
        let content = '·';
        let className = 'text-gray-600';
        
        if (isPlayer) {
          content = '▲';
          className = 'text-green-400 animate-pulse';
        } else if (isCenter) {
          content = '⊕';
          className = 'text-yellow-400';
        } else if (isPath) {
          content = '─';
          className = 'text-gray-400';
        }
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`w-6 h-6 flex items-center justify-center text-xs ${className} select-none`}
          >
            {content}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div 
      className="h-full bg-black relative cursor-pointer outline-none flex flex-col"
      onClick={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
    >
      {/* Focus indicator */}
      {isFocused && (
        <div className="absolute top-2 right-2 z-10 bg-green-400 text-black px-2 py-1 text-xs">
          FOCUSED
        </div>
      )}
      
      {/* Terminal overlay */}
      <div className="absolute top-2 left-2 text-xs text-green-400 bg-black/80 px-2 py-1 backdrop-blur-sm">
        <div>POS: [{playerPos[0]}, {playerPos[1]}]</div>
        <div>ZONE: {currentZone.toUpperCase()}</div>
        <div>STATUS: {isFocused ? 'ACTIVE' : 'STANDBY'}</div>
      </div>

      {/* Main game view */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-gray-900/50 border border-gray-700 p-4 backdrop-blur-sm">
          <div className="text-center mb-4">
            <h3 className="text-green-400 uppercase mb-2">TECHNICIAN VIEW</h3>
            <div className="text-xs text-gray-400">ZONE: {currentZone}</div>
          </div>
          
          {/* ASCII-style game grid */}
          <div 
            className="grid grid-cols-11 gap-0 bg-gray-900 border border-gray-600 p-2"
            style={{ fontSize: '12px', fontFamily: 'Monaco, monospace' }}
          >
            {generateGrid()}
          </div>
          
          {/* Legend */}
          <div className="text-xs text-gray-500 mt-4 space-y-1">
            <div>▲ = TECHNICIAN</div>
            <div>⊕ = CENTRAL HUB</div>
            <div>─ = PATH</div>
            <div>· = TERRAIN</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 text-xs text-green-400 bg-black/80 px-2 py-1 backdrop-blur-sm">
        <div>{isFocused ? 'WASD: MOVE' : 'CLICK TO FOCUS'}</div>
        <div>ENTER: INTERACT</div>
      </div>

      {/* Movement controls */}
      <div className="absolute bottom-2 right-2 grid grid-cols-3 gap-1">
        <div></div>
        <button 
          className="w-8 h-8 bg-gray-800/80 border border-gray-600 text-green-400 text-xs hover:bg-gray-700 backdrop-blur-sm"
          onClick={() => movePlayer('up')}
        >
          W
        </button>
        <div></div>
        <button 
          className="w-8 h-8 bg-gray-800/80 border border-gray-600 text-green-400 text-xs hover:bg-gray-700 backdrop-blur-sm"
          onClick={() => movePlayer('left')}
        >
          A
        </button>
        <button 
          className="w-8 h-8 bg-gray-800/80 border border-gray-600 text-green-400 text-xs hover:bg-gray-700 backdrop-blur-sm"
          onClick={() => movePlayer('down')}
        >
          S
        </button>
        <button 
          className="w-8 h-8 bg-gray-800/80 border border-gray-600 text-green-400 text-xs hover:bg-gray-700 backdrop-blur-sm"
          onClick={() => movePlayer('right')}
        >
          D
        </button>
      </div>

      {/* Click overlay when not focused */}
      {!isFocused && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-gray-900/90 border border-gray-600 px-4 py-2 text-green-400">
            CLICK TO FOCUS GAME VIEW
          </div>
        </div>
      )}
    </div>
  );
};

export default GameViewPanel;