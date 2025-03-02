import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { IEvent } from '@/services/interfaces/event.i.ts';
import { getAllEvents } from '@/services/event_services.ts';

import { useSpace } from '@/contexts/SpaceContext.tsx';

interface EventContextType {
  events: IEvent[];
  loading: boolean;
  fetchEvents: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const { activeSpace } = useSpace();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      if (!activeSpace) return;
      const events = await getAllEvents(activeSpace.id as number);
      const responseData = events?.map((event: IEvent) => ({
        id: event.id,
        uuid: event.uuid,
        name: event.name,
        shortName: event.shortName,
        landingUrl: event.landingUrl,
        startDate: event.startDate,
        endDate: event.endDate,
        venueName: event.venueName,
        banner: event.banner,
        sponsorshipDeckUrl: event.sponsorshipDeckUrl,
        theme: event.theme,
        user: event.user,
        isActive: event.isActive,
        luma: event.luma,
        meetup: event.meetup,
        eventBrite: event.eventBrite,
        timezone: event.timezone
      }));

      setEvents(responseData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeSpace) {
      fetchEvents();
    }
  }, [activeSpace]);

  return (
    <EventContext.Provider value={{ events, fetchEvents, loading }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook to use the EventContext
export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
