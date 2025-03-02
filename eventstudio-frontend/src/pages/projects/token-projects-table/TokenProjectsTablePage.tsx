import { Fragment, useContext, useState } from 'react';

import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { TokenProjectsTableContent } from '.';
import { useLayout } from '@/providers';
import { AddProjectModal } from './blocks/Modal';
import { TokenProjectsContext } from '../providers';

const TokenProjectsTablePage = () => {
  const { currentLayout } = useLayout();
  const { tokenProjectListCount } = useContext(TokenProjectsContext);

  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const handleAddProjectModalClose = () => {
    setAddProjectModalOpen(false);
  };

  return (
    <Fragment>
      {currentLayout?.name === 'demo1-layout' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={'Active Projects'} />
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-700">Total Projects:</span>
                  <span className="text-md text-gray-800 font-medium me-2">
                    {tokenProjectListCount}
                  </span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <button className="btn btn-sm btn-light">Contact Project</button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setAddProjectModalOpen(true)}
              >
                Add Project
              </button>
            </ToolbarActions>
          </Toolbar>
        </Container>
      )}

      <Container>
        <TokenProjectsTableContent />
      </Container>

      <Container>
        <AddProjectModal open={addProjectModalOpen} onClose={handleAddProjectModalClose} />
      </Container>
    </Fragment>
  );
};

export { TokenProjectsTablePage };
