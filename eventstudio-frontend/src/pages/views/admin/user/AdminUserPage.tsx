import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { BreadCrumb } from '@/components/BreadCrumb.tsx';

import { AdminUserContent } from '@/pages/views/admin/user/UserContent.tsx';
import { AdminUserProvider } from '@/pages/views/admin/user/user-table/UserContext.tsx';

const AdminUserPage = () => {
  const { currentLayout } = useLayout();

  return (
    <AdminUserProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Users'} />
                <BreadCrumb />
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <AdminUserContent />
        </Container>
      </Fragment>
    </AdminUserProvider>
  );
};

export { AdminUserPage };
