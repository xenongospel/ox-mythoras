import React from 'react'
import { PANEL_COMPONENTS } from '../config/panels'
import { PANEL_CONFIGS } from '../config/panels'
import { GRID_SIZE } from '../components/constants/panels'
import { GripHorizontal, Lock, Unlock, Minus, X } from 'lucide-react'
import { normalizePanels } from '../utils/panels'

import type { Panel as PanelType } from '../types/panel'

interface PanelRendererProps {
  panels: PanelType[]
  draggedPanel?: string | null
  handleMouseDown: (e: any, panelId: string, mode: 'drag' | 'resize') => void
  removePanel: (id: string) => void
  togglePanelLock: (id: string) => void
  showHeaders: boolean
  showGameViewFPS: boolean
  showGameViewControls: boolean
  showGameViewMinimap: boolean
}

export const PanelRenderer: React.FC<PanelRendererProps> = ({
  panels,
  draggedPanel,
  handleMouseDown,
  removePanel,
  togglePanelLock,
  showHeaders,
  showGameViewFPS,
  showGameViewControls,
  showGameViewMinimap,
}) => {
  const panelList = normalizePanels(panels)

  return (
    <>
      {panelList.map(panel => {
        const PanelComponent = PANEL_COMPONENTS[panel.type]
        const config = PANEL_CONFIGS[panel.type]

        return (
          <div
            key={panel.id}
            className="absolute bg-surface-0 border border-border overflow-hidden"
            style={{
              left: panel.x,
              top: panel.y,
              width: panel.width,
              height: panel.height,
              zIndex: draggedPanel === panel.id ? 1000 : 10,
              borderRadius: '8px',
              boxShadow:
                '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            {showHeaders && (
              <div className="panel-header flex items-center h-12 bg-surface-1 border-b border-border border-t-2 border-t-violet-500">
                <div
                  className={`flex items-center gap-3 px-4 py-2 flex-1 ${
                    panel.locked ? 'cursor-default' : 'cursor-move'
                  }`}
                  onMouseDown={e => handleMouseDown(e, panel.id, 'drag')}
                >
                  <GripHorizontal className="w-4 h-4 text-text-3" />
                  <div
                    className={`w-2 h-2 ${
                      panel.locked ? 'bg-danger' : 'bg-teal-500'
                    }`}
                  />
                  <span
                    className="text-base text-text-1 tracking-wider"
                    style={{ fontFamily: 'Cinzel, serif', fontWeight: 500 }}
                  >
                    {panel.title}
                  </span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => togglePanelLock(panel.id)}
                    className="w-10 h-10 flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-surface-0 hover-transition"
                  >
                    {panel.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-surface-0 hover-transition">
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    className="w-10 h-10 flex items-center justify-center text-text-3 hover:text-danger hover:bg-surface-0 hover-transition"
                    onClick={() => removePanel(panel.id)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="relative flex-1" style={{ height: showHeaders ? 'calc(100% - 48px)' : '100%' }}>
              {PanelComponent ? (
                <PanelComponent
                  width={panel.width}
                  height={showHeaders ? panel.height - 48 : panel.height}
                  {...(panel.type === 'gameview'
                    ? {
                        showFPS: showGameViewFPS,
                        showControls: showGameViewControls,
                        showMinimap: showGameViewMinimap,
                      }
                    : {})}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-text-3">
                  <div className="text-center space-y-2">
                    <div className="text-sm tracking-wider">System Loading...</div>
                    <div className="text-xs mono opacity-60 tracking-wide">Component not found</div>
                  </div>
                </div>
              )}
            </div>

            {!panel.locked && config?.canResize && (
              <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize group" onMouseDown={e => handleMouseDown(e, panel.id, 'resize')}>
                <div className="absolute -bottom-2 -right-2 w-8 h-8"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-text-3 rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-teal-500 hover-transition"></div>
              </div>
            )}
          </div>
        )
      })}

      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26, 25, 32, 0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26, 25, 32, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundPosition: '0 0',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
        }}
      />
    </>
  )
}

export default PanelRenderer


