import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { DashboardContent } from '.';

import {
  DashboardProvider,
  useDashboard
} from '@/pages/dashboards/demo1/light-sidebar/DashboardContext.tsx';
import { formatIsoDate } from '@/utils/Date.ts';

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardComponents />
    </DashboardProvider>
  );
};

const DashboardComponents = () => {
  // const { loading, dashboardStatus } = useDashboard();

  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title="Dashboard" description="Event Studio Overview" />
          {/*{!loading && dashboardStatus.lastUpdated ? (*/}
          {/*  <p className={'text-xs'}>Last Updated: {formatIsoDate(dashboardStatus.lastUpdated)}</p>*/}
          {/*) : (*/}
          {/*  <div className={'text-xs'}>Loading...</div>*/}
          {/*)}*/}
        </Toolbar>
      </Container>
      <Container>
        <DashboardContent />
      </Container>
    </Fragment>
  );
};

export { Dashboard };
