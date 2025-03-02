import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { IAdminEvent } from '@/services/interfaces/admin.i.ts';
import { getAllEvents } from '@/services/admin_services.ts';

interface AdminEventContextType {
  adminEvents: IAdminEvent[];
  loading: boolean;
  fetchEvents: () => void;
}

const AdminEventContext = createContext<AdminEventContextType | undefined>(undefined);

export const AdminEventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminEvents, setAdminEvents] = useState<IAdminEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const events = await getAllEvents();
      const responseData = events?.map((event: IAdminEvent) => ({
        id: event.id,
        nanoId: event.nanoId,
        name: event.name,
        landingUrl: event.landingUrl,
        startDate: event.startDate,
        endDate: event.endDate,
        venueName: event.venueName,
        sponsorshipDeckUrl: event.sponsorshipDeckUrl,
        isActive: event.isActive,
        isArchived: event.isArchived,
        isDisabled: event.isDisabled
      }));

      setAdminEvents(responseData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <AdminEventContext.Provider value={{ adminEvents, fetchEvents, loading }}>
      {children}
    </AdminEventContext.Provider>
  );
};

// Custom hook to use the EventContext
export const useAdminEvent = (): AdminEventContextType => {
  const context = useContext(AdminEventContext);
  if (!context) {
    throw new Error('useAdminEvent must be used within an AdminEventProvider');
  }
  return context;
};
