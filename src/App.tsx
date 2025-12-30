import { useEffect, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import PanelRenderer from './components/PanelRenderer'
import { Shell } from './components/Shell'
import StatusFooter from './components/StatusFooter'
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants/layout'
import useBreakpoint from './hooks/useBreakpoint'
import { useDragAndResize } from './hooks/useDragAndResize'
import { usePanelManagement } from './hooks/usePanelManagement'
import queryClient from './stores/queryClient'
import useUIStore from './stores/uiStore'

export default function App() {
  // Basic state
  const [searchQuery, setSearchQuery] = useState('')
  const [currentDate] = useState(new Date(2024, 7, 1))
  const sidebarOpen = useUIStore(s => s.sidebarOpen)
  const setSidebarOpen = useUIStore(s => s.setSidebarOpen)
  const showHeaders = useUIStore(s => s.showHeaders)
  const setShowHeaders = useUIStore(s => s.setShowHeaders)
  const [showCalendar, setShowCalendar] = useState(false)

  // GameView UI toggles
  const showGameViewFPS = useUIStore(s => s.showGameViewFPS)
  const setShowGameViewFPS = useUIStore(s => s.setShowGameViewFPS)
  const showGameViewControls = useUIStore(s => s.showGameViewControls)
  const setShowGameViewControls = useUIStore(s => s.setShowGameViewControls)
  const showGameViewMinimap = useUIStore(s => s.showGameViewMinimap)
  const setShowGameViewMinimap = useUIStore(s => s.setShowGameViewMinimap)

  // Game simulation state - fresh start
  const [isSimulating, setIsSimulating] = useState(false)
  const currentRegion = useUIStore(s => s.currentLocation)
  const playerLevel = useUIStore(s => s.playerLevel)
  const playerName = useUIStore(s => s.playerName)
  const currentAct = useUIStore(s => s.currentAct)

  // Panel management
  const {
    panels,
    setPanels,
    addPanel,
    removePanel,
    togglePanelLock,
    resetLayout,
    createDefaultLayout,
    getAvailableWidth,
    getAvailableHeight,
  } = usePanelManagement(sidebarOpen)

  // Drag and resize
  const { draggedPanel, handleMouseDown } = useDragAndResize(
    panels,
    setPanels,
    getAvailableWidth,
    getAvailableHeight
  )

  // Layout management state
  const [savedLayouts, setSavedLayouts] = useState<{ [key: string]: any[] }>({})
  const [layoutName, setLayoutName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showLoadDialog, setShowLoadDialog] = useState(false)

  // Layout functions
  const saveLayout = () => {
    if (!layoutName.trim()) return
    const newLayouts = { ...savedLayouts, [layoutName]: [...panels] }
    localStorage.setItem('mythoras-layouts', JSON.stringify(newLayouts))
    setSavedLayouts(newLayouts)
    setLayoutName('')
    setShowSaveDialog(false)
  }

  const loadLayout = (name: string) => {
    if (savedLayouts[name]) {
      setPanels([...savedLayouts[name]])
      setShowLoadDialog(false)
    }
  }

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating)
  }

  // Load saved layouts on mount
  useEffect(() => {
    const saved = localStorage.getItem('mythoras-layouts')
    if (saved) {
      try {
        setSavedLayouts(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved layouts:', e)
      }
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className="w-full h-screen bg-bg-canvas text-text-1 overflow-hidden flex flex-col"
        data-breakpoint={useBreakpoint()}
      >
        <Shell
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentDate={currentDate}
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          showGameViewFPS={showGameViewFPS}
          setShowGameViewFPS={setShowGameViewFPS}
          showGameViewControls={showGameViewControls}
          setShowGameViewControls={setShowGameViewControls}
          showGameViewMinimap={showGameViewMinimap}
          setShowGameViewMinimap={setShowGameViewMinimap}
          currentRegion={currentRegion}
          currentAct={currentAct}
          playerName={playerName}
          playerLevel={playerLevel}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div
            className="relative bg-bg-canvas panel-transition"
            style={{
              width: sidebarOpen ? `calc(100vw - ${SIDEBAR_WIDTH}px)` : '100vw',
              height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              position: 'relative',
            }}
          >
            {/* Panel rendering */}
            <PanelRenderer
              panels={panels}
              draggedPanel={draggedPanel}
              handleMouseDown={handleMouseDown}
              removePanel={removePanel}
              togglePanelLock={togglePanelLock}
              showHeaders={showHeaders}
              showGameViewFPS={showGameViewFPS}
              showGameViewControls={showGameViewControls}
              showGameViewMinimap={showGameViewMinimap}
            />
            {/* Player HUD is rendered inside the Game View panel to ensure it is clipped and positioned relative to the panel. */}
          </div>

          {/* Right Sidebar */}
          {/*
            DevToolkit temporarily disabled in main window per Phase A.
            Developer tools will be moved to a separate Tauri window (devtools).
          */}
        </div>
        <StatusFooter />
      </div>
    </QueryClientProvider>
  )
}
