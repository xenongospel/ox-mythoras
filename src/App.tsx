import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  Minus,
  X,
  GripHorizontal,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Shield,
  Clock,
  Calendar,
} from "lucide-react";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";

import { CampaignCalendar } from "./components/CampaignCalendar";
import { AppSidebar } from "./components/AppSidebar";
import { usePanelManagement } from "./hooks/usePanelManagement";
import { useDragAndResize } from "./hooks/useDragAndResize";
import { PANEL_COMPONENTS, PANEL_CONFIGS } from "./config/panels";
import { GRID_SIZE, HEADER_HEIGHT, SIDEBAR_WIDTH } from "./constants/layout";
import { formatDate, formatTime } from "./utils/formatting";

export default function App() {
  // Basic state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate] = useState(new Date(2024, 7, 1)); // August 1st, 2024
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showHeaders, setShowHeaders] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // GameView UI toggles
  const [showGameViewFPS, setShowGameViewFPS] = useState(true);
  const [showGameViewControls, setShowGameViewControls] = useState(true);
  const [showGameViewMinimap, setShowGameViewMinimap] = useState(true);

  // Game simulation state - fresh start
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentRegion] = useState("Valdris Reach");
  const [playerLevel] = useState(1);
  const [campaignDay] = useState(1);

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
  } = usePanelManagement(sidebarOpen);

  // Drag and resize
  const { draggedPanel, isResizing, handleMouseDown } = useDragAndResize(
    panels,
    setPanels,
    getAvailableWidth,
    getAvailableHeight,
  );

  // Layout management state
  const [savedLayouts, setSavedLayouts] = useState<{ [key: string]: any[] }>({});
  const [layoutName, setLayoutName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  // Layout functions
  const saveLayout = () => {
    if (!layoutName.trim()) return;
    const newLayouts = { ...savedLayouts, [layoutName]: [...panels] };
    localStorage.setItem("mythoras-layouts", JSON.stringify(newLayouts));
    setSavedLayouts(newLayouts);
    setLayoutName("");
    setShowSaveDialog(false);
  };

  const loadLayout = (name: string) => {
    if (savedLayouts[name]) {
      setPanels([...savedLayouts[name]]);
      setShowLoadDialog(false);
    }
  };

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  // Load saved layouts on mount
  useEffect(() => {
    const saved = localStorage.getItem("mythoras-layouts");
    if (saved) {
      try {
        setSavedLayouts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved layouts:", e);
      }
    }
  }, []);

  return (
    <div className="w-full h-screen bg-bg-canvas text-text-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="bg-surface-0 border-b border-border flex items-center justify-between z-50 px-6"
        style={{ height: HEADER_HEIGHT }}
      >
        {/* Left: Navigation & Current Context */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-surface-1 hover-transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-surface-1 hover-transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-violet-500 flex items-center justify-center">
              <Shield className="w-6 h-6 text-bg-canvas" />
            </div>
            <div>
              <h1
                className="text-xl text-text-1 tracking-wider"
                style={{ fontFamily: "Cinzel, serif", fontWeight: 600 }}
              >
                Mythoras Campaign
              </h1>
              <div className="text-sm text-text-3 mono tracking-wide">
                {currentRegion} • Day {campaignDay} • Level {playerLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="flex-1 max-w-lg mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-3" />
            <Input
              type="text"
              placeholder="Search competitions, technicians, regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-surface-1 border-border text-text-1 placeholder-text-3 h-10 tracking-wide"
              style={{ fontSize: "14px" }}
            />
          </div>
        </div>

        {/* Right: Controls & Status */}
        <div className="flex items-center gap-6">
          {/* Date/Time Display with Calendar */}
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <button className="bg-surface-1 border border-border px-4 py-2 flex items-center gap-4 hover:bg-surface-0 hover-transition">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-500" />
                  <span className="text-sm text-text-1 tracking-wide">
                    {formatDate(currentDate)}
                  </span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-500" />
                  <span className="text-sm text-text-1 mono tracking-wide">
                    {formatTime(new Date())}
                  </span>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-surface-0 border-border"
              align="end"
              side="bottom"
            >
              <CampaignCalendar currentDate={currentDate} />
            </PopoverContent>
          </Popover>

          {/* Simulation Controls */}
          <div className="flex items-center gap-3 bg-surface-1 px-4 py-2 border border-border">
            <button
              onClick={toggleSimulation}
              className="w-10 h-10 flex items-center justify-center text-teal-500 hover:bg-surface-0 hover-transition"
            >
              {isSimulating ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <span className="text-sm text-text-2 tracking-wide">
              {isSimulating ? "Simulation Running" : "Simulation Paused"}
            </span>
          </div>

          {/* Panel Controls */}
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-teal-500 hover:bg-surface-1 px-3 py-2 h-10 text-sm tracking-wide"
          >
            <Settings className="w-4 h-4 mr-2" />
            Panels
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div
          className="relative bg-bg-canvas panel-transition"
          style={{
            width: sidebarOpen ? `calc(100vw - ${SIDEBAR_WIDTH}px)` : "100vw",
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            position: "relative",
          }}
        >
          {/* Game Panels */}
          {panels.map((panel) => {
            const PanelComponent = PANEL_COMPONENTS[panel.type];
            const config = PANEL_CONFIGS[panel.type];

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
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* Title Bar */}
                {showHeaders && (
                  <div className="panel-header flex items-center h-12 bg-surface-1 border-b border-border border-t-2 border-t-violet-500">
                    <div
                      className={`flex items-center gap-3 px-4 py-2 flex-1 ${
                        panel.locked ? "cursor-default" : "cursor-move"
                      }`}
                      onMouseDown={(e) => handleMouseDown(e, panel.id, "drag")}
                    >
                      <GripHorizontal className="w-4 h-4 text-text-3" />
                      <div className={`w-2 h-2 ${panel.locked ? "bg-danger" : "bg-teal-500"}`} />
                      <span
                        className="text-base text-text-1 tracking-wider"
                        style={{ fontFamily: "Cinzel, serif", fontWeight: 500 }}
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

                {/* Panel Content */}
                <div
                  className="relative flex-1"
                  style={{ height: showHeaders ? "calc(100% - 48px)" : "100%" }}
                >
                  {PanelComponent ? (
                    <PanelComponent
                      width={panel.width}
                      height={showHeaders ? panel.height - 48 : panel.height}
                      // Pass GameView UI toggles for gameview panels
                      {...(panel.type === 'gameview' ? {
                        showFPS: showGameViewFPS,
                        showControls: showGameViewControls,
                        showMinimap: showGameViewMinimap,
                      } : {})}
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

                {/* Resize Handle */}
                {!panel.locked && config?.canResize && (
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize group"
                    onMouseDown={(e) => handleMouseDown(e, panel.id, "resize")}
                  >
                    <div className="absolute -bottom-2 -right-2 w-8 h-8"></div>
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-text-3 rounded-full opacity-60 group-hover:opacity-100 group-hover:bg-teal-500 hover-transition"></div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(26, 25, 32, 0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(26, 25, 32, 0.6) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              backgroundPosition: "0 0",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
            }}
          />
        </div>

        {/* Right Sidebar */}
        <div
          className={`bg-surface-0 border-l border-border overflow-y-auto panel-transition absolute right-0 top-0 bottom-0 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            width: SIDEBAR_WIDTH,
            boxShadow: sidebarOpen ? "-4px 0 12px rgba(0, 0, 0, 0.2)" : "none",
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
            onSaveLayout={saveLayout}
            onLoadLayout={loadLayout}
            onResetLayout={resetLayout}
            onCreateDefaultLayout={() => setPanels(createDefaultLayout())}
            onAddPanel={addPanel}
          />
        </div>
      </div>
    </div>
  );
}