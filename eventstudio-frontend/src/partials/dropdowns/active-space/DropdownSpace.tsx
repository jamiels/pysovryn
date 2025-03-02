import { Fragment } from 'react';

import { MenuItem, MenuLink, MenuSub, MenuTitle, MenuSeparator } from '@/components/menu';
import { useSpace } from '@/contexts/SpaceContext.tsx';

const DropdownSpace = () => {
  const { availableSpaces, activeSpace, handleSetActiveSpace } = useSpace();
  const buildHeader = () => {
    return (
      <div className="flex flex-col items-center justify-between py-1.5 ">
        <div className="flex items-center gap-2">
          <p className={'text-sm font-semibold'}> Spaces Available</p>
        </div>
      </div>
    );
  };

  const buildMenu = () => {
    return (
      <Fragment>
        <MenuSeparator />
        <div className="flex flex-col">
          {availableSpaces.map((space) => (
            <MenuItem key={space.id} onClick={() => handleSetActiveSpace(space.id)}>
              <MenuLink>
                <MenuTitle className={'flex flex-row justify-between'}>
                  {space.spaceName}
                  {activeSpace?.id === space.id && (
                    <span className="badge badge-xs badge-primary ">Active</span>
                  )}
                </MenuTitle>
              </MenuLink>
            </MenuItem>
          ))}
        </div>
      </Fragment>
    );
  };

  return (
    <MenuSub
      className="menu-default light:border-gray-300 w-[200px] md:w-[250px]"
      rootClassName="p-0"
    >
      {buildHeader()}
      {buildMenu()}
    </MenuSub>
  );
};

export { DropdownSpace };
