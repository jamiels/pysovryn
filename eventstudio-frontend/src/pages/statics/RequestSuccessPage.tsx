import React, { Fragment } from 'react';
import { toAbsoluteUrl } from '@/utils';

export const RequestSuccessPage = () => {
  return (
    <Fragment>
      {/*      <style>
        {`
          .page-bg {
            background-image: url('${toAbsoluteUrl('/media/auth_bg.jpg')}');
          }
          .dark .page-bg {
            background-image: url('${toAbsoluteUrl('/media/auth_bg.jpg')}');
          }
        `}
      </style>*/}
      <div
        className={
          'flex bg-cover bg-no-repeat page-bg grow items-center justify-center w-full p-2 h-full py-[3%]'
        }
      >
        {/* card */}
        <div
          className={
            'card h-full min-w-[95%] lg:min-w-[50%] md:min-w-[50%] flex justify-center p-10'
          }
        >
          <div className={'flex flex-col space-y-2 items-center justify-center mb-5'}>
            <img
              src={toAbsoluteUrl('/media/app/event_logo.png')}
              alt="logo"
              className="default-logo w-48"
            />
            <div className={'items-center flex flex-col '}>
              <p className={'text-lg font-bold text-gray-900'}>Your Request Has Been Sent</p>
              <p className={'text-sm  text-gray-900'}>Thank you for reaching out with us!</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
