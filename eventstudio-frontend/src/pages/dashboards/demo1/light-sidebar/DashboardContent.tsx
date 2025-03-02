import { StudioStats, UpcomingEventsTable } from './blocks';

const DashboardContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 lg:gap-7.5 h-full items-stretch">
            <StudioStats />
          </div>
        </div>
      </div>

      <div className="">
        {/*grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch*/}
        {/*  <div className="lg:col-span-1">
          <Highlights limit={3} />
        </div>*/}
        <div className="lg:col-span-2 ">
          <UpcomingEventsTable />
          {/*<div className={'mt-2'}>
            <InactiveEventsTable />
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export { DashboardContent };
