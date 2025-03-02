import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IVolunteer } from '@/services/interfaces/volunteer.i.ts';
import { removeVolunteerRequest } from '@/services/publicForms/public_volunteer_service.ts';
import { useVolunteer } from '@/pages/views/volunteers/VolunteerContext.tsx';
import { handleCopyString } from '@/utils/helper_methods.ts';
import { toAbsoluteUrl } from '@/utils';

const Volunteers = () => {
  const [filter, setFilter] = useState<string>('');
  const [filterData, setFilterData] = useState<IVolunteer[]>([]);

  const { fetchVolunteers, loading, volunteers } = useVolunteer();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<IVolunteer | null>(null);

  // Methods for Delete Event Dialog
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleOpenDeleteDialog = (selectedVolunteer: IVolunteer) => {
    setSelectedVolunteer(selectedVolunteer);
    setIsDeleteDialogOpen(true);
  };
  const handleVolunteerDelete = async () => {
    const is_removed = await removeVolunteerRequest(selectedVolunteer?.id);
    if (is_removed) {
      fetchVolunteers();
    }
  };

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        (volunteers || []).filter((volunteer) =>
          volunteer.fullName.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilterData(volunteers || []);
    }
  }, [filter, volunteers]);

  const columns = useMemo<ColumnDef<IVolunteer>[]>(
    () => [
      {
        accessorFn: (row) => row.fullName,
        id: 'fullName',
        header: () => 'Full Name',
        enableSorting: true,
        cell: (info) => info.getValue(),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },

      {
        accessorFn: (row) => row.communicationTools,
        id: 'communicationTools',
        header: () => 'Communication Tools',
        enableSorting: false,
        cell: (info) => (info.getValue() as string[]).join(', ') || 'N/A',
        meta: {
          className: 'min-w-[150px]'
        }
      },
      {
        id: 'contact',
        header: () => 'Contact',
        enableSorting: false,
        cell: (info) => (
          <div className={'flex flex-row gap-2 items-center'}>
            {info.row.original.linkedInURL && (
              <img
                onClick={() => handleCopyString(info.row.original.linkedInURL)}
                className={'cursor-pointer hover:opacity-80 w-5 h-5'}
                alt={'linkedin-logo'}
                src={toAbsoluteUrl('/media/brand-logos/linkedin.svg')}
              />
            )}
            {info.row.original.telegramID && (
              <img
                onClick={() => handleCopyString(info.row.original.telegramID)}
                className={'cursor-pointer hover:opacity-80 w-5 h-5'}
                alt={'telegram-logo'}
                src={toAbsoluteUrl('/media/brand-logos/telegram.svg')}
              />
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
            {info.row.original.mobilePhone && (
              <div className="relative group">
                <img
                  onClick={() => handleCopyString(info.row.original.mobilePhone)}
                  className={'cursor-pointer hover:opacity-80 h-6 w-6'}
                  alt={'mobilePhone'}
                  src={toAbsoluteUrl('/media/coloured-icons/phone.png')}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  {info.row.original.mobilePhone}
                </div>
              </div>
            )}

            {!info.row.original.linkedInURL &&
              !info.row.original.telegramID &&
              !info.row.original.email &&
              !info.row.original.mobilePhone && (
                <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
              )}
          </div>
        ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      /* {
        accessorFn: (row) => row.telegramID,
        id: 'telegramID',
        header: () => 'Telegram ID',
        enableSorting: false,
        cell: (info) => info.getValue() || 'N/A',
        meta: {
          className: 'min-w-[150px]'
        }
      },*/

      {
        accessorFn: (row) => row.areasOfSupport,
        id: 'areasOfSupport',
        header: () => 'Areas of Support',
        enableSorting: false,
        cell: (info) => (
          <div className="flex flex-wrap gap-2">
            {(info.getValue() as string[]).map((area) => (
              <li key={area} className="text-gray-800 text-xs">
                {area}
              </li>
            ))}
          </div>
        ),
        meta: {
          className: 'min-w-[200px]'
        }
      },
      {
        accessorFn: (row) => row.businessAttire,
        id: 'businessAttire',
        header: () => 'Business Attire',
        enableSorting: false,
        cell: (info) => (
          <span
            className={`badge badge-sm badge-outline ${info.getValue() ? 'badge-success' : 'badge-danger'}`}
          >
            {info.getValue() ? 'Yes' : 'No'}
          </span>
        ),
        meta: {
          className: 'min-w-[100px]'
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
                placeholder="Search Volunteers"
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
          sorting={[{ id: 'fullName', desc: true }]}
        />
      </div>
      <DeleteVolunteerDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleVolunteerDelete}
      />
    </div>
  );
};

export { Volunteers };

const DeleteVolunteerDialog: React.FC<{
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
                <p> Remove Volunteer request</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-1'}>
                Are you sure you want to remove this volunteer?
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
            Remove Volunteer
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
