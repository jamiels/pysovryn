import { Fragment, useState } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';
import { useLayout } from '@/providers';

import { ProducerContent } from '@/pages/views/producers/ProducerContent.tsx';
import { ProducerProvider } from '@/pages/views/producers/ProducerContext.tsx';
import { AddProducerDialog } from '@/pages/views/producers/AddProducerDialog.tsx';
import { KeenIcon } from '@/components';

const ProducerPage = () => {
  const { currentLayout } = useLayout();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);

  return (
    <ProducerProvider>
      <Fragment>
        {currentLayout?.name === 'demo1-layout' && (
          <Container>
            <Toolbar>
              <ToolbarHeading>
                <ToolbarPageTitle text={'Producers'} />
              </ToolbarHeading>
              <ToolbarActions>
                <button className="btn btn-sm btn-primary" onClick={handleOpenDialog}>
                  New Producer
                </button>
              </ToolbarActions>
            </Toolbar>
          </Container>
        )}

        <Container>
          <ProducerContent />
        </Container>
      </Fragment>
      <AddProducerDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </ProducerProvider>
  );
};

export { ProducerPage };
