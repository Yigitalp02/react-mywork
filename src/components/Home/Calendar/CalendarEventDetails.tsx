import React from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

interface CalendarEventDetailsProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const CalendarEventDetails: React.FC<CalendarEventDetailsProps> = ({ event, onEdit, onDelete, onClose }) => {
  return (
    <div id="calendar-event-details">
      <h2>Event Details</h2>
      <p><strong>Title:</strong> {event.title}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Time:</strong> {event.time}</p>
      <div className="event-details-actions">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CalendarEventDetails;
