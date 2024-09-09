import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';
import CalendarEventList from './CalendarEventList';
import CalendarForm from './CalendarForm';
import CalendarEventDetails from './CalendarEventDetails';
import { CalendarEvent } from './types'; // Import the type from types.ts
import './calendarPage.css';

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const db = getDatabase();
    const eventsRef = ref(db, 'calendar/events');

    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loadedEvents = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setEvents(loadedEvents);
    });
  }, []);

  const addOrUpdateEvent = (event: CalendarEvent) => {
    const db = getDatabase();
    const eventRef = event.id ? ref(db, `calendar/events/${event.id}`) : push(ref(db, 'calendar/events'));
    const newEvent = { ...event, id: event.id || eventRef.key! }; // Ensure id is assigned
    set(eventRef, newEvent);
    setIsEditing(false);
    setSelectedEvent(undefined);
  };

  const deleteEvent = (id: string) => {
    const db = getDatabase();
    const eventRef = ref(db, `calendar/events/${id}`);
    remove(eventRef);
    setSelectedEvent(undefined);
  };

  const editEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(true);
  };

  const viewEventDetails = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
  };

  const clearSelection = () => {
    setSelectedEvent(undefined);
    setIsEditing(false);
  };

  return (
    <div id="calendar-page">
      <h1>Calendar of Events</h1>
      {isEditing ? (
        <CalendarForm
          event={selectedEvent}
          onSave={addOrUpdateEvent}
          onCancel={clearSelection}
        />
      ) : selectedEvent ? (
        <CalendarEventDetails
          event={selectedEvent}
          onEdit={() => editEvent(selectedEvent)}
          onDelete={() => deleteEvent(selectedEvent.id)}
          onClose={clearSelection}
        />
      ) : (
        <CalendarForm onSave={addOrUpdateEvent} onCancel={clearSelection} />
      )}
      <CalendarEventList
        events={events}
        onEdit={editEvent}
        onDelete={deleteEvent}
        onViewDetails={viewEventDetails}
      />
    </div>
  );
};

export default CalendarPage;
