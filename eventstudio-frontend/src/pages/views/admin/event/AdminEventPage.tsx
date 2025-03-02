import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { BreadCrumb } from '@/components/BreadCrumb.tsx';
import { AdminEventProvider } from '@/pages/views/admin/event/events-table/EventContext.tsx';
import { AdminEventContent } from '@/pages/views/admin/event/EventContent.tsx';

const AdminEventPage = () => {
  const { currentLayout } = useLayout();

  return (
    <AdminEventProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Events'} />
                <BreadCrumb />
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <AdminEventContent />
        </Container>
      </Fragment>
    </AdminEventProvider>
  );
};

export { AdminEventPage };
