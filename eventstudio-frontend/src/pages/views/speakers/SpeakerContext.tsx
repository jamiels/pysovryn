import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { ISpeakers } from '@/services/interfaces/speakers.i.ts';
import { getAllSpeakers } from '@/services/speakers_service.ts';
import { getAuth } from '@/auth';
import { useSpace } from '@/contexts/SpaceContext.tsx';

interface SpeakerContextType {
  speakers: ISpeakers[];
  loading: boolean;
  fetchSpeakers: () => void;
}

const SpeakerContext = createContext<SpeakerContextType | undefined>(undefined);

export const SpeakerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [speakers, setSpeakers] = useState<ISpeakers[]>([]);
  const [loading, setLoading] = useState(false);

  const { activeSpace } = useSpace();

  const fetchSpeakers = async () => {
    setLoading(true);
    try {
      if (!activeSpace) return;
      const speakers = await getAllSpeakers(activeSpace?.id as number);
      setSpeakers(speakers);
    } catch (error) {
      console.error('Error fetching speakers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSpace) {
      fetchSpeakers();
    }
  }, [activeSpace]);

  return (
    <SpeakerContext.Provider value={{ speakers, fetchSpeakers, loading }}>
      {children}
    </SpeakerContext.Provider>
  );
};

// Custom hook to use the SpeakerContext
export const useSpeaker = (): SpeakerContextType => {
  const context = useContext(SpeakerContext);
  if (!context) {
    throw new Error('useSpeaker must be used within an SpeakerProvider');
  }
  return context;
};
