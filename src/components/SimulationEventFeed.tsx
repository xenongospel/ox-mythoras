import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trophy, Users, TrendingUp, MessageSquare, Award, AlertTriangle } from 'lucide-react';
import { SimulationEvent, EVENT_ICONS, PRIORITY_COLORS } from './constants/simulation';

interface SimulationEventFeedProps {
  events: SimulationEvent[];
  onEventChoice: (eventId: string, choice: string) => void;
}

export const SimulationEventFeed: React.FC<SimulationEventFeedProps> = ({ 
  events, 
  onEventChoice 
}) => {
  const getEventIcon = (type: SimulationEvent['type']) => {
    switch (type) {
      case 'tournament': return <Trophy className="w-4 h-4" />;
      case 'friend': return <Users className="w-4 h-4" />;
      case 'ranking': return <TrendingUp className="w-4 h-4" />;
      case 'news': return <MessageSquare className="w-4 h-4" />;
      case 'challenge': return <Award className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const renderEvent = (event: SimulationEvent, index: number) => {
    const getPriorityColor = () => PRIORITY_COLORS[event.priority];

    return (
      <div
        key={event.id}
        className={`
          p-3 border border-gray-700 bg-gray-800 mb-2 transition-all duration-300
          ${event.interactive ? 'border-orange-500 bg-orange-500/10' : ''}
        `}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${getPriorityColor()}`}>
            {getEventIcon(event.type)}
          </div>
          <div className="flex-1">
            <h4 className="text-sm text-white mb-1">{event.title}</h4>
            <p className="text-xs text-gray-300 mb-2">{event.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {event.timestamp.toLocaleTimeString()}
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getPriorityColor()}`}
              >
                {event.type.toUpperCase()}
              </Badge>
            </div>
            
            {event.interactive && event.choices && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">Your response required</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {event.choices.map(choice => (
                    <Button
                      key={choice}
                      size="sm"
                      variant="outline"
                      onClick={() => onEventChoice(event.id, choice)}
                      className="border-orange-500 text-orange-400 hover:bg-orange-500/20 text-xs"
                    >
                      {choice}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {events.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No events yet</p>
          <p className="text-xs">Start simulation to see events</p>
        </div>
      ) : (
        events.slice().reverse().map(renderEvent)
      )}
    </div>
  );
};