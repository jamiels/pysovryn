import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getVolunteers } from '@/services/volunteer_services.ts';
import { IVolunteer } from '@/services/interfaces/volunteer.i.ts';

interface VolunteerRequestContextType {
  volunteers: IVolunteer[] | null;
  loading: boolean;
  fetchVolunteers: () => void;
}

const VolunteerRequestContext = createContext<VolunteerRequestContextType | undefined>(undefined);

export const VolunteerRequestsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [volunteers, setVolunteers] = useState<IVolunteer[] | null>([]);
  const [loading, setLoading] = useState(false);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const volunteers = await getVolunteers();
      setVolunteers(volunteers);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  return (
    <VolunteerRequestContext.Provider value={{ volunteers, fetchVolunteers, loading }}>
      {children}
    </VolunteerRequestContext.Provider>
  );
};

// Custom hook to use the VolunteerRequestsContext
export const useVolunteer = (): VolunteerRequestContextType => {
  const context = useContext(VolunteerRequestContext);
  if (!context) {
    throw new Error('useVolunteer must be used within an VolunteerRequestsProvider');
  }
  return context;
};
