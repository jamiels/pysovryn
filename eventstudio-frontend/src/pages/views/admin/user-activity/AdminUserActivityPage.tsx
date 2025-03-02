import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { BreadCrumb } from '@/components/BreadCrumb.tsx';

import { UserActivityContent } from '@/pages/views/admin/user-activity/UserActivityContent.tsx';
import { AdminUserLogProvider } from '@/pages/views/admin/user-activity/user-table/UserLogContext.tsx';

const AdminUserActivityPage = () => {
  const { currentLayout } = useLayout();

  return (
    <AdminUserLogProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'User Activity Log'} />
                <BreadCrumb />
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <UserActivityContent />
        </Container>
      </Fragment>
    </AdminUserLogProvider>
  );
};

export { AdminUserActivityPage };
