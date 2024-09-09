import React from 'react';
import { CalendarEvent } from './types'; // Import the type from types.ts

interface CalendarEventListProps {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  onViewDetails: (event: CalendarEvent) => void;
}

const CalendarEventList: React.FC<CalendarEventListProps> = ({ events, onEdit, onDelete, onViewDetails }) => {
  return (
    <div id="calendar-event-list">
      {events.map((event) => (
        <div key={event.id} className="event-item">
          <div className="event-details">
            <h3>{event.title}</h3>
            <p>{event.date} at {event.time}</p>
          </div>
          <div className="button-group">
            <button onClick={() => onViewDetails(event)}>View Details</button>
            <button onClick={() => onEdit(event)}>Edit</button>
            <button onClick={() => onDelete(event.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarEventList;
