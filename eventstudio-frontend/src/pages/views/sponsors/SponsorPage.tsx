import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';
import { SponsorContent } from '@/pages/views/sponsors/SponsorContent.tsx';
import { SponsorProvider } from '@/pages/views/sponsors/SponsorContext.tsx';
import { ToolbarActions } from '@/layouts/demo1/toolbar';
import { AddSponsorDialog } from '@/pages/views/sponsors/AddSponsorDialog.tsx';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const SponsorPage = () => {
  const { currentLayout } = useLayout();
  const [isAddSponsorDialogOpen, setIsAddSponsorDialogOpen] = useState<boolean>(false);

  const handleAddSponsorDialogOpen = () => {
    setIsAddSponsorDialogOpen(true);
  };

  const handleAddSponsorDialogClose = () => {
    setIsAddSponsorDialogOpen(false);
  };

  return (
    <SponsorProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Sponsorships'} />
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </ToolbarHeading>
              <ToolbarActions>
                <button
                  className={'btn btn-primary btn-sm'}
                  onClick={() => handleAddSponsorDialogOpen()}
                >
                  Add Sponsorship
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}
        <Container>
          <SponsorContent />
        </Container>
      </Fragment>
      <AddSponsorDialog onClose={handleAddSponsorDialogClose} isOpen={isAddSponsorDialogOpen} />
    </SponsorProvider>
  );
};

export { SponsorPage };
