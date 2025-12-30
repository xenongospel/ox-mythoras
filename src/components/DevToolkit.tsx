import React, { useEffect } from 'react'
import { AppSidebar } from './AppSidebar'
import useBreakpoint from '../hooks/useBreakpoint'

interface DevToolkitProps {
  panels: any[]
  savedLayouts: { [key: string]: any[] }
  layoutName: string
  setLayoutName: (name: string) => void
  showSaveDialog: boolean
  setShowSaveDialog: (show: boolean) => void
  showLoadDialog: boolean
  setShowLoadDialog: (show: boolean) => void
  showHeaders: boolean
  setShowHeaders: (show: boolean) => void
  showGameViewFPS: boolean
  setShowGameViewFPS: (show: boolean) => void
  showGameViewControls: boolean
  setShowGameViewControls: (show: boolean) => void
  showGameViewMinimap: boolean
  setShowGameViewMinimap: (show: boolean) => void
  onSaveLayout: () => void
  onLoadLayout: (name: string) => void
  onResetLayout: () => void
  onCreateDefaultLayout: () => void
  onAddPanel: (type: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const DevToolkit: React.FC<DevToolkitProps> = ({
  panels,
  savedLayouts,
  layoutName,
  setLayoutName,
  showSaveDialog,
  setShowSaveDialog,
  showLoadDialog,
  setShowLoadDialog,
  showHeaders,
  setShowHeaders,
  showGameViewFPS,
  setShowGameViewFPS,
  showGameViewControls,
  setShowGameViewControls,
  showGameViewMinimap,
  setShowGameViewMinimap,
  onSaveLayout,
  onLoadLayout,
  onResetLayout,
  onCreateDefaultLayout,
  onAddPanel,
  sidebarOpen,
  setSidebarOpen,
}) => {
  // Only enable toolkit in dev builds
  const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV
  // hide DevToolkit on small/medium breakpoints to avoid cluttering prototype UI
  const bp = useBreakpoint()

  useEffect(() => {
    if (!isDev) return

    const onKey = (e: KeyboardEvent) => {
      // Toggle sidebar with Ctrl+`
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault()
        setSidebarOpen(!sidebarOpen)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDev, sidebarOpen, setSidebarOpen])

  if (!isDev) return null
  if (bp === 'md' || bp === 'sm') return null

  return (
    <div
      className={`bg-surface-0 border-l border-border overflow-y-auto panel-transition absolute right-0 top-0 bottom-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{
        width: 320,
        boxShadow: sidebarOpen ? '-4px 0 12px rgba(0, 0, 0, 0.2)' : 'none',
      }}
    >
      <AppSidebar
        panels={panels}
        savedLayouts={savedLayouts}
        layoutName={layoutName}
        setLayoutName={setLayoutName}
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        showLoadDialog={showLoadDialog}
        setShowLoadDialog={setShowLoadDialog}
        showHeaders={showHeaders}
        setShowHeaders={setShowHeaders}
        showGameViewFPS={showGameViewFPS}
        setShowGameViewFPS={setShowGameViewFPS}
        showGameViewControls={showGameViewControls}
        setShowGameViewControls={setShowGameViewControls}
        showGameViewMinimap={showGameViewMinimap}
        setShowGameViewMinimap={setShowGameViewMinimap}
        onSaveLayout={onSaveLayout}
        onLoadLayout={onLoadLayout}
        onResetLayout={onResetLayout}
        onCreateDefaultLayout={onCreateDefaultLayout}
        onAddPanel={onAddPanel}
      />
    </div>
  )
}

export default DevToolkit


