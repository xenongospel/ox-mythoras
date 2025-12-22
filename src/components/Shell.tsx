import React from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Play,
  Search,
  Settings,
  Shield,
} from 'lucide-react'

import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'
import { CampaignCalendar } from './CampaignCalendar'
import { formatDate, formatTime } from '../utils/formatting'
import { HEADER_HEIGHT } from '../constants/layout'

export interface ShellProps {
  searchQuery: string
  setSearchQuery: (s: string) => void
  currentDate: Date
  showCalendar: boolean
  setShowCalendar: (b: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (b: boolean) => void
  showGameViewFPS: boolean
  setShowGameViewFPS: (b: boolean) => void
  showGameViewControls: boolean
  setShowGameViewControls: (b: boolean) => void
  showGameViewMinimap: boolean
  setShowGameViewMinimap: (b: boolean) => void
  isSimulating: boolean
  toggleSimulation: () => void
  currentRegion: string
  campaignDay: number
  playerLevel: number
}

export const Shell: React.FC<ShellProps> = ({
  searchQuery,
  setSearchQuery,
  currentDate,
  showCalendar,
  setShowCalendar,
  sidebarOpen,
  setSidebarOpen,
  showGameViewFPS,
  setShowGameViewFPS,
  showGameViewControls,
  setShowGameViewControls,
  showGameViewMinimap,
  setShowGameViewMinimap,
  isSimulating,
  toggleSimulation,
  currentRegion,
  campaignDay,
  playerLevel,
}) => {
  return (
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
              style={{ fontFamily: 'Cinzel, serif', fontWeight: 600 }}
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
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface-1 border-border text-text-1 placeholder-text-3 h-10 tracking-wide"
            style={{ fontSize: '14px' }}
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
            {isSimulating ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <span className="text-sm text-text-2 tracking-wide">
            {isSimulating ? 'Simulation Running' : 'Simulation Paused'}
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
  )
}

export default Shell


