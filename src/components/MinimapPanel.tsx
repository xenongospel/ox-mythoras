import React, { useEffect, useRef } from 'react';

interface MapPoint {
  x: number;
  y: number;
  type: 'player' | 'npc' | 'enemy' | 'resource' | 'waypoint';
  name?: string;
}

const MAP_POINTS: MapPoint[] = [
  { x: 0.5, y: 0.5, type: 'player' },
  { x: 0.3, y: 0.2, type: 'npc', name: 'Vendor' },
  { x: 0.7, y: 0.8, type: 'enemy', name: 'Dragon' },
  { x: 0.2, y: 0.7, type: 'resource', name: 'Mythril Vein' },
  { x: 0.8, y: 0.3, type: 'waypoint', name: 'Portal' },
  { x: 0.6, y: 0.4, type: 'enemy', name: 'Goblin' },
  { x: 0.4, y: 0.6, type: 'resource', name: 'Crystal' },
];

const POINT_COLORS = {
  player: '#fde047',
  npc: '#22d3ee',
  enemy: '#ef4444',
  resource: '#22c55e',
  waypoint: '#a855f7',
};

export const MinimapPanel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background terrain
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#1f2937');
      gradient.addColorStop(1, '#111827');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw terrain features
      ctx.fillStyle = '#065f46';
      ctx.fillRect(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.3, canvas.height * 0.2);
      
      ctx.fillStyle = '#1e40af';
      ctx.beginPath();
      ctx.arc(canvas.width * 0.8, canvas.height * 0.7, 30, 0, Math.PI * 2);
      ctx.fill();

      // Draw map points
      MAP_POINTS.forEach((point) => {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;
        
        ctx.fillStyle = POINT_COLORS[point.type];
        ctx.beginPath();
        
        if (point.type === 'player') {
          // Player triangle
          ctx.moveTo(x, y - 8);
          ctx.lineTo(x - 6, y + 6);
          ctx.lineTo(x + 6, y + 6);
          ctx.closePath();
          ctx.fill();
          
          // Player glow
          ctx.shadowColor = POINT_COLORS[point.type];
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // Other points as circles
          ctx.arc(x, y, point.type === 'enemy' ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();
          
          if (point.type === 'enemy') {
            ctx.shadowColor = POINT_COLORS[point.type];
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Draw location name
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Mystic Forest', canvas.width / 2, 20);
      
      // Draw compass
      const compassX = canvas.width - 25;
      const compassY = 25;
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(compassX, compassY, 15, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('N', compassX, compassY - 8);
    };

    render();

    // Animation loop for pulsing effects
    let animationId: number;
    const animate = () => {
      render();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="h-full bg-gradient-to-b from-gray-800/40 to-gray-900/40 rounded-b-md relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 right-2 bg-purple-900/80 rounded-md p-2">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-400 rounded"></div>
            <span className="text-yellow-200">You</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-cyan-400 rounded"></div>
            <span className="text-cyan-200">NPC</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-400 rounded"></div>
            <span className="text-red-200">Enemy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded"></div>
            <span className="text-green-200">Resource</span>
          </div>
        </div>
      </div>
    </div>
  );
};