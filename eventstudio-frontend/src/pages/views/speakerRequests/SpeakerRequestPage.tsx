import { Fragment } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { SpeakerRequestsProvider } from '@/pages/views/speakerRequests/SpeakerRequestContext.tsx';
import { SpeakerRequestContent } from '@/pages/views/speakerRequests/SpeakerRequestContent.tsx';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const SpeakerRequestPage = () => {
  const { currentLayout } = useLayout();

  return (
    <SpeakerRequestsProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Speaker Requests'} />
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </ToolbarHeading>
            </Toolbar>
          </Container>
        )}

        <Container>
          <SpeakerRequestContent />
        </Container>
      </Fragment>
    </SpeakerRequestsProvider>
  );
};

export { SpeakerRequestPage };
