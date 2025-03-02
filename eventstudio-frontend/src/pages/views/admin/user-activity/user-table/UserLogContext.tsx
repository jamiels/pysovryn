import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { IAdminUserAudits } from '@/services/interfaces/admin.i.ts';
import { getAllUserLogs } from '@/services/admin_services.ts';

interface AdminUserAuditContextType {
  userLogs: IAdminUserAudits[];
  loading: boolean;
  fetchUserLogs: () => void;
}

const AdminUserAuditContext = createContext<AdminUserAuditContextType | undefined>(undefined);

export const AdminUserLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLogs, setUserLogs] = useState<IAdminUserAudits[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserLogs = async () => {
    setLoading(true);
    try {
      const userLogs = await getAllUserLogs();
      const responseData = userLogs?.map((user_log: IAdminUserAudits) => ({
        id: user_log.id,
        email: user_log.email,
        failureReason: user_log.failureReason,
        status: user_log.status,
        auditTime: user_log.auditTime
      }));

      setUserLogs(responseData);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserLogs();
  }, []);

  return (
    <AdminUserAuditContext.Provider value={{ userLogs, fetchUserLogs, loading }}>
      {children}
    </AdminUserAuditContext.Provider>
  );
};

// Custom hook to use the AdminUserContext
export const useUserLogs = (): AdminUserAuditContextType => {
  const context = useContext(AdminUserAuditContext);
  if (!context) {
    throw new Error('useUserLogs must be used within an AdminUserLogProvider');
  }
  return context;
};
