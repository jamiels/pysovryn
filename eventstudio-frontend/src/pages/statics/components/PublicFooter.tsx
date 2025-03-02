import { generalSettings } from '@/config';

export const PublicFooter = () => {
  return (
    <div className={'my-2 pb-4'}>
      <p className={'text-xs text-black'}>
        Powered By{' '}
        <a href={generalSettings.frontendURL} target="_blank" rel="noopener noreferrer">
          <strong>Event Studio</strong>
        </a>
      </p>
    </div>
  );
};
