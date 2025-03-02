import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { OnboardRequestContent } from '@/pages/views/OnboardRequests/OnboardRequestContent.tsx';
import { OnboardRequestsProvider } from '@/pages/views/OnboardRequests/OnboardRequestContext.tsx';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const OnboardRequestPage = () => {
  const { currentLayout } = useLayout();

  return (
    <OnboardRequestsProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Onboard Requests'} />
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <OnboardRequestContent />
        </Container>
      </Fragment>
    </OnboardRequestsProvider>
  );
};

export { OnboardRequestPage };
