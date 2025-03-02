import React, { useState, useMemo, useEffect } from 'react';

import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IEvent } from '@/services/interfaces/event.i.ts';

import { useAdminEvent } from '@/pages/views/admin/event/events-table/EventContext.tsx';
import { IAdminEvent } from '@/services/interfaces/admin.i.ts';
import { disableEvent } from '@/services/admin_services.ts';
import { showToast } from '@/utils/toast_helper.ts';

export const AdminEvents = () => {
  const [filter, setFilter] = useState<string>('');
  const [filterData, setFilterData] = useState<IAdminEvent[]>([]);
  const { adminEvents, fetchEvents, loading } = useAdminEvent();

  const handleToggleDisable = async (selected_event: IAdminEvent) => {
    if (!selected_event) return;
    const is_updated = await disableEvent(selected_event.id, !selected_event.isDisabled);
    if (is_updated) {
      fetchEvents();
    }
  };

  const handleCopyString = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Copied to clipboard');
  };

  useEffect(() => {
    if (filter.length) {
      setFilterData(
        adminEvents?.filter((event: IAdminEvent) =>
          event?.name.toLowerCase()?.includes(filter?.toLowerCase())
        )
      );
    } else {
      setFilterData(adminEvents);
    }
  }, [adminEvents, filter]);

  const columns = useMemo<ColumnDef<IAdminEvent>[]>(
    () => [
      {
        accessorFn: (row: IEvent) => row.name,
        id: 'name',
        header: () => 'Event',
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
        accessorFn: (row) => row.venueName,
        id: 'venue',
        header: () => 'Venue',
        enableSorting: true,
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
          ),
        meta: {
          className: 'min-w-[100px]'
        }
      },

      {
        accessorFn: (row) => row.landingUrl,
        id: 'landingUrl',
        header: () => 'Landing URL',
        enableSorting: false,
        cell: (info) => (
          <>
            {info.row.original.landingUrl ? (
              <div
                onClick={() => handleCopyString(info.row.original.landingUrl)}
                className={
                  'badge badge-sm items-center flex gap-2 cursor-pointer hover:badge-outline'
                }
              >
                {info.row.original.landingUrl} <KeenIcon icon={'copy'} />
              </div>
            ) : (
              <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
            )}
          </>
        ),
        meta: {
          className: 'min-w-[120px]'
        }
      },
      {
        accessorFn: (row) => row.sponsorshipDeckUrl,
        id: 'sponsorshipDeckUrl',
        header: () => 'Sponsorship Deck',
        enableSorting: false,

        cell: (info) => (
          <>
            {info.row.original.sponsorshipDeckUrl ? (
              <div
                onClick={() => handleCopyString(info.row.original.sponsorshipDeckUrl)}
                className={
                  'badge badge-sm items-center flex gap-2 cursor-pointer hover:badge-outline'
                }
              >
                {info.row.original.sponsorshipDeckUrl} <KeenIcon icon={'copy'} />
              </div>
            ) : (
              <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
            )}
          </>
        ),
        meta: {
          className: 'min-w-[120px]'
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
        <h3 className="card-title font-medium text-sm">{'Events'}</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Events"
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
          sorting={[
            { id: 'name', desc: false },
            { id: 'venue', desc: false },
            { id: 'sponsorshipDeckUrl', desc: false }
          ]}
        />
      </div>
    </div>
  );
};
