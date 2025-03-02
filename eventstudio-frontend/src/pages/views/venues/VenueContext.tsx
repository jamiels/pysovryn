import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { IVenue } from '@/services/interfaces/venue.i.ts';
import { getVenues } from '@/services/venue_services';

import { useSpace } from '@/contexts/SpaceContext.tsx';

interface VenueContextType {
  venues: IVenue[];
  loading: boolean;
  fetchVenues: () => void;
}

const VenueContext = createContext<VenueContextType | undefined>(undefined);

export const VenueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [venues, setVenues] = useState<IVenue[]>([]);
  const [loading, setLoading] = useState(false);
  const { activeSpace } = useSpace();

  const fetchVenues = async () => {
    setLoading(true);
    try {
      if (!activeSpace) return;
      const venues = await getVenues(activeSpace?.id as number);
      setVenues(venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSpace) {
      fetchVenues();
    }
  }, [activeSpace]);

  return (
    <VenueContext.Provider value={{ venues, fetchVenues, loading }}>
      {children}
    </VenueContext.Provider>
  );
};

// Custom hook to use the EventContext
export const useVenue = (): VenueContextType => {
  const context = useContext(VenueContext);
  if (!context) {
    throw new Error('useVenue must be used within an VenueProvider');
  }
  return context;
};
