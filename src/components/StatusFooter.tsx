import React from 'react'
import useSimulationStore from '../stores/simulationStore'

export const StatusFooter: React.FC = () => {
  const fps = useSimulationStore(s => s.fps)
  const pos = useSimulationStore(s => s.position)
  const processed = useSimulationStore(s => (s as any).processedCommands ?? 0)

  return (
    <div className="absolute left-0 right-0 bottom-0" style={{ zIndex: 2000 }}>
      <div className="mx-auto w-full max-w-screen-lg pointer-events-auto">
        <div className="bg-surface-1 border-t border-border text-xs text-text-2 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="mono">FPS: <span className="text-teal-500">{fps}</span></div>
            <div className="mono">Pos: {pos.x.toFixed(1)}, {pos.z.toFixed(1)}</div>
            <div className="mono">Processed: {processed}</div>
          </div>
          <div className="mono opacity-60">Dev status</div>
        </div>
      </div>
    </div>
  )
}

export default StatusFooter


