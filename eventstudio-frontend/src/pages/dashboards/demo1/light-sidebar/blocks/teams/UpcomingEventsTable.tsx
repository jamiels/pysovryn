import React, { useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { DataGrid, TDataGridRequestParams, KeenIcon } from '@/components';
import { formatIsoDate } from '@/utils/Date';
import { useDashboard } from '@/pages/dashboards/demo1/light-sidebar/DashboardContext.tsx';

import { useNavigate } from 'react-router';

export type UpcomingEvent = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  meetup: string;
  luma: string;
  eventbrite: string;
};

const UpcomingEventsTable = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { dashboardStatus, loading } = useDashboard();
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(null);
  const navigate = useNavigate();

  const handleOpenEventDetailsDialog = (eventID: number) => {
    setSelectedEvent(selectedEvent);

    navigate(`/events/event-dashboard/`, { state: { event_id: eventID } });
  };

  const upcomingEvents: UpcomingEvent[] =
    dashboardStatus?.upcomingEvents?.map((event) => ({
      id: event.eventId,
      name: event.eventName,
      startDate: event.startDate,
      endDate: event.endDate,
      venue: event.venueName,
      luma: event.luma,
      meetup: event.meetup,
      eventbrite: event.eventbrite
    })) || [];

  const columns = useMemo<ColumnDef<UpcomingEvent>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'project',
        header: () => 'Event ',
        enableSorting: true,
        cell: (info) => (
          <div
            className="flex flex-col gap-2"
            onClick={() => handleOpenEventDetailsDialog(info.row.original.id)}
          >
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
        accessorFn: (row) => row.venue,
        id: 'venue',
        enableSorting: true,
        header: () => ' Venue',
        cell: (info) => info.row.original.venue,
        meta: {
          className: 'w-[400px]'
        }
      },
      {
        accessorFn: (row) => row.startDate,
        id: 'startDate',
        enableSorting: true,
        header: () => ' Start Date',
        cell: (info) =>
          info.row.original.startDate ? formatIsoDate(info.row.original.startDate) : '',
        meta: {
          className: 'w-[400px]'
        }
      },
      {
        accessorFn: (row) => row.endDate,
        id: 'endDate',
        enableSorting: true,
        header: () => ' End Date',
        cell: (info) => (info.row.original.endDate ? formatIsoDate(info.row.original.endDate) : ''),
        meta: {
          className: 'w-[400px]'
        }
      },
      {
        accessorFn: (row) => row.luma,
        id: 'luma',
        enableSorting: true,
        header: () => 'Luma RSVP',
        cell: (info) => info.row.original.luma,
        meta: {
          className: 'w-[150px]'
        }
      },
      {
        accessorFn: (row) => row.meetup,
        id: 'meetup',
        enableSorting: true,
        header: () => 'Meetup RSVP',
        cell: (info) => info.row.original.meetup,
        meta: {
          className: 'w-[150px]'
        }
      },
      {
        accessorFn: (row) => row.eventbrite,
        id: 'eventbrite',
        enableSorting: true,
        header: () => 'Brite RSVP',
        cell: (info) => info.row.original.eventbrite,
        meta: {
          className: 'w-[150px]'
        }
      }
    ],
    []
  );

  const [searchQuery, setSearchQuery] = useState('');
  const dataGridKey = `${upcomingEvents.length}-${searchQuery}`; // Key for re-renders

  const fetchEvents = async (params: TDataGridRequestParams) => {
    try {
      let filteredEvents = upcomingEvents;

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
          <h3 className="card-title">Upcoming Events</h3>
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
            key={dataGridKey} // Force re-render on changes
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

export { UpcomingEventsTable };
