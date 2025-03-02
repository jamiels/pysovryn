import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, KeenIcon, MenuSeparator } from '@/components';
import { ColumnDef } from '@tanstack/react-table';
import { removeOrganization } from '@/services/organization_services.ts';

import { IOrganization } from '@/services/interfaces/org.i.ts';
import { useOrganizations } from '@/pages/views/organizations/OrganizationContext.tsx';
import { useNavigate } from 'react-router';

const Organizations = () => {
  const [filter, setFilter] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [filterData, setFilterData] = useState<IOrganization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<IOrganization | null>(null);

  const { fetchOrganizations, loading, organizations } = useOrganizations();

  const navigate = useNavigate();

  // Methods for Delete Event Dialog
  const handleCloseDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleOpenDeleteDialog = (orgSelected: IOrganization) => {
    setSelectedOrganization(orgSelected);
    setIsDeleteDialogOpen(true);
  };
  const handleOrganizationDelete = async () => {
    const is_deleted = await removeOrganization(selectedOrganization?.id);
    if (is_deleted) {
      fetchOrganizations();
    }
  };

  const handleOrganizationUpdate = async (selectedOrg: IOrganization) => {
    setSelectedOrganization(selectedOrg);
    // setIsUpdateDialogOpen(true);
    navigate(`/organizations/update-organization`, { state: { organization: selectedOrg } });
  };

  // Filter logic
  useEffect(() => {
    if (filter.length) {
      setFilterData(
        organizations.filter((organization) =>
          organization.name.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilterData(organizations);
    }
  }, [filter, organizations]);

  const columns = useMemo<ColumnDef<IOrganization>[]>(
    () => [
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
        id: 'actions',
        header: () => 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className={'flex flex-row items-center space-x-2'}>
            <button
              className={'btn btn-icon btn-xs hover:text-primary-active'}
              onClick={() => handleOrganizationUpdate(row.original)}
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
                  <MenuItem onClick={() => handleOrganizationUpdate(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="pencil" />
                      </MenuIcon>
                      <MenuTitle>Edit Organization</MenuTitle>
                    </MenuLink>
                  </MenuItem>

                  <MenuSeparator />
                  <MenuItem onClick={() => handleOpenDeleteDialog(row.original)}>
                    <MenuLink>
                      <MenuIcon>
                        <KeenIcon icon="trash" />
                      </MenuIcon>
                      <MenuTitle>Remove Organization</MenuTitle>
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
                placeholder="Search Organizations"
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
      <DeleteOrganization
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleOrganizationDelete}
      />
    </div>
  );
};

export { Organizations };

const DeleteOrganization: React.FC<{
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
                <p>Remove an Organization</p>
              </div>
              <p className={'text-sm font-normal text-gray-800 -mt-1'}>
                You are about to remove an organization. This action cannot be undone.
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
            Remove Organization
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
