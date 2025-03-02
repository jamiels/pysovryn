import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon, MenuSeparator } from '@/components';
import { ColumnDef } from '@tanstack/react-table';
import { IRemoveSpaceUserRequest, ISpace } from '@/services/interfaces/space.i';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import {
  addSpaceUser,
  addNewSpaceUser,
  deleteSpace,
  updateSpace,
  removeSpaceUser
} from '@/services/space_services.ts';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

const Space = () => {
  const [filter, setFilter] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filterData, setFilterData] = useState<ISpace[]>([]);
  const [editingSpace, setEditingSpace] = useState<ISpace | null>(null);
  const [deletingSpace, setDeletingSpace] = useState<ISpace | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [userDialogState, setUserDialogState] = useState<'closed' | 'add' | 'create'>('closed');
  const [pendingUserEmail, setPendingUserEmail] = useState<string>('');
  const [selectedSpaceForUser, setSelectedSpaceForUser] = useState<ISpace | null>(null);
  const [removeUserForm, setRemoveUserForm] = useState<IRemoveSpaceUserRequest | null>(null);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const currentUser = useAuth().auth?.user;
  const { fetchSpaces, loading, availableSpaces, handleSetActiveSpace, activeSpace } = useSpace();
  const [oldestSpaceId, setOldestSpaceId] = useState<number>(-1);

  // Calculate oldest space ID
  useEffect(() => {
    if (availableSpaces.length) {
      // Filter spaces where isAdmin is true
      const adminSpaces = availableSpaces.filter((space) => space.isAdmin);

      // If there are admin spaces, find the oldest one
      if (adminSpaces.length) {
        const oldestSpace = adminSpaces.reduce((prev, curr) => (prev.id < curr.id ? prev : curr));
        setOldestSpaceId(oldestSpace.id);
      } else {
        // If no admin spaces, find the oldest general space
        const oldestSpace = availableSpaces.reduce((prev, curr) =>
          prev.id < curr.id ? prev : curr
        );
        setOldestSpaceId(oldestSpace.id);
      }
    } else {
      setOldestSpaceId(-1);
    }
  }, [availableSpaces]);

  // Delete dialog handlers
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingSpace(null);
  };

  const handleOpenDeleteDialog = (space: ISpace) => {
    setDeletingSpace(space);
    setIsDeleteDialogOpen(true);
  };

  const handleSpaceDelete = async () => {
    if (!deletingSpace) return;
    try {
      await deleteSpace(deletingSpace.id);
      fetchSpaces();

      if (deletingSpace.id === activeSpace?.id) {
        //set the current space to the oldest space
        if (oldestSpaceId) {
          handleSetActiveSpace(oldestSpaceId);
        }
      }

      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // Leave dialog handlers
  const handleCloseLeaveDialog = () => {
    setIsLeaveDialogOpen(false);
    setRemoveUserForm(null);
  };

  const handleOpenLeaveDialog = (space: ISpace) => {
    setRemoveUserForm({ email: currentUser?.email as string, spaceId: space.id });
    setIsLeaveDialogOpen(true);
  };

  const handleRemoveUser = async () => {
    if (!removeUserForm?.email) return;
    if (!removeUserForm?.spaceId) return;

    setRemoveUserForm({ email: currentUser?.email as string, spaceId: removeUserForm.spaceId });

    try {
      await removeSpaceUser(removeUserForm);
      fetchSpaces();
      setRemoveUserForm(null);
    } catch (error) {
      console.error('Remove user failed:', error);
    }
  };

  // Edit handlers
  const handleEditStart = (space: ISpace) => {
    setEditingSpace(space);
    setEditValue(space.spaceName);
  };

  const handleEditCancel = () => {
    setEditingSpace(null);
    setEditValue('');
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleSpaceUpdate = async () => {
    if (!editingSpace || !editValue) return;
    try {
      await updateSpace(editingSpace.id, { spaceName: editValue });
      fetchSpaces();
      handleEditCancel();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // User management handlers
  const handleAddUserFlow = (space: ISpace) => {
    setSelectedSpaceForUser(space);
    setUserDialogState('add');
  };

  const handleAddUser = async (email: string) => {
    if (!selectedSpaceForUser) return;

    try {
      const result = await addSpaceUser(selectedSpaceForUser.id, { email, name: '' });

      if (result) {
        fetchSpaces();
        setUserDialogState('closed');
      } else {
        setPendingUserEmail(email);
        setUserDialogState('create');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setUserDialogState('closed');
    }
  };

  const handleCreateUser = async (name: string) => {
    if (!pendingUserEmail || !selectedSpaceForUser) return;

    try {
      // Create new user
      await addNewSpaceUser(selectedSpaceForUser.id, {
        email: pendingUserEmail,
        name
      });

      // Add created user to space
      await addSpaceUser(selectedSpaceForUser.id, {
        email: pendingUserEmail,
        name
      });

      fetchSpaces();
      setUserDialogState('closed');
      setPendingUserEmail('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  // Filter logic
  useEffect(() => {
    const filtered = filter.length
      ? availableSpaces.filter((space) =>
          space.spaceName.toLowerCase().includes(filter.toLowerCase())
        )
      : availableSpaces;
    setFilterData(filtered);
  }, [filter, availableSpaces]);

  useEffect(() => {
    setRemoveUserForm((prev) => {
      return { ...prev, email: currentUser?.email as string, spaceId: prev?.spaceId as number };
    });
  }, [currentUser]);

  const checkUserVerified = (email: string, space: ISpace) => {
    if (!space.invitedUsers || !space.invitedUsers.some((user) => user.email === email))
      return true;
    return space.invitedUsers.some((user) => user.email === email && user.isVerified);
  };

  const columns = useMemo<ColumnDef<ISpace>[]>(
    () => [
      {
        accessorFn: (row) => row.spaceName,
        id: 'spaceName',
        header: 'Space Name',
        cell: (info) =>
          editingSpace?.id === info.row.original.id ? (
            <input
              className="input input-sm w-[50%]"
              value={editValue}
              onChange={handleValueChange}
              autoFocus
            />
          ) : (
            <span className="text-gray-800 font-normal">{info.getValue() as string}</span>
          ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.spaceUsers,
        id: 'spaceUsers',
        header: 'Space Users',
        cell: (info) => {
          return (
            <div className={`flex flex-wrap gap-2`}>
              {[...new Set(info.getValue() as string)].map((user, index) => (
                <span
                  key={index}
                  className="text-gray-800 items-center gap-2 text-center font-normal badge badge-sm badge-outline cursor-pointer hover:badge-primary"
                >
                  {user as string}{' '}
                  <div>
                    {!checkUserVerified(user as string, info.row.original) && (
                      <div title="User is not verified">
                        <KeenIcon icon={'information-4'} />
                      </div>
                    )}
                  </div>
                </span>
              ))}
            </div>
          );
        },
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            {editingSpace?.id === row.original.id ? (
              <>
                <button
                  className="btn btn-icon btn-xs hover:text-green-500"
                  onClick={handleSpaceUpdate}
                >
                  <KeenIcon icon="check" />
                </button>
                <button
                  className="btn btn-icon btn-xs hover:text-red-500"
                  onClick={handleEditCancel}
                >
                  <KeenIcon icon="cross" />
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-icon btn-xs hover:text-primary-active"
                  onClick={() => handleEditStart(row.original)}
                >
                  <KeenIcon icon="pencil" />
                </button>
                <MenuSeparator />
                {/*<button*/}
                {/*  className="btn btn-icon btn-xs hover:text-primary-active"*/}
                {/*  onClick={() => handleAddUserFlow(row.original)}*/}
                {/*>*/}
                {/*  <KeenIcon icon="user-square" />*/}
                {/*</button>*/}
                {/*<MenuSeparator />*/}
                <button
                  className={`btn btn-icon btn-xs ${
                    row.original.id === oldestSpaceId
                      ? 'text-gray-400 cursor-not-allowed hover:text-gray-400'
                      : 'hover:text-primary-active'
                  }`}
                  onClick={() =>
                    row.original.id !== oldestSpaceId && handleOpenDeleteDialog(row.original)
                  }
                  disabled={row.original.id === oldestSpaceId}
                  title={row.original.id === oldestSpaceId ? 'Cannot delete oldest space' : ''}
                >
                  <KeenIcon icon="trash" />
                </button>
                <MenuSeparator />
                {!row.original.isAdmin && (
                  <button
                    className={`btn btn-icon btn-xs ${
                      row.original.id === oldestSpaceId
                        ? 'text-gray-400 cursor-not-allowed hover:text-gray-400'
                        : 'hover:text-primary-active'
                    }`}
                    onClick={() =>
                      row.original.id !== oldestSpaceId &&
                      handleOpenLeaveDialog(row.original as ISpace)
                    }
                    disabled={row.original.id === oldestSpaceId}
                    title={row.original.id === oldestSpaceId ? 'Cannot leave default space' : ''}
                  >
                    <KeenIcon icon="exit-left" />
                  </button>
                )}
              </>
            )}
          </div>
        ),
        meta: {
          className: 'w-[60px]'
        }
      }
    ],
    [editingSpace, editValue, oldestSpaceId]
  );

  return (
    <div className="card card-grid min-w-full">
      <div className="card-header flex-wrap gap-2">
        <h3 className="card-title font-medium text-sm"></h3>
        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Spaces"
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
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
          sorting={[{ id: 'spaceName', desc: false }]}
        />
      </div>

      <DeleteSpace
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleSpaceDelete}
      />

      <UserManagementDialog
        state={userDialogState}
        email={pendingUserEmail}
        onAdd={handleAddUser}
        onCreate={handleCreateUser}
        onClose={() => setUserDialogState('closed')}
      />

      <LeaveMemberDialog
        isOpen={isLeaveDialogOpen}
        onDelete={handleRemoveUser}
        onClose={handleCloseLeaveDialog}
      />
    </div>
  );
};

const DeleteSpace: React.FC<{
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
            <h3 className="text-lg font-semibold">Remove Space</h3>
          </div>
          <p className="text-sm text-gray-600">Are you sure you want to remove this space?</p>
        </div>
        <div className="flex gap-4 justify-end">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onDelete}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

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
            <h3 className="text-lg font-semibold">Leave From Space</h3>
          </div>
          <p className="text-sm text-gray-600">Are you sure you want to leave from space?</p>
        </div>
        <div className="flex gap-4 justify-end">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onDelete}>
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

const UserManagementDialog: React.FC<{
  state: 'closed' | 'add' | 'create';
  email: string;
  onAdd: (email: string) => Promise<void>;
  onCreate: (name: string) => Promise<void>;
  onClose: () => void;
}> = ({ state, email, onAdd, onCreate, onClose }) => {
  const [inputEmail, setInputEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state === 'add') setInputEmail('');
  }, [state]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAdd(inputEmail);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onCreate(name);
      setName('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state === 'closed') return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="dark:bg-neutral-950 bg-white rounded-lg p-6 w-full max-w-sm transform transition-all duration-300">
        {state === 'add' ? (
          <form onSubmit={handleAddSubmit}>
            <h3 className="text-lg font-semibold mb-4">Add User to Space</h3>
            <div className="form-control">
              <label className="label text-sm">Email Address</label>
              <input
                type="email"
                className="input input-bordered"
                placeholder="user@example.com"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Checking...' : 'Continue'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateSubmit}>
            <h3 className="text-lg font-semibold mb-4">Create New User</h3>
            <div className="form-control">
              <label className="label">Email</label>
              <div className="input input-bordered">{email}</div>
            </div>
            <div className="form-control mt-4">
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Enter user's full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export { Space };
