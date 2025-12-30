import React from 'react'
import useSimulationStore from '../stores/simulationStore'

interface PlayerHUDProps {
  showFPS?: boolean
  showControls?: boolean
  showMinimap?: boolean
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({ showFPS = true, showControls = true, showMinimap = true }) => {
  // Read authoritative HUD state from simulationStore
  const fps = useSimulationStore(state => state.fps)
  const playTime = useSimulationStore(state => state.playTime)
  const posObj = useSimulationStore(state => state.position)
  const pos = [posObj.x, posObj.z]

  return (
    <>
      {showFPS && (
        <div className="absolute top-3 right-3 bg-surface-0 border border-border px-3 py-2 text-xs mono space-y-1 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span className="text-teal-500">FPS: {fps}</span>
          </div>
          <div className="text-text-3">Pos: {pos[0].toFixed(1)},{pos[1].toFixed(1)}</div>
          <div className="text-violet-500">Time: {Math.floor(playTime)}s</div>
        </div>
      )}

      {showControls && (
        <div className="absolute bottom-3 left-3 bg-surface-0 border border-border p-3 text-xs backdrop-blur-sm">
          <div className="text-violet-500 mb-2 tracking-wide">Controls</div>
          <div className="text-text-2 space-y-1">
            <div className="text-text-3 tracking-wide">W: Forward</div>
            <div className="text-text-3 tracking-wide">A: Left</div>
            <div className="text-text-3 tracking-wide">S: Backward</div>
            <div className="text-text-3 tracking-wide">D: Right</div>
          </div>
        </div>
      )}

      {showMinimap && (
        <div className="absolute bottom-3 right-3 w-28 h-28 bg-surface-0 border border-border p-2 backdrop-blur-sm">
          <div className="w-full h-full bg-bg-canvas border border-gridline relative">
            <div className="text-xs text-violet-500 text-center mb-1 mono tracking-wide">MAP</div>
            <div className="absolute w-1.5 h-1.5 bg-teal-500 rounded-full" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }} />
            <div className="absolute w-1 h-1 bg-violet-500 rounded-full" style={{ left: '60%', top: '60%' }} />
            <div className="absolute w-1 h-1 bg-warn rounded-full" style={{ left: '20%', top: '30%' }} />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(var(--gridline) 1px, transparent 1px),
                  linear-gradient(90deg, var(--gridline) 1px, transparent 1px)
                `,
                backgroundSize: '4px 4px',
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default PlayerHUD


