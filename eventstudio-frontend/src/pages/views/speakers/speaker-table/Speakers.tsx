import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon, MenuSeparator } from '@/components';
import { ColumnDef } from '@tanstack/react-table';
import { ISpeakers } from '@/services/interfaces/speakers.i.ts';

import { useSpeaker } from '@/pages/views/speakers/SpeakerContext.tsx';
import { deleteSpeaker } from '@/services/speakers_service.ts';
import { handleCopyString } from '@/utils/helper_methods.ts';
import { useNavigate } from 'react-router';
import { toAbsoluteUrl } from '@/utils';

const Speakers = () => {
  const [filter, setFilter] = useState<string>('');
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState<ISpeakers[]>([]);

  const { fetchSpeakers, loading, speakers } = useSpeaker();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [selectedSpeaker, setSelectedSpeaker] = useState<ISpeakers>({} as ISpeakers);

  // Methods for Delete Event Dialog
  const openDeleteDialog = (speakerSelected: ISpeakers) => {
    setSelectedSpeaker(speakerSelected);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleDelete = async () => {
    const isSpeakerRemoved = await deleteSpeaker(selectedSpeaker?.id);
    if (isSpeakerRemoved) {
      fetchSpeakers();
    }
  };

  // Methods for Update Event Dialog
  const openUpdateDialog = (speakerSelected: ISpeakers) => {
    setSelectedSpeaker(speakerSelected);
    // setIsUpdateDialogOpen(true);
    navigate('/speakers/update-speaker', { state: { speaker: speakerSelected } });
  };

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        speakers.filter((speaker) =>
          `${speaker.firstName} ${speaker.lastName}`.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilterData(speakers);
    }
  }, [filter, speakers]);

  const columns = useMemo<ColumnDef<ISpeakers>[]>(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
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
        id: 'contact',
        header: () => 'Contact',
        enableSorting: false,
        cell: (info) => (
          <div className={'flex flex-row gap-2'}>
            {info.row.original.linkedInURL && (
              <img
                onClick={() => handleCopyString(info.row.original.linkedInURL)}
                className={'cursor-pointer hover:opacity-80'}
                alt={'linkedin-logo'}
                src={toAbsoluteUrl('/media/brand-logos/linkedin.svg')}
              />
            )}
            {info.row.original.twitterURL && (
              <img
                onClick={() => handleCopyString(info.row.original.twitterURL)}
                className={'cursor-pointer hover:opacity-80'}
                alt={'twitter-logo'}
                src={toAbsoluteUrl('/media/brand-logos/twitter.svg')}
              />
            )}
            {info.row.original.emailAddress && (
              <div className="relative group">
                <img
                  onClick={() => handleCopyString(info.row.original.emailAddress)}
                  className={'cursor-pointer hover:opacity-80 h-6 w-6'}
                  alt={'email'}
                  src={toAbsoluteUrl('/media/coloured-icons/mail.png')}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  {info.row.original.emailAddress}
                </div>
              </div>
            )}
            {!info.row.original.linkedInURL &&
              !info.row.original.twitterURL &&
              !info.row.original.emailAddress && (
                <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
              )}
          </div>
        ),
        meta: {
          className: 'min-w-[80px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.primaryAffiliation,
        id: 'primaryAffiliation',
        header: () => 'Primary Affiliation',
        enableSorting: true,
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
          ),
        meta: {
          className: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.title,
        id: 'title',
        header: () => 'Title',
        enableSorting: true,
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
          ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },

      {
        accessorFn: (row) => row.headshot,
        id: 'headshot',
        header: () => 'Headshot',
        enableSorting: false,

        cell: (info) =>
          info.getValue() ? (
            <div
              onClick={() => handleCopyString(info.getValue() as string)}
              className={
                'badge badge-sm items-center flex gap-2 cursor-pointer hover:badge-outline'
              }
            >
              Copy HeadShot <KeenIcon icon={'copy'} />
            </div>
          ) : (
            <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
          )
      },
      {
        accessorFn: (row) => row.bio,
        id: 'bio',
        header: () => 'Bio',
        enableSorting: false,
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
          ),
        meta: {
          className: 'min-w-[100px] max-w-[300px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.adminFullName,
        id: 'adminFullName',
        header: () => 'Admin ',
        enableSorting: true,
        cell: (info) => (
          <div className={'flex flex-col  text-xs'}>
            <p className={'font-semibold'}>{info.getValue() as string}</p>
            <p>
              {info.row.original.adminEmailAddress
                ? (info.row.original.adminEmailAddress as string)
                : ''}
            </p>
          </div>
        ),
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      /*    {
        accessorFn: (row) => row.adminEmailAddress,
        id: 'adminEmailAddress',
        header: () => 'Admin Email',
        enableSorting: true,
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <div className={'badge badge-sm badge-warning badge-outline'}>Not Set</div>
          ),
        meta: {
          className: 'min-w-[200px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },*/
      {
        id: 'actions',
        header: () => 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className={'flex flex-row items-center space-x-2'}>
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => openUpdateDialog(row.original)}
            >
              <KeenIcon icon={'pencil'} />
            </button>
            <MenuSeparator />
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => openDeleteDialog(row.original)}
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
                  <MenuItem onClick={() => openUpdateDialog(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="pencil" />
                      </MenuIcon>
                      <MenuTitle>Edit Speaker</MenuTitle>
                    </MenuLink>
                  </MenuItem>

                  <MenuSeparator />
                  <MenuItem onClick={() => openDeleteDialog(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="trash" />
                      </MenuIcon>
                      <MenuTitle>Remove Speaker</MenuTitle>
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
        <h3 className="card-title font-medium text-sm">Speakers</h3>

        <div className="flex flex-wrap gap-2 lg:gap-5">
          <div className="flex">
            <label className="input input-sm">
              <KeenIcon icon="magnifier" />
              <input
                placeholder="Search Speakers"
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
      <DeleteSpeakerDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onDelete={handleDelete}
      />
    </div>
  );
};

export { Speakers };

export const DeleteSpeakerDialog: React.FC<{
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
                <p>Remove a Speaker</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-2'}>
                Are you sure you want to remove this speaker?
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
