import React, { useState, useEffect } from 'react';
import { CalendarEvent } from './types'; // Import the type from types.ts

interface CalendarFormProps {
  event?: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
}

const CalendarForm: React.FC<CalendarFormProps> = ({ event = { id: '', title: '', description: '', date: '', time: '' }, onSave, onCancel }) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);

  const handleSubmit = () => {
    const updatedEvent: CalendarEvent = { id: event.id || '', title, description, date, time };
    onSave(updatedEvent);
  };

  return (
    <div id="calendar-form">
      <h2>{event.id ? 'Edit Event' : 'Add New Event'}</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CalendarForm;
