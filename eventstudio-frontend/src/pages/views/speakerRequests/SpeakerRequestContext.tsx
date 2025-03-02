import React, { createContext, useState, useContext, ReactNode } from 'react';

import { IPublicSpeaker } from '@/services/interfaces/public_forms.i.ts';
import { getAllSpeakerRequests } from '@/services/publicForms/public_speaker_service.ts';

interface SpeakerRequestContextType {
  SpeakerRequests: IPublicSpeaker[] | null;
  loading: boolean;
  fetchSpeakerRequests: () => void;
}

const SpeakerRequestContext = createContext<SpeakerRequestContextType | undefined>(undefined);

export const SpeakerRequestsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [SpeakerRequests, setSpeakerRequests] = useState<IPublicSpeaker[] | null>([]);
  const [loading, setLoading] = useState(false);

  const fetchSpeakerRequests = async () => {
    setLoading(true);
    try {
      const speakerRequests = await getAllSpeakerRequests();
      setSpeakerRequests(speakerRequests);
    } catch (error) {
      console.error('Error fetching speaker requests:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SpeakerRequestContext.Provider value={{ SpeakerRequests, fetchSpeakerRequests, loading }}>
      {children}
    </SpeakerRequestContext.Provider>
  );
};

// Custom hook to use the SpeakerRequestsContext
export const useSpeakerRequest = (): SpeakerRequestContextType => {
  const context = useContext(SpeakerRequestContext);
  if (!context) {
    throw new Error('useSpeakerRequest must be used within an SpeakerRequestsProvider');
  }
  return context;
};
