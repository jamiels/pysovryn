import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IPublicSponsor } from '@/services/interfaces/public_forms.i.ts';
import { useSponsorRequest } from '@/pages/views/sponsorRequests/SponsorRequestContext.tsx';
import { removeSponsorRequest } from '@/services/publicForms/public_sponsor_services.ts';
import { handleCopyString } from '@/utils/helper_methods.ts';
import { toAbsoluteUrl } from '@/utils';

const SponsorRequests = () => {
  const [filter, setFilter] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [filterData, setFilterData] = useState<IPublicSponsor[]>([]);
  const [selectedSponsorRequest, setSelectedSponsorRequest] = useState<IPublicSponsor | null>(null);
  const { fetchSponsorRequests, loading, sponsorRequests } = useSponsorRequest();

  // Methods for Delete Event Dialog
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleOpenDeleteDialog = (sponsorRequestSelected: IPublicSponsor) => {
    setSelectedSponsorRequest(sponsorRequestSelected);
    setIsDeleteDialogOpen(true);
  };
  const handleSponsorshipRequestDelete = async () => {
    const is_removed = await removeSponsorRequest(selectedSponsorRequest?.id);
    if (is_removed) {
      fetchSponsorRequests();
    }
  };

  // This method fetches the sponsorship requests data from the backend at start
  useEffect(() => {
    fetchSponsorRequests();
  }, []);

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        (sponsorRequests || []).filter((request) =>
          request.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilterData(sponsorRequests || []);
    }
  }, [filter, sponsorRequests]);

  const columns = useMemo<ColumnDef<IPublicSponsor>[]>(
    () => [
      // {
      //   accessorFn: (row) => row.id,
      //   id: 'id',
      //   header: () => 'ID',
      //   enableSorting: true,
      //   cell: (info) => info.getValue(),
      //   meta: {
      //     className: 'w-12'
      //   }
      // },
      {
        accessorFn: (row) => row.name,
        id: 'name',
        header: () => 'Name',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.involvement,
        id: 'involvement',
        header: () => 'Involvement',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'contact',
        header: () => 'Contact',
        enableSorting: false,
        cell: (info) => (
          <div className={'flex flex-row gap-2'}>
            {info.row.original.linkedIn && (
              <div className="relative group">
                <img
                  onClick={() => handleCopyString(info.row.original.linkedIn)}
                  className={'cursor-pointer hover:opacity-80'}
                  alt={'linkedin-logo'}
                  src={toAbsoluteUrl('/media/brand-logos/linkedin.svg')}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  {info.row.original.linkedIn}
                </div>
              </div>
            )}
            {info.row.original.email && (
              <div className="relative group">
                <img
                  onClick={() => handleCopyString(info.row.original.email)}
                  className={'cursor-pointer hover:opacity-80 h-6 w-6'}
                  alt={'email'}
                  src={toAbsoluteUrl('/media/coloured-icons/mail.png')}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  {info.row.original.email}
                </div>
              </div>
            )}

            {!info.row.original.linkedIn && (
              <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
            )}
          </div>
        ),
        meta: {
          className: 'min-w-[150px] max-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },

      {
        id: 'action',
        header: () => 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <button className={'btn btn-sm'} onClick={() => handleOpenDeleteDialog(row.original)}>
            <KeenIcon icon={'trash'} />
          </button>
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
        <h3 className="card-title font-medium text-sm">{''}</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Sponsor Requests"
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
      <DeleteSponsorRequestDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleSponsorshipRequestDelete}
      />
    </div>
  );
};

export { SponsorRequests };

const DeleteSponsorRequestDialog: React.FC<{
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
                <p> Remove Sponsorship request</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-1'}>
                Are you sure you want to remove this sponsorship request?
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
            Remove Sponsorship
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
