import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { useEffect, useState } from 'react';

import { verifySpaceInvitation } from '@/services/space_services.ts';

const CheckInvitation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { uuid } = useParams();

  const [title, setTitle] = useState('Check your email');
  const [loading, setLoading] = useState(true);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  useEffect(() => {
    if (uuid) {
      setTitle('Verifying Email');
      VerifyInvitation();
    }
  }, []);

  const VerifyInvitation = async () => {
    if (uuid) {
      try {
        const response = await verifySpaceInvitation(uuid);
        setLoading(false);
        if (!response.isUserExist) {
          navigate('/auth/signup', {
            state: { registered_email: response.email, spaceId: response.spaceId }
          });
        }
        setIsUserRegistered(response.isUserExist);
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
              Please click the link sent to your email&nbsp; to verify your account. Thank you
            </div>

            <div onClick={() => navigate('/auth/login')} className="flex justify-center mb-5">
              <p className="btn btn-primary flex justify-center">Back to Home</p>
            </div>
          </>
        ) : loading ? (
          <div className="flex justify-center grow w-full">
            <p>'Please wait...'</p>
          </div>
        ) : (
          isUserRegistered && (
            <div className="flex justify-center grow w-full">
              <Link to="/auth/login" className="btn btn-primary flex justify-center min-w-[120px]">
                Back to Login
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export { CheckInvitation };
