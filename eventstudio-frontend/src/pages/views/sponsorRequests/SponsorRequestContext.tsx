import React, { createContext, useState, useContext, ReactNode } from 'react';

import { IPublicSponsor } from '@/services/interfaces/public_forms.i.ts';
import { getAllSponsorRequests } from '@/services/publicForms/public_sponsor_services.ts';

interface SponsorRequestContextType {
  sponsorRequests: IPublicSponsor[] | null;
  loading: boolean;
  fetchSponsorRequests: () => void;
}

const SponsorRequestContext = createContext<SponsorRequestContextType | undefined>(undefined);

export const SponsorRequestsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sponsorRequests, setSponsorRequests] = useState<IPublicSponsor[] | null>([]);
  const [loading, setLoading] = useState(false);

  const fetchSponsorRequests = async () => {
    setLoading(true);
    try {
      const sponsorships = await getAllSponsorRequests();
      setSponsorRequests(sponsorships);
    } catch (error) {
      console.error('Error fetching sponsorship requests:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SponsorRequestContext.Provider value={{ sponsorRequests, fetchSponsorRequests, loading }}>
      {children}
    </SponsorRequestContext.Provider>
  );
};

// Custom hook to use the SponsorRequestsContext
export const useSponsorRequest = (): SponsorRequestContextType => {
  const context = useContext(SponsorRequestContext);
  if (!context) {
    throw new Error('useSponsorRequest must be used within an SponsorRequestsProvider');
  }
  return context;
};
