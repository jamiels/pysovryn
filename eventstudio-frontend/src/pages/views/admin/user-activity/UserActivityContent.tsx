import { AdminUserLogs } from '@/pages/views/admin/user-activity/user-table/AdminUserLogs.tsx';

const UserActivityContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <AdminUserLogs />
    </div>
  );
};

export { UserActivityContent };
