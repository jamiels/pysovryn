import { Link, Outlet } from 'react-router-dom';
import React, { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils';
import useBodyClasses from '@/hooks/useBodyClasses';
import { AuthBrandedLayoutProvider } from './AuthBrandedLayoutProvider';

const Layout = () => {
  // Applying body classes to manage the background color in dark mode
  useBodyClasses('dark:bg-coal-500');
  const darkMode = document.body.classList.contains('dark');

  return (
    <Fragment>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/app/splash-img.png')}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl('/media/app/splash-img.png')}');
          }
        `}
      </style>

      <div className="grid lg:grid-cols-2 grow">
        <div className="lg:rounded-xl lg:border lg:border-gray-200 lg:m-5 order-1 items-center justify-center flex  xxl:bg-center xl:bg-cover bg-no-repeat branded-bg">
          {/*<img*/}
          {/*  alt={'app-logo'}*/}
          {/*  src={toAbsoluteUrl(*/}
          {/*    darkMode ? '/media/app/eventstudiodarkmode.svg' : '/media/app/event_logo.png'*/}
          {/*  )}*/}
          {/*  className="default-logo h-16 max-w-none"*/}
          {/*/>*/}
        </div>
        <div className="flex justify-center items-center p-8 lg:p-10 order-2 lg:order-1 ">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

// AuthBrandedLayout component that wraps the Layout component with AuthBrandedLayoutProvider
const AuthBrandedLayout = () => (
  <AuthBrandedLayoutProvider>
    <Layout />
  </AuthBrandedLayoutProvider>
);

export { AuthBrandedLayout };
