import React from 'react'
import { PANEL_CONFIGS } from '../config/panels'
import usePanelStore from '../stores/panelStore'
import useBreakpoint from '../hooks/useBreakpoint'
import { Button } from './ui/button'

export const PanelDock: React.FC = () => {
  const panels = usePanelStore(s => s.panels)
  const addPanel = usePanelStore(s => s.addPanel)
  const removePanel = usePanelStore(s => s.removePanel)
  const bp = useBreakpoint()

  const panelTypes = Object.entries(PANEL_CONFIGS)

  const handleToggle = (type: string) => {
    const existing = panels.find(p => p.type === type)
    if (existing) {
      removePanel(existing.id)
      return
    }

    const cfg = PANEL_CONFIGS[type]
    const newPanel = {
      id: Date.now().toString(),
      type,
      x: 40,
      y: 40,
      width: cfg?.minWidth || 320,
      height: cfg?.minHeight || 300,
      title: cfg?.title || type,
      locked: false,
    }
    addPanel(newPanel as any)
  }

  // Compact dock styling: horizontal on small screens, vertical on large
  const isHorizontal = bp === 'sm' || bp === 'md'

  return (
    <div
      className={`absolute z-50 ${isHorizontal ? 'bottom-4 left-1/2 transform -translate-x-1/2' : 'left-4 top-1/2 transform -translate-y-1/2'}`}
      aria-hidden={false}
    >
      <div className={`flex ${isHorizontal ? 'flex-row gap-2' : 'flex-col gap-2'}`}>
        {panelTypes.map(([type, cfg]) => {
          const active = panels.some(p => p.type === type)
          const Icon = cfg.icon
          return (
            <Button
              key={type}
              variant={active ? 'default' : 'ghost'}
              onClick={() => handleToggle(type)}
              title={cfg.title}
              className="w-10 h-10 flex items-center justify-center"
            >
              <Icon className={`w-4 h-4 ${active ? 'text-teal-500' : 'text-text-3'}`} />
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default PanelDock




