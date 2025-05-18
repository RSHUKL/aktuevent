import React from 'react';
import { Event } from '../../store/feedbackStore';

interface EventSelectorProps {
  events: Event[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string | null) => void;
}

const EventSelector: React.FC<EventSelectorProps> = ({ 
  events, 
  selectedEventId, 
  onSelectEvent 
}) => {
  // Group events by category
  const eventsByCategory = events.reduce((acc: Record<string, Event[]>, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {});
  
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          className={`btn ${
            selectedEventId === null 
              ? 'bg-primary-100 text-primary-800 hover:bg-primary-200'
              : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
          }`}
          onClick={() => onSelectEvent(null)}
        >
          All Events
        </button>
        
        {Object.entries(eventsByCategory).map(([category, events]) => (
          <div key={category} className="relative group inline-block">
            <button
              className="btn bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            >
              {category} <span className="ml-1">▼</span>
            </button>
            
            <div className="absolute left-0 mt-1 z-10 w-56 hidden group-hover:block">
              <div className="bg-white rounded-lg shadow-lg border border-neutral-200 overflow-hidden">
                <div className="p-2 bg-neutral-50 border-b border-neutral-200 font-medium text-sm">
                  {category} Events
                </div>
                <div className="py-1">
                  {events.map(event => (
                    <button
                      key={event.id}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedEventId === event.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                      onClick={() => onSelectEvent(event.id)}
                    >
                      {event.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSelector;