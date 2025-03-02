import React, { useState, useMemo, useEffect } from 'react';

import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { useUserLogs } from '@/pages/views/admin/user-activity/user-table/UserLogContext.tsx';
import { IAdminUserAudits } from '@/services/interfaces/admin.i.ts';
import { formatIsoDate } from '@/utils/Date.ts';

export const AdminUserLogs = () => {
  const [filter, setFilter] = useState<string>('');
  const [filterData, setFilterData] = useState<IAdminUserAudits[]>([]);
  const { userLogs, loading } = useUserLogs();

  useEffect(() => {
    if (filter.length) {
      setFilterData(
        userLogs?.filter((log: IAdminUserAudits) =>
          log?.email.toLowerCase()?.includes(filter?.toLowerCase())
        )
      );
    } else {
      setFilterData(userLogs);
    }
  }, [userLogs, filter]);

  const columns = useMemo<ColumnDef<IAdminUserAudits>[]>(
    () => [
      {
        accessorFn: (row: IAdminUserAudits) => row.email,
        id: 'email',
        header: () => 'Email',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-4 ">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900  mb-px">{row.original.email}</p>
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
        accessorFn: (row: IAdminUserAudits) => row.status,
        id: 'status',
        header: () => 'Status',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-4 ">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-col">
                <p className="text-sm text-gray-900 mb-px">{row.original.status}</p>
              </div>
            </div>
          </div>
        ),

        meta: {
          className: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row: IAdminUserAudits) => row.auditTime,
        id: 'Audit Time',
        header: () => 'Timestamp',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-4 ">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-col">
                <p className="text-sm  text-gray-900  mb-px">
                  {row.original.auditTime ? formatIsoDate(row.original.auditTime) : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        ),

        meta: {
          className: 'min-w-[50px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      }
    ],
    []
  );

  return (
    <div className="card card-grid min-w-full">
      <div className="card-header flex-wrap gap-2">
        <h3 className="card-title font-medium text-sm">{'User Logs'}</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search User By Email"
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
          sorting={[{ id: 'Audit Time', desc: true }]}
        />
      </div>
    </div>
  );
};
