import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon, MenuSeparator } from '@/components';
import { ColumnDef } from '@tanstack/react-table';

import { IProducer } from '@/services/interfaces/producer.i.ts';

import { useProducers } from '@/pages/views/producers/ProducerContext.tsx';
import { removeProducer } from '@/services/producer_services.s.ts';
import { useNavigate } from 'react-router';

const Producers = () => {
  const [filter, setFilter] = useState<string>('');
  const navigate = useNavigate();

  const [selectedProducer, setSelectedProducer] = useState<IProducer | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const handleOpenDeleteDialog = (producer: IProducer) => {
    setSelectedProducer(producer);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProducer(null);
  };

  const handleDeleteProducer = async () => {
    const is_deleted: boolean = await removeProducer(selectedProducer?.id);
    if (is_deleted) {
      fetchProducers();
    }
  };

  const handleOpenUpdateDialog = (producer: IProducer) => {
    setSelectedProducer(producer);
    navigate('/producers/update/producer', { state: producer });
  };

  const [filterData, setFilterData] = useState<IProducer[]>([]);

  const { fetchProducers, producers, loading } = useProducers();

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        producers.filter((producer) => producer.name.toLowerCase().includes(filter.toLowerCase()))
      );
    } else {
      setFilterData(producers);
    }
  }, [filter, producers]);

  const columns = useMemo<ColumnDef<IProducer>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'name',
        header: () => 'Producer Name',
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
                  <MenuItem onClick={() => handleOpenUpdateDialog(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="pencil" />
                      </MenuIcon>
                      <MenuTitle>Edit Producer</MenuTitle>
                    </MenuLink>
                  </MenuItem>

                  <MenuSeparator />
                  <MenuItem onClick={() => handleOpenDeleteDialog(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="trash" />
                      </MenuIcon>
                      <MenuTitle>Remove Producer</MenuTitle>
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
                placeholder="Search Users"
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

      <DeleteProducerDialog
        isOpen={isDeleteDialogOpen}
        onDelete={handleDeleteProducer}
        onClose={handleCloseDeleteDialog}
      />
    </div>
  );
};

export { Producers };

const DeleteProducerDialog: React.FC<{
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
                <p>Remove an Producer</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-1'}>
                Are you sure you want to remove this Producer? This process cannot be undone.
              </p>
            </div>
          </h3>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onClose}
            className="btn btn-secondary text-gray-600  w-1/2 justify-center"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="btn  btn-danger text-white w-1/2 items-center justify-center"
          >
            Remove Producer
          </button>
        </div>
      </div>
    </div>
  );
};
