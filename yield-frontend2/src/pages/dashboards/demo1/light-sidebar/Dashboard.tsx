import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';

import { DashboardContent } from '.';

const Dashboard = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title="Dashboard" description="Yield Overview" />
          <ToolbarActions>
            <Link to="#" className="btn btn-sm btn-light">
              View Profile
            </Link>
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        <DashboardContent />
      </Container>
    </Fragment>
  );
};

export { Dashboard };
