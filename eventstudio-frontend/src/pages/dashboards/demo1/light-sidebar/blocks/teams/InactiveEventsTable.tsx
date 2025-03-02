import React, { useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { DataGrid, TDataGridRequestParams, KeenIcon } from '@/components';
import { formatIsoDate } from '@/utils/Date';
import { useDashboard } from '@/pages/dashboards/demo1/light-sidebar/DashboardContext.tsx';

export type InactiveEvent = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  venueName: string;
};

const InactiveEventsTable = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { dashboardStatus, loading } = useDashboard();

  const InactiveEvents: InactiveEvent[] =
    dashboardStatus?.inactiveEvents?.map((event) => ({
      id: event.eventId,
      name: event.eventName,
      startDate: event.startDate,
      endDate: event.endDate,
      venueName: event.venueName
    })) || [];

  const columns = useMemo<ColumnDef<InactiveEvent>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'project',
        header: () => 'Event Name',
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-2">
            <Link
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
              to="#"
            >
              {info.row.original.name}
            </Link>
          </div>
        ),
        meta: {
          className: 'min-w-[200px]'
        }
      },
      {
        accessorFn: (row) => row.venueName,
        id: 'venueName',
        enableSorting: true,
        header: () => 'Event Venue',
        cell: (info) => info.row.original.venueName,
        meta: {
          className: 'w-[400px]'
        }
      },
      {
        accessorFn: (row) => row.startDate,
        id: 'startDate',
        enableSorting: true,
        header: () => 'Event Start Date',
        cell: (info) => formatIsoDate(info.row.original.startDate),
        meta: {
          className: 'w-[400px]'
        }
      },
      {
        accessorFn: (row) => row.endDate,
        id: 'endDate',
        enableSorting: true,
        header: () => 'Event End Date',
        cell: (info) => formatIsoDate(info.row.original.endDate),
        meta: {
          className: 'w-[400px]'
        }
      }
    ],
    []
  );

  const [searchQuery, setSearchQuery] = useState('');
  const dataGridKey = `${InactiveEvents.length}-${searchQuery}`; // Key for forcing re-render

  const fetchEvents = async (params: TDataGridRequestParams) => {
    try {
      let filteredEvents = InactiveEvents;

      if (searchQuery.length > 2) {
        filteredEvents = filteredEvents.filter((event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (params.sorting?.[0]?.id) {
        const { id, desc } = params.sorting[0];
        filteredEvents.sort((a, b) => {
          if (id === 'name') {
            return desc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
          } else if (id === 'startDate') {
            // Fixed startDate comparison
            return desc
              ? new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
              : new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          }
          return 0;
        });
      }

      const startIndex = params.pageIndex * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

      return {
        data: paginatedEvents,
        totalCount: filteredEvents.length
      };
    } catch (error) {
      console.error('Failed to fetch data:', error);
      enqueueSnackbar('An error occurred while fetching data. Please try again later', {
        variant: 'solid',
        state: 'danger'
      });

      return {
        data: [],
        totalCount: 0
      };
    }
  };

  return (
    <div className="grid">
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Inactive Events</h3>
          <div className="input input-sm max-w-48">
            <KeenIcon icon="magnifier" />
            <input
              type="text"
              placeholder="Search Events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body">
          <DataGrid
            key={dataGridKey} // Force re-render when data or search changes
            layout={{ cellsBorder: true }}
            columns={columns}
            serverSide={true}
            onFetchData={fetchEvents}
            rowSelect={false}
            pagination={{ size: 5 }}
            sorting={[{ id: 'name', desc: false }]}
          />
        </div>
      </div>
    </div>
  );
};

export { InactiveEventsTable };
