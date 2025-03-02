import React, { forwardRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useDemo1Layout } from '../';
import { toAbsoluteUrl } from '@/utils';
import { SidebarToggle } from './';

const SidebarHeader = forwardRef<HTMLDivElement, any>((props, ref) => {
  const { layout } = useDemo1Layout();

  const lightLogo = () => (
    <Fragment>
      <Link to="/" className="dark:hidden">
        <img
          alt={'app-logo'}
          src={toAbsoluteUrl('/media/app/event_logo.png')}
          className="default-logo h-10 max-w-none"
        />
        <img
          alt={'app-logo'}
          src={toAbsoluteUrl('/media/app/event_logo.png')}
          className="small-logo  max-w-10"
        />
      </Link>
      <Link to="/" className="hidden dark:block">
        <img
          alt={'app-logo'}
          src={toAbsoluteUrl('/media/app/eventstudiodarkmode.svg')}
          className="default-logo h-10 max-w-none"
        />
        <img
          alt={'app-logo'}
          src={toAbsoluteUrl('/media/app/eventstudiodarkmode.svg')}
          className="small-logo  max-w-10"
        />
      </Link>
    </Fragment>
  );

  const darkLogo = () => (
    <Link to="/">
      <img
        alt={'app-logo'}
        src={toAbsoluteUrl('/media/app/default-logo-dark.svg')}
        className="default-logo min-h-[22px] max-w-none"
      />
      <img
        alt={'app-logo'}
        src={toAbsoluteUrl('/media/app/mini-logo.svg')}
        className="small-logo min-h-[22px] max-w-none"
      />
    </Link>
  );

  return (
    <div
      ref={ref}
      className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0"
    >
      {layout.options.sidebar.theme === 'light' ? lightLogo() : darkLogo()}
      <SidebarToggle />
    </div>
  );
});

export { SidebarHeader };
