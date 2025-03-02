import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { getAllSpaces } from '@/services/admin_services.ts';
import { IAdminSpace } from '@/services/interfaces/admin.i.ts';

interface AdminSpaceContextType {
  adminSpaces: IAdminSpace[];
  loading: boolean;
  fetchSpaces: () => void;
}

const AdminSpaceContext = createContext<AdminSpaceContextType | undefined>(undefined);

export const AdminSpaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminSpaces, setAdminSpaces] = useState<IAdminSpace[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSpaces = async () => {
    setLoading(true);
    try {
      const spaces = await getAllSpaces();
      const responseData = spaces?.map((space: IAdminSpace) => ({
        id: space.id,
        uuid: space.uuid,
        spaceName: space.spaceName,
        isDisabled: space.isDisabled
      }));

      setAdminSpaces(responseData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <AdminSpaceContext.Provider value={{ adminSpaces, fetchSpaces, loading }}>
      {children}
    </AdminSpaceContext.Provider>
  );
};

// Custom hook to use the EventContext
export const useAdminSpace = (): AdminSpaceContextType => {
  const context = useContext(AdminSpaceContext);
  if (!context) {
    throw new Error('useAdminSpace must be used within an AdminSpaceProvider');
  }
  return context;
};
