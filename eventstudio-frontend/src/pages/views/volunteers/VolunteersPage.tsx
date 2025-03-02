import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { VolunteersContent } from '@/pages/views/volunteers/VolunteersContent.tsx';
import { VolunteerRequestsProvider } from '@/pages/views/volunteers/VolunteerContext.tsx';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const VolunteersPage = () => {
  const { currentLayout } = useLayout();

  return (
    <VolunteerRequestsProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Volunteers'} />
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <VolunteersContent />
        </Container>
      </Fragment>
    </VolunteerRequestsProvider>
  );
};

export { VolunteersPage };
