import React from 'react';
import { Calendar } from 'lucide-react';
import { SIMULATION_EVENTS } from './constants/simulation';

interface CalendarDay {
  date: Date;
  events: string[];
  isToday: boolean;
  hasEvents: boolean;
}

interface SimulationCalendarProps {
  currentDate: Date;
}

export const SimulationCalendar: React.FC<SimulationCalendarProps> = ({ currentDate }) => {
  const generateCalendar = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalendarDay[] = [];

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dayEvents = SIMULATION_EVENTS.filter(event => 
        event.timestamp.toDateString() === date.toDateString()
      ).map(event => event.title);

      days.push({
        date,
        events: dayEvents,
        isToday: date.toDateString() === currentDate.toDateString(),
        hasEvents: dayEvents.length > 0
      });
    }

    return days;
  };

  const calendar = generateCalendar();

  const renderCalendarDay = (day: CalendarDay, index: number) => (
    <div
      key={index}
      className={`
        p-2 h-16 border border-gray-700 relative transition-colors
        ${day.isToday ? 'bg-green-500/20 border-green-400' : 'bg-gray-800'}
        ${day.hasEvents ? 'border-blue-400/50' : ''}
      `}
    >
      <div className="text-xs text-gray-300">{day.date.getDate()}</div>
      {day.hasEvents && (
        <div className="absolute bottom-1 left-1 right-1">
          <div className="flex gap-1">
            {day.events.slice(0, 3).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-blue-400 rounded-full" />
            ))}
            {day.events.length > 3 && (
              <div className="text-xs text-blue-400">+</div>
            )}
          </div>
        </div>
      )}
      {day.isToday && (
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-green-400" />
        <h3 className="text-green-400 uppercase">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-xs text-gray-500 font-semibold">
            {day}
          </div>
        ))}
        {calendar.map(renderCalendarDay)}
      </div>

      {/* Upcoming Events */}
      <div className="mt-6">
        <h4 className="text-sm text-green-400 uppercase mb-3">Upcoming Events</h4>
        <div className="space-y-2 text-xs">
          {SIMULATION_EVENTS.filter(event => 
            event.timestamp.getMonth() === currentDate.getMonth() &&
            event.timestamp.getTime() > currentDate.getTime()
          ).slice(0, 5).map(event => (
            <div key={event.id} className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span>{event.timestamp.getDate()}: {event.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};