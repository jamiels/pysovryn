import React, { createContext, useState, useContext, ReactNode } from 'react';

import { IPublicOnboard } from '@/services/interfaces/public_forms.i.ts';
import { getAllOnboardRequests } from '@/services/publicForms/public_onboard_services.ts';

interface OnboardRequestContextType {
  OnboardRequests: IPublicOnboard[] | null;
  loading: boolean;
  fetchOnboardRequests: () => void;
}

const OnboardRequestContext = createContext<OnboardRequestContextType | undefined>(undefined);

export const OnboardRequestsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [OnboardRequests, setOnboardRequests] = useState<IPublicOnboard[] | null>([]);
  const [loading, setLoading] = useState(false);

  const fetchOnboardRequests = async () => {
    setLoading(true);
    try {
      const onboards = await getAllOnboardRequests();
      setOnboardRequests(onboards);
    } catch (error) {
      console.error('Error fetching Onboard requests:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <OnboardRequestContext.Provider value={{ OnboardRequests, fetchOnboardRequests, loading }}>
      {children}
    </OnboardRequestContext.Provider>
  );
};

// Custom hook to use the OnboardRequestsContext
export const useOnboardRequest = (): OnboardRequestContextType => {
  const context = useContext(OnboardRequestContext);
  if (!context) {
    throw new Error('useOnboardRequest must be used within an OnboardRequestsProvider');
  }
  return context;
};
