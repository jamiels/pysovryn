import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { IOrganization } from '@/services/interfaces/org.i.ts';
import { getActiveOrganizations } from '@/services/organization_services.ts';
import { useSpace } from '@/contexts/SpaceContext.tsx';

interface OrganizationContextType {
  organizations: IOrganization[];
  loading: boolean;
  fetchOrganizations: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [loading, setLoading] = useState(false);
  const { activeSpace } = useSpace();

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      if (!activeSpace) return;
      const orgs = await getActiveOrganizations(activeSpace?.id as number);

      const responseData = orgs?.map((org: IOrganization) => ({
        id: org.id,
        name: org.name,
        space_id: org.space_id,
        created_at: org.createdAt,
        updated_at: org.updatedAt
      }));

      setOrganizations(responseData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSpace) {
      fetchOrganizations();
    }
  }, [activeSpace]);

  return (
    <OrganizationContext.Provider value={{ organizations, fetchOrganizations, loading }}>
      {children}
    </OrganizationContext.Provider>
  );
};

// Custom hook to use the EventContext
export const useOrganizations = (): OrganizationContextType => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
