import React, { useState, useMemo, useEffect } from 'react';

import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';
import { IAdminUser } from '@/services/interfaces/admin.i.ts';
import { disableUser } from '@/services/admin_services.ts';
import { useAdminUser } from '@/pages/views/admin/user/user-table/UserContext.tsx';

export const AdminUsers = () => {
  const [filter, setFilter] = useState<string>('');
  const [filterData, setFilterData] = useState<IAdminUser[]>([]);
  const { adminUsers, fetchUsers, loading } = useAdminUser();

  const handleToggleDisable = async (selected_user: IAdminUser) => {
    if (!selected_user) return;
    const is_updated = await disableUser(selected_user.id, !selected_user.isDisabled);
    if (is_updated) {
      fetchUsers();
    }
  };

  useEffect(() => {
    if (filter.length) {
      setFilterData(
        adminUsers?.filter((user: IAdminUser) =>
          user?.name.toLowerCase()?.includes(filter?.toLowerCase())
        )
      );
    } else {
      setFilterData(adminUsers);
    }
  }, [adminUsers, filter]);

  const columns = useMemo<ColumnDef<IAdminUser>[]>(
    () => [
      {
        accessorFn: (row: IAdminUser) => row.name,
        id: 'name',
        header: () => 'Name',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
                  {row.original.name}
                </p>
              </div>
            </div>
          </div>
        ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: IAdminUser) => row.email,
        id: 'email',
        header: () => 'Email',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
                  {row.original.email}
                </p>
              </div>
            </div>
          </div>
        ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },

      {
        id: 'actions',
        header: () => 'Enable/Disable',
        enableSorting: false,
        cell: ({ row }) => (
          <div className={'flex flex-row items-center justify-center'}>
            <label className="switch switch-sm">
              <input
                checked={!row.original.isDisabled}
                name="is_active"
                type="checkbox"
                onClick={() => handleToggleDisable(row.original)}
              />
            </label>
          </div>
        ),
        meta: {
          className: 'w-[60px]'
        }
      }
    ],
    []
  );

  return (
    <div className="card card-grid min-w-full">
      <div className="card-header flex-wrap gap-2">
        <h3 className="card-title font-medium text-sm">{'Users'}</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Users"
                type="text"
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value);
                }}
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
    </div>
  );
};

// const DisableConfirmationDialog: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onDisable: () => void;
// }> = ({ isOpen, onClose, onDisable }) => {
//   if (!isOpen) return null;
//
//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
//       style={{ animation: 'fadeIn 0.3s ease' }}
//       onClick={onClose}
//     >
//       <div
//         className="dark:bg-neutral-950 dark:border-gray-50/15 dark:border bg-white rounded-lg p-6 w-full sm:w-96 md:w-1/2 lg:w-1/3 shadow-lg"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-gray-800  items-center gap-2">
//             <div className={'flex flex-col gap-2'}>
//               <div className={'flex flex-row items-center gap-2 justify-start '}>
//                 <p>Disable an Event</p>
//               </div>
//               <p className={'text-sm font-normal text-gray-800 -mt-2'}>
//                 You are about to disable an event. Are you sure you want to continue?
//               </p>
//             </div>
//           </h3>
//         </div>
//
//         <div className="flex justify-center gap-4 mt-8">
//           <button
//             onClick={() => {
//               onDisable();
//               onClose();
//             }}
//             className="btn  btn-danger text-white w-1/2 items-center justify-center"
//           >
//             Disable Event
//           </button>
//           <button
//             onClick={onClose}
//             className="btn btn-secondary text-gray-600  w-1/2 justify-center"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
