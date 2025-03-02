import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { SpeakersContent } from '@/pages/views/speakers/SpeakersContent.tsx';
import { SpeakerProvider } from '@/pages/views/speakers/SpeakerContext.tsx';
import { AddSpeakerDialog } from '@/pages/views/speakers/AddSpeakerDialog.tsx';
import { ToolbarActions } from '@/layouts/demo1/toolbar';
import { KeenIcon } from '@/components';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const SpeakersPage = () => {
  const { currentLayout } = useLayout();

  const [isAddSpeakerDialogOpen, setIsAddSpeakerDialogOpen] = useState(false);

  const openAddSpeakerDialog = () => setIsAddSpeakerDialogOpen(true);
  const closeAddSpeakerDialog = () => setIsAddSpeakerDialogOpen(false);

  return (
    <SpeakerProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <div className={'flex flex-col gap-2'}>
                <ToolbarHeading>
                  <ToolbarPageTitle text={'Speakers'} />
                </ToolbarHeading>
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </div>
              <ToolbarActions>
                <button className={'btn btn-primary btn-sm'} onClick={openAddSpeakerDialog}>
                  Add Speaker
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}

        <Container>
          <SpeakersContent />
        </Container>
      </Fragment>
      <AddSpeakerDialog isOpen={isAddSpeakerDialogOpen} onClose={closeAddSpeakerDialog} />
    </SpeakerProvider>
  );
};

export { SpeakersPage };
