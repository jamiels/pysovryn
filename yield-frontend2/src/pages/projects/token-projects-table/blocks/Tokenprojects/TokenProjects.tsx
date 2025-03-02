import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toAbsoluteUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { DataGrid, KeenIcon } from '@/components';
import { ColumnDef } from '@tanstack/react-table';
import { IProjectsData } from '.';
import { TokenProjectsContext } from '@/pages/projects/providers';

const TokenProjects = () => {
  const { fetchTokenProjectList, reloadData, setTokenProjectCount } =
    useContext(TokenProjectsContext);

  const [filter, setFilter] = useState<string>('');
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async (params: any) => {
    setLoading(true);
    try {
      const response = await fetchTokenProjectList(params);
      setTokenProjectCount(response.data?.page?.totalElements);

      const resposeData = response.data?.content?.map((project: any) => ({
        project: { name: project?.name, url: project?.projectUrl, id: project?.id },
        raise: project?.targetRaise,
        symbol: project?.tokens?.[0]?.symbol,
        stage: { label: project?.raiseStage, color: 'primary' },
        base: project?.country,
        blurb: project?.blurb,
        flag: 'british-virgin-islands.svg'
      }));

      setData(resposeData);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log(error);
    }
  };

  useEffect(() => {
    getData({ pageIndex: 0, pageSize: 10000 });
  }, [reloadData]);

  useEffect(() => {
    if (filter.length) {
      setFilterData(
        data?.filter(
          (project: any) =>
            project?.project?.name.toLowerCase()?.includes(filter?.toLowerCase()) ||
            project?.symbol?.toLowerCase()?.includes(filter?.toLowerCase())
        )
      );
    } else {
      setFilterData(data);
    }
  }, [data, filter]);

  const columns = useMemo<ColumnDef<IProjectsData>[]>(
    () => [
      {
        accessorFn: (row: IProjectsData) => row.project,
        id: 'name',
        header: () => 'Project Name',
        enableSorting: true,
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-0.5">
                <div className="flex flex-col">
                  <Link
                    to={`/token-projects/${row.original.project.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px"
                  >
                    {row.original.project.name}
                  </Link>
                  <a
                    href={row.original.project.url}
                    target="_blank"
                    className="text-2sm text-gray-700 font-normal"
                  >
                    {row.original.project.url}
                  </a>
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
        accessorFn: (row) => row.raise,
        id: 'targetRaise',
        header: () => 'Raise',
        enableSorting: true,
        cell: (info) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(parseFloat(info?.row?.original?.raise) || 0);
        },
        meta: {
          className: 'min-w-[80px]'
        }
      },
      {
        accessorFn: (row) => row.symbol,
        id: 'p.token.symbol',
        header: () => 'Symbol',
        enableSorting: true,
        cell: (info) => {
          return info.row.original.symbol;
        },
        meta: {
          className: 'min-w-[80px]'
        }
      },
      {
        accessorFn: (row) => row.stage,
        id: 'raiseStage',
        header: () => 'Stage',
        enableSorting: true,
        cell: (info) => {
          return (
            <span
              className={`badge badge-${info.row.original.stage.color} shrink-0 badge-outline rounded-[30px]`}
            >
              <span
                className={`size-1.5 rounded-full bg-${info.row.original.stage.color} me-1.5`}
              ></span>
              {info.row.original.stage.label}
            </span>
          );
        },
        meta: {
          className: 'min-w-[120px]'
        }
      },
      {
        accessorFn: (row) => row.base,
        id: 'country',
        header: () => 'Base',
        enableSorting: true,
        cell: (info) => {
          return (
            <div className="flex items-center text-gray-800 font-normal gap-1.5">
              <img
                src={toAbsoluteUrl(`/media/flags/${info.row.original.flag}`)}
                className="rounded-full size-4 shrink-0"
                alt={`${info.row.original.base}`}
              />
              {info.row.original.base}
            </div>
          );
        },
        meta: {
          className: 'min-w-[100px]'
        }
      },
      {
        accessorFn: (row) => row.blurb,
        id: 'blurb',
        header: () => 'Blurb',
        enableSorting: false,
        cell: (info) => {
          return info.row.original.blurb;
        },
        meta: {
          className: 'min-w-[300px]',
          cellClassName: 'text-gray-800 font-normal'
        }
      },
      {
        id: 'edit',
        header: () => '',
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
      },
      {
        id: 'delete',
        header: () => '',
        enableSorting: false,
        cell: () => {
          return (
            <button className="btn btn-sm btn-icon btn-clear btn-light">
              <KeenIcon icon="trash" />
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

          <div className="flex flex-wrap gap-2.5">
            <select className="select select-sm w-28">
              <option value="1">Active</option>
              <option value="2">Disabled</option>
              <option value="2">Pending</option>
            </select>

            <select className="select select-sm w-28">
              <option value="1">Latest</option>
              <option value="2">Older</option>
              <option value="3">Oldest</option>
            </select>

            <button className="btn btn-sm btn-outline btn-primary">
              <KeenIcon icon="setting-4" /> Filters
            </button>
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
    </div>
  );
};

export { TokenProjects };
