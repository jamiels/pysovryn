import { Fragment, useContext } from 'react';

import { Container } from '@/components/container';
import { Toolbar, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/partials/toolbar';

import { TokenProjectsContent } from '.';
import { useLayout } from '@/providers';
import { AdminContext } from '../providers';

const TokenProjectsPage = () => {
  const { currentLayout } = useLayout();
  const { tokenProjectListCount } = useContext(AdminContext);

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
          </Toolbar>
        </Container>
      )}

      <Container>
        <TokenProjectsContent />
      </Container>
    </Fragment>
  );
};

export { TokenProjectsPage };
