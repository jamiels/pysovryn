import { useRef } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';

import { useLanguage } from '@/i18n';
import { DropdownSpace } from '@/partials/dropdowns/active-space';
import { useSpace } from '@/contexts/SpaceContext.tsx';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

const HeaderTopbar = () => {
  const { isRTL } = useLanguage();

  const { activeSpace } = useSpace();
  const { auth } = useAuth();

  const itemUserRef = useRef<any>(null);
  const itemNotificationsRef = useRef<any>(null);

  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      {/* <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [70, 10] : [-70, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-on" />
          </MenuToggle>
          {DropdownNotifications({ menuTtemRef: itemNotificationsRef })}
        </MenuItem>
      </Menu>*/}
      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [70, 10] : [-70, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="text-sm gap-2 font-semibold">
            <p className={'text-primary '}>
              {activeSpace?.spaceName ? activeSpace.spaceName : 'loading...'}
            </p>
            <KeenIcon icon="down" />
          </MenuToggle>
          {DropdownSpace()}
        </MenuItem>
      </Menu>

      {/* User Drop Down */}
      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              src={
                auth?.user.profileImageURL
                  ? auth.user.profileImageURL
                  : toAbsoluteUrl('/media/avatars/default-user.jpg')
              }
              alt=""
            />
          </MenuToggle>
          {DropdownUser()}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };
