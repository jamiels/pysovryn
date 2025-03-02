import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { OrganizationsContent } from '@/pages/views/organizations/OrganizationsContent.tsx';
import { OrganizationProvider } from '@/pages/views/organizations/OrganizationContext.tsx';
import { ToolbarActions } from '@/layouts/demo1/toolbar';
import { AddOrganizationDialog } from '@/pages/views/organizations/AddOrganization.tsx';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const OrganizationPage = () => {
  const { currentLayout } = useLayout();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <OrganizationProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Organizations'} />
                <BreadCrumb />
              </ToolbarHeading>
              <ToolbarActions>
                <button className="btn btn-sm btn-primary" onClick={() => handleOpenDialog()}>
                  Add Organization
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}

        <Container>
          <OrganizationsContent />
        </Container>
      </Fragment>
      <AddOrganizationDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </OrganizationProvider>
  );
};

export { OrganizationPage };
