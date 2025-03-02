import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { useLanguage } from '@/i18n';
import { DropdownCard1 } from '@/partials/dropdowns/general';
import { useDashboard } from '@/pages/dashboards/demo1/light-sidebar/DashboardContext.tsx';

interface IHighlightsRow {
  icon: string;
  text: string;
  total: number;
  stats: number;
  increase: boolean;
}
interface IHighlightsRows extends Array<IHighlightsRow> {}

interface IHighlightsItem {
  badgeColor: string;
  lebel: string;
}
interface IHighlightsItems extends Array<IHighlightsItem> {}

interface IHighlightsProps {
  limit?: number;
}

const Highlights = ({ limit }: IHighlightsProps) => {
  const { isRTL } = useLanguage();
  const { dashboardStatus, loading } = useDashboard();

  const calculateStats = (recent: number, total: number) => {
    if (!total || !recent) return 0;
    return Number(((recent / total) * 100).toFixed(1));
  };

  const rows: IHighlightsRows = [
    {
      icon: 'calendar',
      text: 'Total Events',
      total: dashboardStatus?.totalEvents || 0,
      stats: 0,
      increase: false
    },
    {
      icon: 'users',
      text: 'Space Users',
      total: dashboardStatus?.totalSpaceUsers || 0,
      stats: 0,
      increase: false
    },
    {
      icon: 'emoji-happy',
      text: 'Volunteers',
      total: dashboardStatus?.totalVolunteers || 0,
      stats: calculateStats(
        dashboardStatus?.totalRecentVolunteers || 0,
        dashboardStatus?.totalVolunteers || 1
      ),
      increase: (dashboardStatus?.totalRecentVolunteers || 0) > 0
    },
    {
      icon: 'dollar',
      text: 'Sponsors',
      total: dashboardStatus?.totalSponsors || 0,
      stats: calculateStats(
        dashboardStatus?.totalRecentSponsors || 0,
        dashboardStatus?.totalSponsors || 1
      ),
      increase: (dashboardStatus?.totalRecentSponsors || 0) > 0
    },
    {
      icon: 'abstract-39',
      text: 'Speaker Onboards',
      total: dashboardStatus?.speakerOnboards || 0,
      stats: calculateStats(
        dashboardStatus?.speakerRecentOnboards || 0,
        dashboardStatus?.speakerOnboards || 1
      ),
      increase: (dashboardStatus?.speakerRecentOnboards || 0) > 0
    }
  ];

  const items: IHighlightsItems = [
    { badgeColor: 'badge-success', lebel: 'Volunteers' },
    { badgeColor: 'badge-danger', lebel: 'Sponsors' },
    { badgeColor: 'badge-info', lebel: 'Speakers' }
  ];

  const renderRow = (row: IHighlightsRow, index: number) => {
    return (
      <div key={index} className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <KeenIcon icon={row.icon} className="text-base text-gray-500" />
          <span className="text-sm font-normal text-gray-900">{row.text}</span>
        </div>

        <div className="flex items-center text-sm font-medium text-gray-800 gap-6">
          <span className="lg:text-right">{row.total}</span>
          <span className="lg:text-right">
            {row.increase ? (
              <KeenIcon icon="arrow-up" className="text-success" />
            ) : (
              <KeenIcon icon="arrow-down" className="text-danger" />
            )}
            &nbsp;{row.stats}%
          </span>
        </div>
      </div>
    );
  };

  const renderItem = (item: IHighlightsItem, index: number) => {
    return (
      <div key={index} className="flex items-center gap-1.5">
        <span className={`badge badge-dot size-2 ${item.badgeColor}`}></span>
        <span className="text-sm font-normal text-gray-800">{item.lebel}</span>
      </div>
    );
  };

  return (
    <div className="card h-full">
      <div className="card-header">
        <h3 className="card-title">Community Overview</h3>

        <Menu>
          <MenuItem
            toggle="dropdown"
            trigger="click"
            dropdownProps={{
              placement: isRTL() ? 'bottom-start' : 'bottom-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: isRTL() ? [0, -10] : [0, 10]
                  }
                }
              ]
            }}
          >
            <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
              <KeenIcon icon="dots-vertical" />
            </MenuToggle>
            {DropdownCard1()}
          </MenuItem>
        </Menu>
      </div>

      <div className="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-normal text-gray-700">Active Contributors</span>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl font-semibold text-gray-900">
              {dashboardStatus?.totalSpaceUsers || 0}
            </span>
            <span className="badge badge-outline badge-success badge-sm">
              +{dashboardStatus?.totalRecentVolunteers || 0}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-1.5">
          <div className="bg-success h-2 w-full max-w-[60%] rounded-sm"></div>
          <div className="bg-brand h-2 w-full max-w-[25%] rounded-sm"></div>
          <div className="bg-info h-2 w-full max-w-[15%] rounded-sm"></div>
        </div>

        <div className="flex items-center flex-wrap gap-4 mb-1">
          {items.map((item, index) => renderItem(item, index))}
        </div>

        <div className="border-b border-gray-300"></div>

        <div className="grid gap-3">
          {rows.slice(0, limit).map((row, index) => renderRow(row, index))}
        </div>
      </div>
    </div>
  );
};

export {
  Highlights,
  type IHighlightsRow,
  type IHighlightsRows,
  type IHighlightsItem,
  type IHighlightsItems,
  type IHighlightsProps
};
