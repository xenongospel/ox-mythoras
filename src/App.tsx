import { useEffect, useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import DevToolkit from './components/DevToolkit'
import PanelRenderer from './components/PanelRenderer'
import PlayerHUD from './components/PlayerHUD'
import { Shell } from './components/Shell'
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from './constants/layout'
import { useDragAndResize } from './hooks/useDragAndResize'
import { usePanelManagement } from './hooks/usePanelManagement'
import queryClient from './stores/queryClient'

export default function App() {
  // Basic state
  const [searchQuery, setSearchQuery] = useState('')
  const [currentDate] = useState(new Date(2024, 7, 1))
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showHeaders, setShowHeaders] = useState(true)
  const [showCalendar, setShowCalendar] = useState(false)

  // GameView UI toggles
  const [showGameViewFPS, setShowGameViewFPS] = useState(true)
  const [showGameViewControls, setShowGameViewControls] = useState(true)
  const [showGameViewMinimap, setShowGameViewMinimap] = useState(true)

  // Game simulation state - fresh start
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentRegion] = useState('Valdris Reach')
  const [playerLevel] = useState(1)
  const [campaignDay] = useState(1)

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
      <div className="w-full h-screen bg-bg-canvas text-text-1 overflow-hidden flex flex-col">
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
          isSimulating={isSimulating}
          toggleSimulation={toggleSimulation}
          currentRegion={currentRegion}
          campaignDay={campaignDay}
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
            {/* Player HUD overlays */}
            <PlayerHUD
              showFPS={showGameViewFPS}
              showControls={showGameViewControls}
              showMinimap={showGameViewMinimap}
            />
          </div>

          {/* Right Sidebar */}
          <DevToolkit
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
            onSaveLayout={saveLayout}
            onLoadLayout={loadLayout}
            onResetLayout={resetLayout}
            onCreateDefaultLayout={() => setPanels(createDefaultLayout())}
            onAddPanel={addPanel}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
    </QueryClientProvider>
  )
}
