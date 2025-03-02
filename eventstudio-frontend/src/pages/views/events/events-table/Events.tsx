import React, { useState, useMemo, useEffect } from 'react';

import { DataGrid, KeenIcon, MenuSeparator } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IEvent } from '@/services/interfaces/event.i.ts';

import { useEvents } from '@/pages/views/events/EventContext.tsx';
import { deleteEvent, updateEvent } from '@/services/event_services.ts';

import { useNavigate } from 'react-router';

import { handleCopyString } from '@/utils/helper_methods.ts';

const Events = () => {
  const [filter, setFilter] = useState<string>('');
  const { events, fetchEvents, loading } = useEvents();
  const [filterData, setFilterData] = useState<IEvent[]>([]);
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  // Methods for Update Event Dialog
  const handleOpenUpdateDialog = (eventSelected: IEvent) => {
    navigate(`/events/update-event/`, { state: { event: eventSelected } });
  };

  // Methods for Event Details Dialog
  const handleOpenEventDetailsDialog = (eventSelected: IEvent) => {
    setSelectedEvent(eventSelected);

    navigate(`/events/event-dashboard/`, { state: { event: eventSelected } });
  };

  // Methods for Delete Event Dialog
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleOpenDeleteDialog = (eventSelected: IEvent) => {
    setSelectedEvent(eventSelected);
    setIsDeleteDialogOpen(true);
  };

  // Method to delete an event from the list
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    const is_deleted = await deleteEvent(selectedEvent.id);
    if (is_deleted) {
      fetchEvents();
    }
  };

  const handleToggleActive = async (selected_event: IEvent) => {
    const updatedEvent = { ...selected_event, isActive: !selected_event.isActive };

    const is_updated = await updateEvent(selected_event.id, updatedEvent);
    if (is_updated) {
      fetchEvents();
    }
  };

  useEffect(() => {
    if (filter.length) {
      setFilterData(
        events?.filter((event: IEvent) =>
          event?.name.toLowerCase()?.includes(filter?.toLowerCase())
        )
      );
    } else {
      setFilterData(events);
    }
  }, [events, filter]);

  const columns = useMemo<ColumnDef<IEvent>[]>(
    () => [
      {
        accessorFn: (row: IEvent) => row.name,
        id: 'name',
        header: () => 'Event',
        enableSorting: true,
        cell: ({ row }) => (
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => handleOpenEventDetailsDialog(row.original)}
          >
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
      /*   {
        accessorFn: (row) => row.shortName,
        id: 'shortName',
        header: () => 'Short Name',
        enableSorting: false,
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
          ),
        meta: {
          className: 'min-w-[120px]'
        }
      },*/
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

      // {
      //   accessorFn: (row) => row.startDate,
      //   id: 'startDate',
      //   header: () => 'Start Date',
      //   enableSorting: true,
      //   cell: (info) => {
      //     const value = info.row.original.startDate;
      //     return isNaN(Date.parse(value)) ? (
      //       <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
      //     ) : (
      //       <p className={'text-sm'}>{formatIsoDate(value)}</p>
      //     );
      //   },
      //   meta: {
      //     className: 'min-w-[120px]'
      //   }
      // },
      // {
      //   accessorFn: (row) => row.endDate,
      //   id: 'endDate',
      //   header: () => 'End Date',
      //   enableSorting: true,
      //   cell: (info) => {
      //     const value = info.row.original.endDate;
      //     return isNaN(Date.parse(value)) ? (
      //       <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
      //     ) : (
      //       <p className={'text-sm'}>{formatIsoDate(value)}</p>
      //     );
      //   },
      //
      //   meta: {
      //     className: 'min-w-[120px]'
      //   }
      // },
      // {
      //   accessorFn: (row) => row.timezone,
      //   id: 'timezone',
      //   header: () => 'Timezone',
      //   enableSorting: true,
      //   cell: (info) =>
      //     info.getValue() ? (
      //       <p className={'text-xs'}>{getTimezoneLabel(info.getValue() as string)}</p>
      //     ) : (
      //       <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
      //     ),
      //   meta: {
      //     className: 'min-w-[100px]'
      //   }
      // },

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
        header: () => 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className={'flex flex-row items-center space-x-2'}>
            <label className="switch switch-sm">
              <input
                checked={row.original.isActive}
                name="is_active"
                type="checkbox"
                onClick={() => handleToggleActive(row.original)}
              />
            </label>

            <MenuSeparator />
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => handleOpenUpdateDialog(row.original)}
            >
              <KeenIcon icon={'pencil'} />
            </button>
            <MenuSeparator />
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => handleOpenDeleteDialog(row.original)}
            >
              <KeenIcon icon={'trash'} />
            </button>
          </div>
        ),
        meta: {
          className: 'min-w-[120px]'
        }
      }

      /*  {
        id: 'menu',
        header: () => '',
        enableSorting: false,
        cell: ({ row }) => (
          <>
            <Menu className=" rounded-md mt-2 p-2">
              <MenuItem
                toggle="dropdown"
                trigger="hover"
                dropdownProps={{
                  placement: isRTL() ? 'left-start' : 'right-start',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: isRTL() ? [50, 0] : [-50, 0] // [skid, distance]
                      }
                    }
                  ]
                }}
              >
                <MenuLink>
                  <KeenIcon icon="dots-square-vertical" />
                </MenuLink>
                <MenuSub className="menu-default light:border-gray-300 w-[200px] md:w-[220px]">
                  <MenuItem onClick={() => handleOpenEventDetailsDialog(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="information-4" />
                      </MenuIcon>
                      <MenuTitle> Event Details</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem onClick={() => handleOpenUpdateDialog(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="pencil" />
                      </MenuIcon>
                      <MenuTitle>Edit Event</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                  <MenuItem>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="calendar-tick" />
                      </MenuIcon>
                      <MenuTitle>Activate Event</MenuTitle>
                      <label className="switch switch-sm">
                        <input
                          checked={row.original.isActive}
                          name="is_active"
                          type="checkbox"
                          onClick={() => handleToggleActive(row.original)}
                        />
                      </label>
                    </MenuLink>
                  </MenuItem>
                  <MenuSeparator />
                  <MenuItem onClick={() => handleOpenDeleteDialog(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="trash" />
                      </MenuIcon>
                      <MenuTitle>Remove Event</MenuTitle>
                    </MenuLink>
                  </MenuItem>
                </MenuSub>
              </MenuItem>
            </Menu>
          </>
        ),
        meta: {
          className: 'w-[60px]'
        }
      }*/
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
          sorting={[{ id: 'name', desc: true }]}
        />
      </div>

      <DeleteEventDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteEvent}
      />
      {/*   <EventDetailsDialog
        isOpen={isEventDetailsDialogOpen}
        onClose={handleCloseEventDetailsDialog}
        selectedEvent={selectedEvent}
      />*/}
    </div>
  );
};

export { Events };

const DeleteEventDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}> = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
      style={{ animation: 'fadeIn 0.3s ease' }}
      onClick={onClose}
    >
      <div
        className="dark:bg-neutral-950 dark:border-gray-50/15 dark:border bg-white rounded-lg p-6 w-full sm:w-96 md:w-1/2 lg:w-1/3 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800  items-center gap-2">
            <div className={'flex flex-col gap-2'}>
              <div className={'flex flex-row items-center gap-2 justify-start '}>
                <p>Remove an Event</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-2'}>
                You are about to delete an event. This action cannot be undone.
              </p>
            </div>
          </h3>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="btn  btn-danger text-white w-1/2 items-center justify-center"
          >
            Delete Event
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary text-gray-600  w-1/2 justify-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
