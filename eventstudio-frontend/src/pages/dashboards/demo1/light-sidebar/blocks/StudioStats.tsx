import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useDashboard } from '@/pages/dashboards/demo1/light-sidebar/DashboardContext.tsx';

interface IStudioStatsItem {
  logo: string;
  logoDark?: string;
  info: string;
  desc: string;
  path: string;
}
interface IStudioStatsItems extends Array<IStudioStatsItem> {}

const StudioStats = () => {
  const { dashboardStatus, loading } = useDashboard();

  // Map the dashboardStatus data to the items array
  const items: IStudioStatsItems = [
    {
      logo: 'event.png',
      info: dashboardStatus ? `${dashboardStatus.totalEvents}` : '0',
      desc: 'Events',
      path: ''
    },
    {
      logo: 'volunteer.png',
      info: dashboardStatus ? `${dashboardStatus.totalVolunteers}` : '0',
      desc: 'Recent Volunteers',
      path: ''
    },
    {
      logo: 'sponsor.png',
      info: dashboardStatus ? `${dashboardStatus.totalSponsors}` : '0',
      desc: 'Sponsors',
      path: ''
    },
    {
      logo: 'speaker.png',
      info: dashboardStatus ? `${dashboardStatus.speakerOnboards}` : '0',
      desc: 'Total Speakers Onboarded',
      path: ''
    }
  ];

  const renderItem = (item: IStudioStatsItem, index: number) => {
    return (
      <div
        key={index}
        className="card flex-col justify-between gap-6 h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg"
      >
        {item.logo && (
          <>
            <img
              src={toAbsoluteUrl(`/media/coloured-icons/${item.logo}`)}
              className=" w-7 mt-4 ms-5"
              alt=""
            />
          </>
        )}

        <div className="flex flex-col gap-1 pb-4 px-5">
          <span className="text-3xl font-semibold text-gray-900">{item.info}</span>
          <span className="text-2sm font-normal text-gray-700">{item.desc}</span>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>

      {items.map((item, index) => {
        return renderItem(item, index);
      })}
    </Fragment>
  );
};

export { StudioStats, type IStudioStatsItem, type IStudioStatsItems };
