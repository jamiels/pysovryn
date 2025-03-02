import { Fragment } from 'react';
import { Container } from '@/components/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle
} from '@/partials/toolbar';

import { AccountUserProfileContent } from '.';
import { useLayout } from '@/providers';
import { PageNavbar } from '@/pages/account/PageNavBar.tsx';

const AccountUserProfilePage = () => {
  const { currentLayout } = useLayout();

  return (
    <Fragment>
      <PageNavbar />
      {currentLayout?.name === 'demo1-layout' && (
        <Container className={'p-4'}>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle text={'User Profile'} />
              <ToolbarDescription>Central Hub for Personal Customization</ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
          <Container>
            <AccountUserProfileContent />
          </Container>
        </Container>
      )}
    </Fragment>
  );
};

export { AccountUserProfilePage };
