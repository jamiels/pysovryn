import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { IDashboardStatus } from '@/services/interfaces/dashboard.i.ts';
import { getAllDashboardData } from '@/services/dashboard_services.ts';

interface DashboardContextType {
  dashboardStatus: IDashboardStatus;
  loading: boolean;
  refreshDashboard: () => Promise<void>;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache duration

const initialData: IDashboardStatus = {
  spaceId: 0,
  spaceName: '',
  inactiveEvents: [],
  lastUpdated: '',
  speakerOnboards: 0,
  speakerRecentOnboards: 0,
  totalEvents: 0,
  totalRecentSponsors: 0,
  totalRecentVolunteers: 0,
  totalSpaceUsers: 0,
  totalSponsors: 0,
  totalVolunteers: 0,
  upcomingEvents: []
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dashboardStatus, setDashboardStatus] = useState<IDashboardStatus>(initialData);
  const [loading, setLoading] = useState(false);
  const { activeSpace } = useSpace();

  // Use ref for cache to avoid unnecessary re-renders
  const cache = useRef<Map<number, { data: IDashboardStatus; timestamp: number }>>(new Map());

  const refreshDashboard = async () => {
    if (!activeSpace) return;

    const now = Date.now();
    const cachedData = cache.current.get(activeSpace.id);

    // Return cached data if it's still valid
    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      setDashboardStatus(cachedData.data);
      return;
    }

    setLoading(true);
    try {
      const responseData = await getAllDashboardData(activeSpace.id);
      const newData = {
        ...responseData,
        lastUpdated: new Date().toISOString()
      };

      // Update cache and state
      cache.current.set(activeSpace.id, { data: newData, timestamp: now });
      setDashboardStatus(newData);
    } catch (error) {
      console.error('Error fetching Dashboard status:', error);
      // Optional: Return cached data even if stale on error
      if (cachedData) setDashboardStatus(cachedData.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSpace) {
      const cachedData = cache.current.get(activeSpace.id);
      if (cachedData) {
        setDashboardStatus(cachedData.data);
      }
      refreshDashboard();
    }
  }, [activeSpace]);

  return (
    <DashboardContext.Provider
      value={{
        dashboardStatus,
        loading,
        refreshDashboard
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
