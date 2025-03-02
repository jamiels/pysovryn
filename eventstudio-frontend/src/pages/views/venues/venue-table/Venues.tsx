import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon, MenuSeparator } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IVenue } from '@/services/interfaces/venue.i.ts';

import { useVenue } from '@/pages/views/venues/VenueContext.tsx';

import { deleteVenue } from '@/services/venue_services.ts';
import { useNavigate } from 'react-router';

const Venues = () => {
  const [filter, setFilter] = useState<string>('');

  const [filterData, setFilterData] = useState<IVenue[]>([]);
  const navigate = useNavigate();

  const { fetchVenues, venues, loading } = useVenue();

  // update dialog methods
  const [selectedVenue, setSelectedVenue] = useState<IVenue | null>(null);

  const handleUpdateDialogOpen = (venue: IVenue) => {
    setSelectedVenue(venue);
    navigate('/venues/update-venue', { state: { venue } });
  };

  //delete dialog methods
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const handleDeleteDialogOpen = (venue: IVenue) => {
    setSelectedVenue(venue);
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteDialogClose = () => {
    setSelectedVenue(null);
    setIsDeleteDialogOpen(false);
  };

  const handleVenueDelete = async () => {
    const is_removed: boolean = await deleteVenue(selectedVenue?.id);
    if (is_removed) {
      fetchVenues();
    }
  };

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        venues.filter((venue) => venue.name.toLowerCase().includes(filter.toLowerCase()))
      );
    } else {
      setFilterData(venues);
    }
  }, [filter, venues]);

  const columns = useMemo<ColumnDef<IVenue>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'name',
        header: () => 'Venue',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'actions',
        header: () => 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className={'flex flex-row items-center space-x-2'}>
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => handleUpdateDialogOpen(row.original)}
            >
              <KeenIcon icon={'pencil'} />
            </button>
            <MenuSeparator />
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => handleDeleteDialogOpen(row.original)}
            >
              <KeenIcon icon={'trash'} />
            </button>
          </div>
        ),
        meta: {
          className: 'w-[60px]'
        }
      }
      /* {
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
                  <MenuItem onClick={() => handleUpdateDialogOpen(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="pencil" />
                      </MenuIcon>
                      <MenuTitle>Edit Venue</MenuTitle>
                    </MenuLink>
                  </MenuItem>

                  <MenuSeparator />
                  <MenuItem onClick={() => handleDeleteDialogOpen(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="trash" />
                      </MenuIcon>
                      <MenuTitle>Remove Venue</MenuTitle>
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
        <h3 className="card-title font-medium text-sm">{''}</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Venues"
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

      <DeleteVenue
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onDelete={handleVenueDelete}
      />
    </div>
  );
};

export { Venues };

const DeleteVenue: React.FC<{
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
}> = ({ isOpen, onDelete, onClose }) => {
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
                <p>Remove Venue</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-1'}>
                Are you sure you want to remove this venue? This process cannot be undone.
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
            Remove Venue
          </button>{' '}
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
