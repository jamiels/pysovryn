import React, { useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import { DataGrid, TDataGridRequestParams, KeenIcon, TDataGridSelectedRowIds } from '@/components';
import { CommonRating } from '@/partials/common';
import { Team, QueryApiResponse } from './teams-types';
import axios from 'axios';
import { formatIsoDate } from '@/utils/Date';
import { TeamUsers } from './TeamUsers';

type TeamsQueryApiResponse = QueryApiResponse<Team>;

export type Project = {
  id: number;
  name: string;
  description: string;
  launch_at: string; // Using ISO date string format for simplicity
};

const projects: Project[] = [
  {
    id: 1,
    name: 'Apollo Missions',
    description: 'Lunar exploration program',
    launch_at: '1969-07-16T13:32:00Z'
  },
  {
    id: 2,
    name: 'Voyager Program',
    description: 'Space program',
    launch_at: '1977-09-05T12:56:00Z'
  },
  {
    id: 3,
    name: 'Curiosity Rover',
    description: 'Mars rover mission',
    launch_at: '2011-11-26T15:02:00Z'
  },
  {
    id: 4,
    name: 'James Webb Telescope',
    description: 'Next-generation space telescope',
    launch_at: '2021-12-25T12:20:00Z'
  },
  {
    id: 5,
    name: 'Hubble Telescope',
    description: 'Space telescope',
    launch_at: '1990-04-24T12:33:00Z'
  }
];

const Teams = () => {
  const { enqueueSnackbar } = useSnackbar();

  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        accessorFn: (row) => row.name,
        id: 'project',
        header: () => 'Project Name',
        enableSorting: true,
        cell: (info) => (
          <div className="flex flex-col gap-2">
            <Link
              className="leading-none font-medium text-sm text-gray-900 hover:text-primary"
              to="#"
            >
              {info.row.original.name}
            </Link>
            <span className="text-2sm text-gray-700 font-normal leading-3">
              {info.row.original.description}
            </span>
          </div>
        ),
        meta: {
          className: 'min-w-[200px]'
        }
      },
      {
        accessorFn: (row) => row.launch_at,
        id: 'launch_at',
        enableSorting: true,
        header: () => 'Project Token Launch',
        cell: (info) => formatIsoDate(info.row.original.launch_at),
        meta: {
          className: 'w-[400px]'
        }
      }
    ],
    []
  );

  const [searchQuery, setSearchQuery] = useState('');

  const fetchTeams = async (params: TDataGridRequestParams) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.set('page', String(params.pageIndex + 1)); // Page is 1-indexed on server
      queryParams.set('items_per_page', String(params.pageSize));

      if (params.sorting?.[0]?.id) {
        queryParams.set('sort', params.sorting[0].id);
        queryParams.set('order', params.sorting[0].desc ? 'desc' : 'asc');
      }

      if (searchQuery.length > 2) {
        queryParams.set('query', searchQuery);
      }

      // const response = await axios.get<TeamsQueryApiResponse>(
      //   `${import.meta.env.VITE_APP_API_URL}/teams/query?${queryParams.toString()}`
      // );

      return {
        data: projects, // Server response data
        totalCount: projects.length // Total count for pagination
      };
    } catch (error) {
      console.error('Failed to fetch data:', error);
      enqueueSnackbar('An error occurred while fetching data. Please try again later', {
        variant: 'solid',
        state: 'danger'
      });

      return {
        data: [],
        totalCount: 0
      };
    }
  };

  const handleRowsSelectChange = (selectedRowIds: TDataGridSelectedRowIds) => {
    enqueueSnackbar(
      selectedRowIds.size > 0 ? `${selectedRowIds.size} rows selected` : 'No rows are selected',
      {
        variant: 'solid',
        state: 'dark'
      }
    );
  };

  return (
    <div className="grid">
      <div className="card card-grid h-full min-w-full">
        <div className="card-header">
          <h3 className="card-title">Upcoming TGEs</h3>
          <div className="input input-sm max-w-48">
            <KeenIcon icon="magnifier" />
            <input
              type="text"
              placeholder="Search Teams"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="card-body">
          <DataGrid
            layout={{ cellsBorder: true }}
            columns={columns}
            serverSide={true}
            onFetchData={fetchTeams}
            rowSelect={true}
            pagination={{ size: 5 }}
            sorting={[{ id: 'name', desc: false }]}
            onRowsSelectChange={handleRowsSelectChange}
          />
        </div>
      </div>
    </div>
  );
};

export { Teams };
