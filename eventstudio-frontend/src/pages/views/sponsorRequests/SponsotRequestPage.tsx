import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { SponsorRequestContent } from '@/pages/views/sponsorRequests/SponsorRequestContent.tsx';
import { SponsorRequestsProvider } from '@/pages/views/sponsorRequests/SponsorRequestContext.tsx';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const SponsorRequestPage = () => {
  const { currentLayout } = useLayout();

  return (
    <SponsorRequestsProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Sponsor Requests'} />
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <SponsorRequestContent />
        </Container>
      </Fragment>
    </SponsorRequestsProvider>
  );
};

export { SponsorRequestPage };
