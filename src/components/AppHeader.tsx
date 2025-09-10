import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Search, Settings, Calendar as CalendarIcon, Play, ChevronDown } from 'lucide-react';
import { HEADER_HEIGHT } from './constants/panels';

interface AppHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentDate: Date;
  showCalendar: boolean;
  onCalendarToggle: (show: boolean) => void;
  onStartProgression: () => void;
  onSidebarToggle: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentDate,
  showCalendar,
  onCalendarToggle,
  onStartProgression,
  onSidebarToggle
}) => {
  return (
    <div 
      className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between z-50"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-400 animate-pulse" />
          <h1 className="text-lg text-green-400 tracking-wider">MYTHORAS.SYS</h1>
        </div>
        <div className="text-xs text-gray-500">
          v2.1.5 | {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Center - Global Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search competitions, technicians, regions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right - Calendar, Progression, Controls */}
      <div className="flex items-center gap-3">
        {/* Calendar */}
        <Popover open={showCalendar} onOpenChange={onCalendarToggle}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-green-400 hover:bg-gray-800 px-2 py-1">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span className="text-xs">
                {currentDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700">
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-green-400 uppercase text-sm">Tournament Calendar</h3>
            </div>
            <Calendar
              mode="single"
              selected={currentDate}
              className="bg-gray-900"
            />
            <div className="p-3 border-t border-gray-700">
              <div className="text-xs text-gray-400 space-y-1">
                <div>• Premier Shield: Aug 18</div>
                <div>• Regional Cup: Aug 22</div>
                <div>• Elite Championship: Sep 01</div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Game Progression */}
        <Button
          onClick={onStartProgression}
          className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1"
          size="sm"
        >
          <Play className="w-3 h-3 mr-1" />
          Progress
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSidebarToggle}
          className="text-green-400 hover:bg-gray-800 px-2 py-1 text-xs"
        >
          <Settings className="w-3 h-3 mr-1" />
          CTRL
        </Button>
      </div>
    </div>
  );
};