import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';
import { IDocumentsData } from '.';
import { TokenProjectsContext } from '@/pages/projects/providers';

const ProjectDocumentTable = () => {
  const { currentTokenProject } = useContext(TokenProjectsContext);
  const [filter, setFilter] = useState<string>('');
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilterData(currentTokenProject?.documents);
  }, [currentTokenProject]);

  const columns = useMemo<ColumnDef<IDocumentsData>[]>(
    () => [
      {
        accessorFn: (row: IDocumentsData) => row.type,
        id: 'type',
        header: () => 'Type',
        enableSorting: true,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-col">
                  <Link
                    to={`/token-projects/doc/view/${row.original.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
                  >
                    {row.original.type}
                  </Link>
                </div>
              </div>
            </div>
          );
        },
        meta: {
          className: 'min-w-[150px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        accessorFn: (row) => row.description,
        id: 'description',
        header: () => 'Description',
        enableSorting: false,
        cell: (info) => {
          return info?.row?.original?.description;
        },
        meta: {
          className: 'min-w-[80px]'
        }
      },
      {
        accessorFn: (row) => row.views,
        id: 'views',
        header: () => 'Views',
        enableSorting: true,
        cell: (info) => {
          return info.row.original.views;
        },
        meta: {
          className: 'min-w-[80px]'
        }
      },
      {
        accessorFn: (row) => row.lastUpdated,
        id: 'lastUpdated',
        header: () => 'Date Updated',
        enableSorting: true,
        cell: (info) => {
          return info.row.original.lastUpdated;
        },
        meta: {
          className: 'min-w-[120px]'
        }
      },
      {
        accessorFn: (row) => row.id,
        id: 'docHash',
        header: () => 'DocHash',
        enableSorting: false,
        cell: (info) => {
          return info.row.original.id;
        },
        meta: {
          className: 'min-w-[300px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'Update',
        header: () => 'Update',
        enableSorting: false,
        cell: () => {
          return (
            <button className="btn btn-sm btn-icon btn-clear btn-light">
              <KeenIcon icon="notepad-edit" />
            </button>
          );
        },
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
                placeholder="Search projects"
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
          data={filterData}
          loading={loading}
          columns={columns}
          rowSelect={false}
          pagination={{ size: 5 }}
          sorting={[{ id: 'type', desc: true }]}
        />
      </div>
    </div>
  );
};

export { ProjectDocumentTable };
