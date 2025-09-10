import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';

// Player Character Component with movement
const Player: React.FC<{ 
  position: [number, number, number];
  onPositionChange: (pos: [number, number, number]) => void;
}> = ({ position, onPositionChange }) => {
  const meshRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Simple idle animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh ref={meshRef} position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshPhongMaterial color="#2CC7A6" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshPhongMaterial color="#EAE6F6" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.5, 1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshPhongMaterial color="#7A53E6" />
      </mesh>
      <mesh position={[0.5, 1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshPhongMaterial color="#7A53E6" />
      </mesh>
    </group>
  );
};

// Enhanced Environment with more interactive elements
const Environment: React.FC<{ onGroundClick: (event: any) => void }> = ({ onGroundClick }) => {
  return (
    <>
      {/* Ground with texture pattern - clickable for movement */}
      <mesh 
        position={[0, -0.5, 0]} 
        receiveShadow
        onClick={onGroundClick}
      >
        <boxGeometry args={[20, 1, 20]} />
        <meshPhongMaterial color="#1E1C25" />
      </mesh>
      
      {/* Grid pattern on ground */}
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i}>
          <mesh position={[i * 2 - 9, -0.49, 0]} receiveShadow>
            <boxGeometry args={[0.1, 0.02, 20]} />
            <meshPhongMaterial color="#2E2A36" />
          </mesh>
          <mesh position={[0, -0.49, i * 2 - 9]} receiveShadow>
            <boxGeometry args={[20, 0.02, 0.1]} />
            <meshPhongMaterial color="#2E2A36" />
          </mesh>
        </group>
      ))}
      
      {/* Interactive structures */}
      <mesh position={[3, 0.5, 3]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhongMaterial color="#6E3CCF" />
      </mesh>
      
      <mesh position={[-4, 0.5, -2]} castShadow>
        <boxGeometry args={[1.5, 1, 1]} />
        <meshPhongMaterial color="#18B3A5" />
      </mesh>
      
      <mesh position={[2, 0.5, -4]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshPhongMaterial color="#CF9E3C" />
      </mesh>

      {/* Trees */}
      {[
        [-2, 4], [5, -3], [-6, 1], [7, 6], [-3, -5]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 2]} />
            <meshPhongMaterial color="#8E879C" />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <sphereGeometry args={[1]} />
            <meshPhongMaterial color="#2EC48A" />
          </mesh>
        </group>
      ))}

      {/* Collectible items */}
      <mesh position={[1, 0.3, 2]} castShadow>
        <dodecahedronGeometry args={[0.3]} />
        <meshPhongMaterial color="#7C6DF2" emissive="#7C6DF2" emissiveIntensity={0.1} />
      </mesh>
      
      <mesh position={[-1, 0.3, -3]} castShadow>
        <octahedronGeometry args={[0.3]} />
        <meshPhongMaterial color="#CF9E3C" emissive="#CF9E3C" emissiveIntensity={0.1} />
      </mesh>
    </>
  );
};

// Camera Controller for isometric view (Path of Exile inspired)
const CameraController: React.FC<{ playerPosition: [number, number, number] }> = ({ playerPosition }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Isometric camera position - static behind player like Path of Exile
    const offset = [6, 10, 6]; // Slightly closer and higher for better view
    const targetX = playerPosition[0] + offset[0];
    const targetY = offset[1];
    const targetZ = playerPosition[2] + offset[2];
    
    // Smooth camera following
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(playerPosition[0], playerPosition[1], playerPosition[2]);
  });

  return null;
};

interface SimpleGameViewPanelProps {
  showFPS?: boolean;
  showControls?: boolean;
  showMinimap?: boolean;
  width?: number;
  height?: number;
}

export const SimpleGameViewPanel: React.FC<SimpleGameViewPanelProps> = ({ 
  showFPS = true,
  showControls = true,
  showMinimap = true,
  width,
  height 
}) => {
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const [gameStats, setGameStats] = useState({
    fps: 60,
    playTime: 0,
    itemsCollected: 0
  });

  // Movement speed
  const moveSpeed = 0.1;

  // Key event handlers
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setKeys(prev => new Set(prev).add(event.key.toLowerCase()));
    
    // Handle interaction
    if (event.key.toLowerCase() === 'e') {
      // Check if near an interactive object
      if (Math.abs(playerPosition[0] - 3) < 1 && Math.abs(playerPosition[2] - 3) < 1) {
        console.log('Interacting with object...');
        // Trigger fast travel or other interaction
        window.dispatchEvent(new CustomEvent('fastTravel', { 
          detail: { locationId: 'training-grounds', template: 'arena' }
        }));
      }
    }
  }, [playerPosition]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    setKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(event.key.toLowerCase());
      return newKeys;
    });
  }, []);

  // Movement update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPosition(currentPos => {
        let [x, y, z] = currentPos;
        
        // WASD movement
        if (keys.has('w')) z -= moveSpeed;
        if (keys.has('s')) z += moveSpeed;
        if (keys.has('a')) x -= moveSpeed;
        if (keys.has('d')) x += moveSpeed;
        
        // Boundary checks
        x = Math.max(-9, Math.min(9, x));
        z = Math.max(-9, Math.min(9, z));
        
        return [x, y, z];
      });
      
      // Update game stats
      setGameStats(prev => ({
        ...prev,
        playTime: prev.playTime + 0.1,
        fps: Math.floor(58 + Math.random() * 4) // Simulate FPS variation
      }));
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [keys, moveSpeed]);

  // Click to move handler
  const handleCanvasClick = useCallback((event: any) => {
    console.log('Ground clicked:', event);
    if (event && event.point) {
      const clickedPosition: [number, number, number] = [
        event.point.x,
        0,
        event.point.z
      ];
      
      // Boundary checks for clicked position
      const boundedX = Math.max(-9, Math.min(9, clickedPosition[0]));
      const boundedZ = Math.max(-9, Math.min(9, clickedPosition[2]));
      
      setPlayerPosition([boundedX, 0, boundedZ]);
      console.log('Moving to:', [boundedX, 0, boundedZ]);
    }
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="h-full w-full bg-bg-canvas relative">
      {/* Game Canvas - Dark matte surface as per guidelines */}
      <Canvas
        shadows
        camera={{
          position: [6, 10, 6],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0);
        }}
        style={{ background: '#0E0D12' }}
      >
        {/* Lighting - Enhanced for better visibility */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 5]}
          intensity={2.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#7A53E6" />
        <hemisphereLight skyColor="#EAE6F6" groundColor="#1E1C25" intensity={0.4} />
        
        {/* Scene */}
        <Environment onGroundClick={handleCanvasClick} />
        <Player 
          position={playerPosition} 
          onPositionChange={setPlayerPosition}
        />
        
        {/* Camera follows player */}
        <CameraController playerPosition={playerPosition} />
        
        {/* UI Elements in 3D space */}
        <Text
          position={[0, 5, 0]}
          fontSize={0.4}
          color="#7A53E6"
          anchorX="center"
          anchorY="middle"
        >
          MYTHORAS OVERWORLD
        </Text>
      </Canvas>

      {/* FPS/Latency chip - top right corner as per guidelines */}
      {showFPS && (
        <div className="absolute top-3 right-3 bg-surface-0 border border-border px-3 py-2 text-xs mono space-y-1 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span className="text-teal-500">FPS: {gameStats.fps}</span>
          </div>
          <div className="text-text-3">
            Pos: {playerPosition[0].toFixed(1)},{playerPosition[2].toFixed(1)}
          </div>
          <div className="text-violet-500">
            Time: {Math.floor(gameStats.playTime)}s
          </div>
          <div className="text-text-3">
            Latency: 24ms
          </div>
        </div>
      )}

      {/* Controls Info */}
      {showControls && (
        <div className="absolute bottom-3 left-3 bg-surface-0 border border-border p-3 text-xs backdrop-blur-sm">
          <div className="text-violet-500 mb-2 tracking-wide">Controls</div>
          <div className="text-text-2 space-y-1">
            <div className={`${keys.has('w') ? 'text-teal-500' : 'text-text-3'} tracking-wide`}>W: Forward</div>
            <div className={`${keys.has('a') ? 'text-teal-500' : 'text-text-3'} tracking-wide`}>A: Left</div>
            <div className={`${keys.has('s') ? 'text-teal-500' : 'text-text-3'} tracking-wide`}>S: Backward</div>
            <div className={`${keys.has('d') ? 'text-teal-500' : 'text-text-3'} tracking-wide`}>D: Right</div>
          </div>
        </div>
      )}

      {/* Minimap */}
      {showMinimap && (
        <div className="absolute bottom-3 right-3 w-28 h-28 bg-surface-0 border border-border p-2 backdrop-blur-sm">
          <div className="w-full h-full bg-bg-canvas border border-gridline relative">
            <div className="text-xs text-violet-500 text-center mb-1 mono tracking-wide">MAP</div>
            {/* Player dot */}
            <div 
              className="absolute w-1.5 h-1.5 bg-teal-500 rounded-full"
              style={{
                left: `${(playerPosition[0] + 9) * (100/18)}%`,
                top: `${(playerPosition[2] + 9) * (100/18)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
            {/* Static objects */}
            <div className="absolute w-1 h-1 bg-violet-500 rounded-full" style={{ left: '60%', top: '60%' }} />
            <div className="absolute w-1 h-1 bg-warn rounded-full" style={{ left: '20%', top: '30%' }} />
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(var(--gridline) 1px, transparent 1px),
                  linear-gradient(90deg, var(--gridline) 1px, transparent 1px)
                `,
                backgroundSize: '4px 4px'
              }}
            />
          </div>
        </div>
      )}

      {/* Action hints */}
      {keys.size > 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-surface-0 border border-teal-500 px-3 py-2 text-teal-500 text-xs mono tracking-wide backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              MOVING
            </div>
          </div>
        </div>
      )}

      {/* Fast Travel hint when near objects */}
      {(Math.abs(playerPosition[0] - 3) < 1 && Math.abs(playerPosition[2] - 3) < 1) && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="bg-surface-0 border border-violet-500 px-3 py-2 text-violet-500 text-xs mono tracking-wide backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              Press E to Interact
            </div>
          </div>
        </div>
      )}
    </div>
  );
};