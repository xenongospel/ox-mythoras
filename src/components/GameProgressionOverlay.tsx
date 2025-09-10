import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Play, Pause, FastForward, X } from 'lucide-react';
import { SimulationCalendar } from './SimulationCalendar';
import { SimulationEventFeed } from './SimulationEventFeed';
import { SIMULATION_EVENTS, SimulationEvent } from './constants/simulation';

interface GameProgressionOverlayProps {
  onClose: () => void;
}

export const GameProgressionOverlay: React.FC<GameProgressionOverlayProps> = ({ onClose }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 15, 12, 0));
  const [progress, setProgress] = useState(0);
  const [currentEvents, setCurrentEvents] = useState<SimulationEvent[]>([]);
  const [pausedEvent, setPausedEvent] = useState<SimulationEvent | null>(null);

  // Simulation logic
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setCurrentDate(prev => {
        const next = new Date(prev);
        next.setHours(next.getHours() + simulationSpeed);
        return next;
      });

      setProgress(prev => {
        const newProgress = prev + (simulationSpeed * 0.5);
        return Math.min(100, newProgress);
      });

      // Check for events
      const eventsToShow = SIMULATION_EVENTS.filter(event => {
        const eventTime = event.timestamp.getTime();
        const currentTime = currentDate.getTime();
        return eventTime <= currentTime && eventTime > currentTime - (simulationSpeed * 60 * 60 * 1000);
      });

      if (eventsToShow.length > 0) {
        const event = eventsToShow[0];
        setCurrentEvents(prev => [...prev, event]);
        
        if (event.interactive) {
          setIsSimulating(false);
          setPausedEvent(event);
        }
      }
    }, 1000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, currentDate]);

  const handleStartPause = () => {
    setIsSimulating(!isSimulating);
    if (pausedEvent) {
      setPausedEvent(null);
    }
  };

  const handleSpeedChange = () => {
    setSimulationSpeed(prev => prev === 1 ? 2 : prev === 2 ? 4 : 1);
  };

  const handleEventChoice = (eventId: string, choice: string) => {
    console.log(`Choice made for ${eventId}: ${choice}`);
    setPausedEvent(null);
    setIsSimulating(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex">
      {/* Calendar Section (65%) */}
      <div className="w-[65%] bg-gray-900 border-r border-gray-700 flex flex-col">
        <div className="border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-green-400 uppercase">Game Progression</h2>
              <p className="text-sm text-gray-400">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleStartPause}
                className={`${isSimulating ? 'bg-orange-700 hover:bg-orange-600' : 'bg-green-700 hover:bg-green-600'}`}
              >
                {isSimulating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isSimulating ? 'Pause' : 'Start'}
              </Button>
              <Button
                onClick={handleSpeedChange}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <FastForward className="w-4 h-4 mr-2" />
                {simulationSpeed}x
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <Progress value={progress} className="h-2 mb-4" />
          <SimulationCalendar currentDate={currentDate} />
        </div>
      </div>

      {/* Event Feed Section (35%) */}
      <div className="w-[35%] bg-gray-950 flex flex-col">
        <div className="border-b border-gray-700 p-4">
          <h3 className="text-green-400 uppercase">Event Log</h3>
          <p className="text-xs text-gray-500">Live simulation feed</p>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <SimulationEventFeed 
            events={currentEvents}
            onEventChoice={handleEventChoice}
          />
        </div>

        {/* Simulation Status */}
        <div className="border-t border-gray-700 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Status:</span>
            <span className={`${isSimulating ? 'text-green-400' : pausedEvent ? 'text-orange-400' : 'text-gray-400'}`}>
              {isSimulating ? 'RUNNING' : pausedEvent ? 'PAUSED - ACTION REQUIRED' : 'STOPPED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};