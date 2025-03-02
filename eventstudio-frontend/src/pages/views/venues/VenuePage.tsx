import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { VenueContent } from '@/pages/views/venues/VenueContent.tsx';
import { VenueProvider } from '@/pages/views/venues/VenueContext.tsx';
import { AddVenueDialog } from '@/pages/views/venues/AddVenueDialog.tsx';
import { ToolbarActions } from '@/layouts/demo1/toolbar';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const VenuePage = () => {
  const { currentLayout } = useLayout();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <VenueProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Venues'} />
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </ToolbarHeading>
              <ToolbarActions>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleOpenDialog} // Open dialog on click
                >
                  Add Venue
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}

        <Container>
          <VenueContent />
        </Container>
      </Fragment>

      <AddVenueDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </VenueProvider>
  );
};

export { VenuePage };
