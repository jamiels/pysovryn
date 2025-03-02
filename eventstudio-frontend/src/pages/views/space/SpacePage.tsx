import React, { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { ToolbarActions } from '@/layouts/demo1/toolbar';

import { AddSpaceDialog } from '@/pages/views/space/AddSpaceDialog.tsx';
import { SpaceContent } from '@/pages/views/space/SpaceContent.tsx';
import { BreadCrumb } from '@/components/BreadCrumb.tsx';

const SpacePage = () => {
  const { currentLayout } = useLayout();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Spaces'} />
                <ToolbarDescription>
                  <BreadCrumb />
                </ToolbarDescription>
              </ToolbarHeading>
              <ToolbarActions>
                <button className="btn btn-sm btn-primary" onClick={() => handleOpenDialog()}>
                  Add Space
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}

        <Container>
          <SpaceContent />
        </Container>
      </Fragment>
      <AddSpaceDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export { SpacePage };
