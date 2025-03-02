import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IUser, IUserAccessRequest } from '@/services/interfaces/users.i';
import { getAllUsers, updateUserAccess } from '@/services/user_services';
import { useSpace } from '@/contexts/SpaceContext';
import { removeSpaceUser } from '@/services/space_services.ts';
import { IRemoveSpaceUserRequest } from '@/services/interfaces/space.i';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

const Users = () => {
  const [filter, setFilter] = useState<string>('');
  const [data, setData] = useState<IUser[]>([]);
  const [filterData, setFilterData] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { activeSpace } = useSpace();
  const { auth } = useAuth();
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [removeUserForm, setRemoveUserForm] = useState<IRemoveSpaceUserRequest | null>({
    email: '',
    spaceId: activeSpace?.id as number
  });
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!activeSpace) return;
      const response = await getAllUsers(activeSpace.id);

      const users_data_map: Map<number, IUser> = new Map(
        response.map((user: any) => [
          user.id,
          {
            id: user.id,
            name: user.name,
            email: user.email,
            pagePermissions: {
              isEventPermitted: user.isEventPermitted,
              isOrganizationPermitted: user.isOrganizationPermitted,
              isSponsorPermitted: user.isSponsorPermitted,
              isVenuePermitted: user.isVenuePermitted,
              isSpeakerPermitted: user.isSpeakerPermitted
            }
          }
        ])
      );

      const users_data: IUser[] = Array.from(users_data_map.values());
      setData(users_data);
      setFilterData(users_data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = useCallback(
    async (userId: number, permissionKey: keyof IUser['pagePermissions'], value: boolean) => {
      if (!activeSpace) return;

      setData((prevData) => {
        const user = prevData.find((u) => u.id === userId);
        if (!user) return prevData;

        const currentPermissions = user.pagePermissions;
        const updatedPermissions = { ...currentPermissions, [permissionKey]: value };

        // Optimistic update
        const updatedData = prevData.map((u) =>
          u.id === userId ? { ...u, pagePermissions: updatedPermissions } : u
        );

        // Prepare and send API request
        const payload: IUserAccessRequest = {
          userId,
          spaceId: activeSpace.id,
          ...updatedPermissions
        };

        updateUserAccess(payload).catch((error) => {
          console.error('Update failed:', error);
          // Revert on error
          setData((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, pagePermissions: currentPermissions } : u))
          );
        });

        return updatedData;
      });
    },
    [activeSpace]
  );

  useEffect(() => {
    fetchUsers();
    if (activeSpace) {
      setRemoveUserForm({ email: '', spaceId: activeSpace.id });
    }
  }, [activeSpace]);

  useEffect(() => {
    if (filter.length) {
      setFilterData(data.filter((user) => user.name.toLowerCase().includes(filter.toLowerCase())));
    } else {
      setFilterData(data);
    }
  }, [filter, data]);

  const handleCloseLeaveDialog = () => {
    setIsLeaveDialogOpen(false);
    setRemoveUserForm(null);
  };

  const handleOpenLeaveDialog = (userSelected: IUser) => {
    setSelectedUser(userSelected);
    setRemoveUserForm({ email: userSelected?.email as string, spaceId: activeSpace?.id as number });
    setIsLeaveDialogOpen(true);
  };

  const handleRemoveUser = async () => {
    if (!removeUserForm?.email || !removeUserForm?.spaceId) return;

    try {
      const isRemoved = await removeSpaceUser(removeUserForm);
      if (isRemoved) {
        fetchUsers();
        setIsLeaveDialogOpen(false);
      }
    } catch (error) {
      console.error('Remove user failed:', error);
    }
  };

  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'name',
        header: () => ' Name',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.email,
        id: 'email',
        header: () => 'Email',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'page_access',
        header: () => 'Page Access',
        enableSorting: false,
        cell: (info) => {
          const user = info.row.original;
          return activeSpace?.isAdmin ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 items-center">
              {Object.entries(user.pagePermissions).map(([key, value]) => (
                <label key={key} className="switch switch-sm flex flex-col items-center">
                  <p className="text-xs">{key.replace('is', '').replace('Permitted', '')}</p>
                  <input
                    type="checkbox"
                    disabled={user.id === auth?.user.userId}
                    checked={value as boolean}
                    onChange={(e) =>
                      handlePermissionChange(
                        user.id,
                        key as keyof typeof user.pagePermissions,
                        e.target.checked
                      )
                    }
                  />
                </label>
              ))}
            </div>
          ) : null;
        },
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'actions',
        header: () => 'Actions',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.id === auth?.user.userId ? (
            <div className="btn btn-icon btn-xs hover:text-primary disabled">
              <KeenIcon icon="trash" />
            </div>
          ) : (
            <div
              className="btn btn-icon btn-xs hover:text-primary"
              onClick={() => handleOpenLeaveDialog(row.original)}
            >
              <KeenIcon icon="trash" />
            </div>
          ),
        meta: {
          className: 'w-[25px]',
          cellClassName: 'text-gray-800 font-normal text-center'
        }
      }
    ],
    [auth, handlePermissionChange]
  );

  return (
    <div className="card card-grid min-w-full">
      <div className="card-header flex-wrap gap-2">
        <h3 className="card-title font-medium text-sm">Users</h3>
        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Users"
                type="text"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="card-body">
        <DataGrid
          loading={loading}
          data={filterData}
          columns={columns}
          rowSelect={false}
          pagination={{ size: 5 }}
          sorting={[{ id: 'name', desc: true }]}
        />
      </div>
      <LeaveMemberDialog
        isOpen={isLeaveDialogOpen}
        onDelete={handleRemoveUser}
        onClose={handleCloseLeaveDialog}
      />
    </div>
  );
};

export { Users };

const LeaveMemberDialog: React.FC<{
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
}> = ({ isOpen, onDelete, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="dark:bg-neutral-950 bg-white rounded-lg p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">Remove User From Current Space</h3>
          </div>
          <p className="text-sm text-gray-600">
            Are you sure you want to remove this user from current space?
          </p>
        </div>
        <div className="flex gap-4 justify-end">
          <button className="btn btn-danger" onClick={onDelete}>
            Remove
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
