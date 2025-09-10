import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Trophy, Sword, Users, MapPin } from 'lucide-react';

interface CampaignEvent {
  id: string;
  title: string;
  type: 'competition' | 'training' | 'expedition' | 'milestone';
  date: Date;
  time?: string;
  description?: string;
  location?: string;
}

interface CampaignCalendarProps {
  currentDate: Date;
}

const mockEvents: CampaignEvent[] = [
  {
    id: '1',
    title: 'Regional Championship Qualifier',
    type: 'competition',
    date: new Date(2024, 7, 18),
    time: '14:00',
    description: 'Qualify for the regional championship tournament',
    location: 'Valdris Arena'
  },
  {
    id: '2',
    title: 'Squad Training Session',
    type: 'training',
    date: new Date(2024, 7, 20),
    time: '10:00',
    description: 'Intensive combat training with new formations',
    location: 'Training Grounds'
  },
  {
    id: '3',
    title: 'Ancient Ruins Expedition',
    type: 'expedition',
    date: new Date(2024, 7, 25),
    time: '08:00',
    description: 'Explore the Shadowmere Ruins for rare artifacts',
    location: 'Shadowmere Ruins'
  },
  {
    id: '4',
    title: 'Level 20 Milestone',
    type: 'milestone',
    date: new Date(2024, 7, 15),
    description: 'Campaign progression milestone reached'
  },
  {
    id: '5',
    title: 'Elite Tournament',
    type: 'competition',
    date: new Date(2024, 7, 30),
    time: '16:00',
    description: 'High-stakes tournament with legendary rewards',
    location: 'Grand Colosseum'
  }
];

const eventIcons = {
  competition: Trophy,
  training: Sword,
  expedition: MapPin,
  milestone: Users
};

const eventColors = {
  competition: 'text-warn bg-warn',
  training: 'text-teal-500 bg-teal-500',
  expedition: 'text-violet-500 bg-violet-500',
  milestone: 'text-ok bg-ok'
};

export const CampaignCalendar: React.FC<CampaignCalendarProps> = ({ currentDate }) => {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const [selectedEvent, setSelectedEvent] = useState<CampaignEvent | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month's trailing days
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    calendarDays.push({ date, isCurrentMonth: false });
  }
  
  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  
  // Next month's leading days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({ date, isCurrentMonth: false });
  }

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isCampaignDay = (date: Date) => {
    return date.getDate() === currentDate.getDate() &&
           date.getMonth() === currentDate.getMonth() &&
           date.getFullYear() === currentDate.getFullYear();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  return (
    <div className="w-96 bg-surface-0 border border-border">
      {/* Calendar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="w-8 h-8 flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-surface-1 hover-transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <h3 
            className="text-lg text-violet-500 tracking-wider"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            {monthNames[month]} {year}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className="w-8 h-8 flex items-center justify-center text-text-3 hover:text-text-1 hover:bg-surface-1 hover-transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Campaign Day Indicator */}
        <div className="flex items-center gap-2 text-xs text-text-2">
          <div className="w-3 h-3 bg-teal-500"></div>
          <span className="tracking-wide">Campaign Day {currentDate.getDate()}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs text-text-3 tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(({ date, isCurrentMonth }, index) => {
            const events = getEventsForDate(date);
            const hasEvents = events.length > 0;
            const dayIsToday = isToday(date);
            const dayIsCampaignDay = isCampaignDay(date);

            return (
              <button
                key={index}
                onClick={() => hasEvents && setSelectedEvent(events[0])}
                className={`
                  h-8 flex items-center justify-center text-xs relative hover-transition
                  ${isCurrentMonth ? 'text-text-1' : 'text-text-3'}
                  ${dayIsToday ? 'bg-surface-1 text-text-1' : ''}
                  ${dayIsCampaignDay ? 'bg-teal-500 text-bg-canvas' : ''}
                  ${hasEvents && !dayIsCampaignDay ? 'hover:bg-surface-1' : ''}
                  ${!isCurrentMonth ? 'opacity-50' : ''}
                `}
              >
                {date.getDate()}
                
                {/* Event Indicators */}
                {hasEvents && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {events.slice(0, 3).map((event, i) => {
                      const colorClass = eventColors[event.type];
                      return (
                        <div
                          key={i}
                          className={`w-1 h-1 ${colorClass.split(' ')[1]} bg-opacity-80`}
                        />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Details */}
      {selectedEvent && (
        <div className="border-t border-border p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              {React.createElement(eventIcons[selectedEvent.type], {
                className: `w-5 h-5 ${eventColors[selectedEvent.type].split(' ')[0]} flex-shrink-0 mt-0.5`
              })}
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-sm text-text-1 tracking-wide mb-1"
                  style={{ fontFamily: 'Cinzel, serif' }}
                >
                  {selectedEvent.title}
                </h4>
                {selectedEvent.description && (
                  <p className="text-xs text-text-2 tracking-wide mb-2">
                    {selectedEvent.description}
                  </p>
                )}
                
                <div className="space-y-1">
                  {selectedEvent.time && (
                    <div className="flex items-center gap-2 text-xs text-text-3">
                      <Clock className="w-3 h-3" />
                      <span className="mono tracking-wide">{selectedEvent.time}</span>
                    </div>
                  )}
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 text-xs text-text-3">
                      <MapPin className="w-3 h-3" />
                      <span className="tracking-wide">{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full text-xs text-text-3 hover:text-text-1 tracking-wide hover-transition"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="border-t border-border p-4">
        <h4 
          className="text-sm text-violet-500 mb-3 tracking-wider"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Upcoming Events
        </h4>
        <div className="space-y-2">
          {mockEvents
            .filter(event => event.date >= new Date())
            .slice(0, 3)
            .map(event => {
              const Icon = eventIcons[event.type];
              const colorClass = eventColors[event.type];
              
              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-surface-1 hover-transition text-left"
                >
                  <Icon className={`w-4 h-4 ${colorClass.split(' ')[0]} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-text-1 tracking-wide truncate">
                      {event.title}
                    </div>
                    <div className="text-xs text-text-3 mono tracking-wide">
                      {event.date.toLocaleDateString()} {event.time && `• ${event.time}`}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};