import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { ISponsorship } from '@/services/interfaces/sponsorships.i.ts';
import { getAllSponsorships } from '@/services/sponsorship_services';
import { getAuth } from '@/auth';
import { useSpace } from '@/contexts/SpaceContext.tsx';

interface SponsorContextType {
  sponsors: ISponsorship[];
  loading: boolean;
  fetchSponsors: () => void;
}

const SponsorContext = createContext<SponsorContextType | undefined>(undefined);

export const SponsorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sponsors, setSponsors] = useState<ISponsorship[]>([]);
  const [loading, setLoading] = useState(false);

  const { activeSpace } = useSpace();

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      if (!activeSpace) return;
      const sponsorships = await getAllSponsorships(activeSpace?.id as number);

      setSponsors(sponsorships);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSpace) {
      fetchSponsors();
    }
  }, [activeSpace]);

  return (
    <SponsorContext.Provider value={{ sponsors, fetchSponsors, loading }}>
      {children}
    </SponsorContext.Provider>
  );
};

// Custom hook to use the SponsorContext
export const useSponsor = (): SponsorContextType => {
  const context = useContext(SponsorContext);
  if (!context) {
    throw new Error('useSponsor must be used within an SponsorProvider');
  }
  return context;
};
