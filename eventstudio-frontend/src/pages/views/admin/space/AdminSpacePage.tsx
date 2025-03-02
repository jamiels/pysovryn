import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { BreadCrumb } from '@/components/BreadCrumb.tsx';
import { AdminEventProvider } from '@/pages/views/admin/event/events-table/EventContext.tsx';
import { AdminSpaceContent } from '@/pages/views/admin/space/SpaceContent.tsx';
import { AdminSpaceProvider } from '@/pages/views/admin/space/space-table/SpaceContext.tsx';

const AdminSpacePage = () => {
  const { currentLayout } = useLayout();

  return (
    <AdminSpaceProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Spaces'} />
                <BreadCrumb />
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <AdminSpaceContent />
        </Container>
      </Fragment>
    </AdminSpaceProvider>
  );
};

export { AdminSpacePage };
