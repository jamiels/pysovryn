import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { toAbsoluteUrl } from '@/utils';

import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/auth';

const CheckEmail = () => {
  const hasRenderedOnce = useRef(false);
  const { currentUser, requestEmailLink, verifyEmailLink } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { uuid } = useParams();

  const [title, setTitle] = useState('Check your email');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasRenderedOnce.current) {
      hasRenderedOnce.current = true;

      if (uuid) {
        setTitle('Verifying Email');
        verifyEmail();
      } else {
        requestEmail();
      }
    }
  }, []);

  const requestEmail = async () => {
    if (currentUser?.email) {
      try {
        await requestEmailLink(currentUser?.email);
      } catch (error: any) {
        console.log(error);
      }
    } else {
      navigate(from, { replace: true });
    }
  };

  const verifyEmail = async () => {
    if (uuid) {
      try {
        await verifyEmailLink(uuid);
        setLoading(false);
        setTitle('Email Verified Successfully');
      } catch (error: any) {
        setLoading(false);
        setTitle(error?.message);
      }
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="card max-w-[440px] w-full">
      <div className="card-body p-10">
        <div className="flex justify-center py-10">
          <img
            src={toAbsoluteUrl('/media/illustrations/30.svg')}
            className="dark:hidden max-h-[130px]"
            alt=""
          />
          <img
            src={toAbsoluteUrl('/media/illustrations/30-dark.svg')}
            className="light:hidden max-h-[130px]"
            alt=""
          />
        </div>

        <h3 className="text-lg font-medium text-gray-900 text-center mb-3">{title}</h3>
        {uuid === undefined ? (
          <>
            <div className="text-2sm text-center text-gray-700 mb-7.5">
              Please click the link sent to your email&nbsp;
              <a className="text-2sm text-gray-900 font-medium hover:text-primary-active">
                {currentUser?.email}
              </a>
              <br />
              to verify your account. Thank you
            </div>

            <div onClick={() => navigate('/auth/login')} className="flex justify-center mb-5">
              <p className="btn btn-primary flex justify-center">Back to Home</p>
            </div>

            <div className="flex items-center justify-center gap-1">
              <span className="text-xs text-gray-700">Didn’t receive an email?</span>
              <Link to="#" onClick={() => requestEmail()} className="text-xs font-medium link">
                Resend
              </Link>
            </div>
          </>
        ) : loading ? (
          <div className="flex justify-center grow w-full">
            <p>'Please wait...'</p>
          </div>
        ) : (
          <div className="flex justify-center grow w-full">
            <Link to="/auth/login" className="btn btn-primary flex justify-center min-w-[120px]">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export { CheckEmail };
