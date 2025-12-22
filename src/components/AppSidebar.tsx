import React from 'react'

import {
  Activity,
  Eye,
  EyeOff,
  Gamepad2,
  Layout,
  Map,
  RotateCcw,
  Save,
  Upload,
} from 'lucide-react'

import { PANEL_CONFIGS } from '../config/panels'
import { Panel } from '../types/panel'
import { normalizePanels } from '../utils/panels'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Switch } from './ui/switch'

interface AppSidebarProps {
  panels: Panel[]
  savedLayouts: { [key: string]: Panel[] }
  layoutName: string
  setLayoutName: (name: string) => void
  showSaveDialog: boolean
  setShowSaveDialog: (show: boolean) => void
  showLoadDialog: boolean
  setShowLoadDialog: (show: boolean) => void
  showHeaders: boolean
  setShowHeaders: (show: boolean) => void
  // GameView UI toggles
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
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
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
}) => {
  const panelList = normalizePanels(panels)

  return (
    <div className="p-4 space-y-4">
      {/* Layout Controls */}
      <div>
        <h3
          className="text-base text-violet-500 mb-3 tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Layout Management
        </h3>
        <div className="space-y-2">
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-surface-1 border-border text-text-2 hover:text-bg-canvas hover:bg-violet-500 hover:border-violet-500 hover-transition h-10 tracking-wide"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface-0 border-border">
              <DialogHeader>
                <DialogTitle
                  className="text-violet-500"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Save Layout
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="layout-name"
                    className="text-text-2 tracking-wide"
                  >
                    Layout Name
                  </Label>
                  <Input
                    id="layout-name"
                    value={layoutName}
                    onChange={e => setLayoutName(e.target.value)}
                    className="bg-surface-1 border-border text-text-1 mt-1 h-10 tracking-wide"
                    placeholder="Enter layout name..."
                  />
                </div>
                <Button
                  onClick={onSaveLayout}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-bg-canvas h-10 tracking-wide"
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start bg-surface-1 border-border text-text-2 hover:text-bg-canvas hover:bg-violet-500 hover:border-violet-500 hover-transition h-10 tracking-wide"
              >
                <Upload className="w-4 h-4 mr-2" />
                Load Layout
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface-0 border-border">
              <DialogHeader>
                <DialogTitle
                  className="text-violet-500"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  Load Layout
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {Object.keys(savedLayouts).map(name => (
                  <Button
                    key={name}
                    variant="outline"
                    onClick={() => onLoadLayout(name)}
                    className="w-full justify-start bg-surface-1 border-border text-text-2 hover:text-bg-canvas hover:bg-violet-500 hover:border-violet-500 hover-transition h-10 tracking-wide"
                  >
                    {name}
                  </Button>
                ))}
                {Object.keys(savedLayouts).length === 0 && (
                  <p className="text-text-3 text-center py-4 text-sm tracking-wide">
                    No saved layouts
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={onCreateDefaultLayout}
            className="w-full justify-start bg-surface-1 border-border text-text-2 hover:text-bg-canvas hover:bg-teal-500 hover:border-teal-500 hover-transition h-10 tracking-wide"
          >
            <Layout className="w-4 h-4 mr-2" />
            Default Layout
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onResetLayout}
            className="w-full justify-start bg-surface-1 border-border text-text-2 hover:text-bg-canvas hover:bg-violet-500 hover:border-violet-500 hover-transition h-10 tracking-wide"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Layout
          </Button>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* View Options */}
      <div>
        <h3
          className="text-base text-violet-500 mb-3 tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          View Options
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showHeaders ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              <span className="text-sm text-text-2 tracking-wide">
                Panel Headers
              </span>
            </div>
            <Switch checked={showHeaders} onCheckedChange={setShowHeaders} />
          </div>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* GameView Controls */}
      {panelList.some(p => p.type === 'gameview') && (
        <>
          <div>
            <h3
              className="text-base text-violet-500 mb-3 tracking-wider"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              Game View Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm text-text-2 tracking-wide">
                    FPS Counter
                  </span>
                </div>
                <Switch
                  checked={showGameViewFPS}
                  onCheckedChange={setShowGameViewFPS}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span className="text-sm text-text-2 tracking-wide">
                    Controls Guide
                  </span>
                </div>
                <Switch
                  checked={showGameViewControls}
                  onCheckedChange={setShowGameViewControls}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  <span className="text-sm text-text-2 tracking-wide">
                    Minimap
                  </span>
                </div>
                <Switch
                  checked={showGameViewMinimap}
                  onCheckedChange={setShowGameViewMinimap}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-border" />
        </>
      )}

      {/* Panel Management */}
      <div>
        <h3
          className="text-base text-violet-500 mb-3 tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Add Panels
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(PANEL_CONFIGS).map(([type, config]) => {
            const Icon = config.icon
            const exists = panelList.some(p => p.type === type)

            return (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => onAddPanel(type)}
                disabled={exists && config.isMainView}
                className="justify-start bg-surface-1 border-border text-text-2 hover:text-bg-canvas hover:bg-violet-500 hover:border-violet-500 disabled:opacity-50 hover-transition h-10 tracking-wide"
              >
                <Icon className="w-4 h-4 mr-2" />
                {config.title}
                {exists && (
                  <Badge
                    variant="secondary"
                    className="ml-auto text-xs bg-violet-600 text-text-1 tracking-wide"
                  >
                    Active
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* System Info */}
      <div>
        <h3
          className="text-base text-violet-500 mb-3 tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          System Status
        </h3>
        <div className="space-y-2 text-sm mono">
          <div className="flex justify-between text-text-2">
            <span className="tracking-wide">Panels Active:</span>
            <span className="text-teal-500 tracking-wide">
              {panelList.length}
            </span>
          </div>
          <div className="flex justify-between text-text-2">
            <span className="tracking-wide">Layouts Saved:</span>
            <span className="text-teal-500 tracking-wide">
              {Object.keys(savedLayouts).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
