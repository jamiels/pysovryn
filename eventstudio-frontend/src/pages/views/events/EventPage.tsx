import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { EventContent } from '@/pages/views/events/EventContent.tsx';
import { ToolbarActions } from '@/layouts/demo1/toolbar';

import { AddEventDialog } from './AddEventDialog';
import { EventProvider } from '@/pages/views/events/EventContext.tsx';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const EventPage = () => {
  const { currentLayout } = useLayout();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <EventProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Events'} />
                <BreadCrumb />
              </ToolbarHeading>
              <ToolbarActions>
                <button className="btn btn-sm btn-primary" onClick={handleOpenDialog}>
                  Add Event
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}

        <Container>
          <EventContent />
        </Container>
        <AddEventDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
      </Fragment>
    </EventProvider>
  );
};

export { EventPage };
