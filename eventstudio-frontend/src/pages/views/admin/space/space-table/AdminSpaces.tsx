import React, { useState, useMemo, useEffect } from 'react';

import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IAdminSpace } from '@/services/interfaces/admin.i.ts';
import { disableSpace } from '@/services/admin_services.ts';

import { useAdminSpace } from '@/pages/views/admin/space/space-table/SpaceContext.tsx';

import { useSpace } from '@/contexts/SpaceContext.tsx';
import { showToast } from '@/utils/toast_helper.ts';

export const AdminSpaces = () => {
  const [filter, setFilter] = useState<string>('');
  const [filterData, setFilterData] = useState<IAdminSpace[]>([]);
  const { adminSpaces, fetchSpaces, loading } = useAdminSpace();
  const { activeSpace } = useSpace();

  const handleToggleDisable = async (selected_space: IAdminSpace) => {
    if (!selected_space) return;
    if (selected_space.id == activeSpace?.id) {
      showToast('error', 'Selected space can not disable');
      return;
    }
    const is_updated = await disableSpace(selected_space.id, !selected_space.isDisabled);
    if (is_updated) {
      fetchSpaces();
    }
  };

  useEffect(() => {
    if (filter.length) {
      setFilterData(
        adminSpaces?.filter((space: IAdminSpace) =>
          space?.spaceName.toLowerCase()?.includes(filter?.toLowerCase())
        )
      );
    } else {
      setFilterData(adminSpaces);
    }
  }, [adminSpaces, filter]);

  const columns = useMemo<ColumnDef<IAdminSpace>[]>(
    () => [
      {
        accessorFn: (row: IAdminSpace) => row.spaceName,
        id: 'spaceName',
        header: () => 'Space',
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
                  {row.original.spaceName}
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
        <h3 className="card-title font-medium text-sm">{'Spaces'}</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Spaces"
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
          sorting={[{ id: 'spaceName', desc: true }]}
        />
      </div>
    </div>
  );
};
