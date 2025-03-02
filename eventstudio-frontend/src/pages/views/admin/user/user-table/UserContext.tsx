import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { IAdminUser } from '@/services/interfaces/admin.i.ts';
import { getAllUsers } from '@/services/admin_services.ts';

interface AdminUserContextType {
  adminUsers: IAdminUser[];
  loading: boolean;
  fetchUsers: () => void;
}

const AdminUserContext = createContext<AdminUserContextType | undefined>(undefined);

export const AdminUserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUsers, setAdminUsers] = useState<IAdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await getAllUsers();
      const responseData = users?.map((user: IAdminUser) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isDisabled: user.isDisabled
      }));

      setAdminUsers(responseData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AdminUserContext.Provider value={{ adminUsers, fetchUsers, loading }}>
      {children}
    </AdminUserContext.Provider>
  );
};

// Custom hook to use the AdminUserContext
export const useAdminUser = (): AdminUserContextType => {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error('useAdminUser must be used within an AdminUserProvider');
  }
  return context;
};
