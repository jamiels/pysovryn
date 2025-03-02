import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IPublicSpeaker } from '@/services/interfaces/public_forms.i.ts';
import { removeSpeakerRequest } from '@/services/publicForms/public_speaker_service.ts';
import { useSpeakerRequest } from '@/pages/views/speakerRequests/SpeakerRequestContext.tsx';
import { toAbsoluteUrl } from '@/utils';

const SpeakerRequests = () => {
  const [filter, setFilter] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [filterData, setFilterData] = useState<IPublicSpeaker[]>([]);
  const [selectedSpeakerRequest, setSelectedSpeakerRequest] = useState<IPublicSpeaker | null>(null);
  const { fetchSpeakerRequests, loading, SpeakerRequests } = useSpeakerRequest();

  // Methods for Delete Event Dialog
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleOpenDeleteDialog = (SpeakerRequestSelected: IPublicSpeaker) => {
    setSelectedSpeakerRequest(SpeakerRequestSelected);
    setIsDeleteDialogOpen(true);
  };
  const handleSpeakerRequestDelete = async () => {
    const is_removed = await removeSpeakerRequest(selectedSpeakerRequest?.id);
    if (is_removed) {
      fetchSpeakerRequests();
    }
  };

  // This method fetches the Speakers requests data from the backend at start
  useEffect(() => {
    fetchSpeakerRequests();
  }, []);

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        (SpeakerRequests || []).filter((request) =>
          request.fullName.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilterData(SpeakerRequests || []);
    }
  }, [filter, SpeakerRequests]);

  const columns = useMemo<ColumnDef<IPublicSpeaker>[]>(
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
        accessorFn: (row) => row.fullName,
        id: 'name',
        header: () => 'Name',
        enableSorting: true,
        cell: (info) => (
          <div className={'flex flex-row gap-2 items-center justify-between'}>
            <p className={'font-medium'}>{info.getValue ? (info.getValue() as string) : ''}</p>
            {info.row.original.linkedInURL && (
              <img
                onClick={() => window.open(info.row.original.linkedInURL, '_blank')}
                className={'cursor-pointer hover:opacity-80'}
                alt={'linkedin-logo'}
                src={toAbsoluteUrl('/media/brand-logos/linkedin.svg')}
              />
            )}
          </div>
        ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      // {
      //   accessorFn: (row) => row.email,
      //   id: 'email',
      //   header: () => 'Speaker Email',
      //   enableSorting: true,
      //   cell: (info) => info.getValue(),
      //   meta: {
      //     className: 'min-w-[150px]',
      //     cellClassName: 'text-gray-800 font-normal'
      //   }
      // },
      {
        accessorFn: (row) => row.organization,
        id: 'organization',
        header: () => 'Organization',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.title,
        id: 'title',
        header: () => 'Title',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.panelists,
        id: 'panelists',
        header: () => 'Panelists',
        enableSorting: true,
        cell: (info) => <> {info.getValue() == true ? 'Yes' : 'No'}</>,
        meta: {
          className: 'min-w-[25px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.abstractText,
        id: 'abstract',
        header: () => 'Abstract',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },

      {
        accessorFn: (row) => row.sponsorshipInterest,
        id: 'sponsorshipInterest',
        header: () => 'Sponsorship Interest',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[25px]',
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
    <div className="card card-grid min-w-full ">
      <div className="card-header flex-wrap gap-2">
        <h3 className="card-title font-medium text-sm">{''}</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Speaker Requests"
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
          sorting={[{ id: 'name', desc: false }]}
        />
      </div>
      <DeleteSpeakerRequestDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleSpeakerRequestDelete}
      />
    </div>
  );
};

export { SpeakerRequests };

const DeleteSpeakerRequestDialog: React.FC<{
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
                <p> Remove Speaker request</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-1'}>
                Are you sure you want to remove this Speaker request?
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
            Remove Speaker
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
