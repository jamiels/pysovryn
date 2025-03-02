import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { IProducer } from '@/services/interfaces/producer.i.ts';
import { getAllProducers } from '@/services/producer_services.s.ts';

import { useSpace } from '@/contexts/SpaceContext.tsx';

interface ProducerContextType {
  producers: IProducer[];
  loading: boolean;
  fetchProducers: () => void;
}

const ProducerContext = createContext<ProducerContextType | undefined>(undefined);

export const ProducerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [producers, setProducers] = useState<IProducer[]>([]);
  const [loading, setLoading] = useState(false);

  const { activeSpace } = useSpace();
  const fetchProducers = async () => {
    setLoading(true);
    try {
      if (!activeSpace) return;
      const producers = await getAllProducers(activeSpace?.id as number);
      setProducers(producers);
    } catch (error) {
      console.error('Error fetching producers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSpace) {
      fetchProducers();
    }
  }, [activeSpace]);

  return (
    <ProducerContext.Provider value={{ producers, fetchProducers, loading }}>
      {children}
    </ProducerContext.Provider>
  );
};

// Custom hook to use the ProducerContext
export const useProducers = (): ProducerContextType => {
  const context = useContext(ProducerContext);
  if (!context) {
    throw new Error('useProducers must be used within an ProducerProvider');
  }
  return context;
};
