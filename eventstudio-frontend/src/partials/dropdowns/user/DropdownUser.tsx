import { ChangeEvent, Fragment } from 'react';

import { FormattedMessage } from 'react-intl';
import { getAuth, useAuthContext } from '@/auth';

import { useSettings } from '@/providers/SettingsProvider';
import { KeenIcon } from '@/components';
import { MenuItem, MenuLink, MenuSub, MenuTitle, MenuSeparator, MenuIcon } from '@/components/menu';

const DropdownUser = () => {
  const { settings, storeSettings } = useSettings();
  const { logout } = useAuthContext();

  const currentUser = getAuth()?.user;

  const handleThemeMode = (event: ChangeEvent<HTMLInputElement>) => {
    const newThemeMode = event.target.checked ? 'dark' : 'light';

    storeSettings({
      themeMode: newThemeMode
    });
  };

  const buildHeader = () => {
    return (
      <div className="flex flex-col items-center justify-between py-1.5 ">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-gray-800 hover:text-primary font-semibold leading-none">
              {currentUser?.name}
            </p>
            <p className="text-xs text-gray-600 hover:text-primary font-medium leading-none">
              {currentUser?.email}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
          <MenuItem>
            <MenuLink path="/account/home/user-profile">
              <MenuIcon>
                <KeenIcon icon="profile-circle" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_PROFILE" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>

          <MenuItem>
            <MenuLink path="/spaces">
              <MenuIcon>
                <KeenIcon icon="abstract-26" />
              </MenuIcon>
              <MenuTitle>
                <p>Spaces</p>
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuSeparator />
        </div>
      </Fragment>
    );
  };

  const buildFooter = () => {
    return (
      <div className="flex flex-col">
        <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">
              <FormattedMessage id="USER.MENU.DARK_MODE" />
            </span>
            <label className="switch switch-sm">
              <input
                name="theme"
                type="checkbox"
                checked={settings.themeMode === 'dark'}
                onChange={handleThemeMode}
                value="1"
              />
            </label>
          </div>
        </div>

        <div className="menu-item px-4 py-1.5">
          <a onClick={logout} className="btn btn-sm btn-light justify-center hover:btn-danger">
            <FormattedMessage id="USER.MENU.LOGOUT" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>
  );
};

export { DropdownUser };
