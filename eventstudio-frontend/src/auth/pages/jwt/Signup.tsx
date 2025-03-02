import clsx from 'clsx';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useAuthContext } from '@/auth';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';

const initialValues = {
  name: '',
  email: '',
  password: '',
  changepassword: '',
  role: 'EVENTSTUDIO_USER'
};

const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match")
});
const Signup = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const { register, registerInvitedUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();
  const [spaceInvitationEmail, setSpaceInvitationEmail] = useState('');
  const [spaceInvitationSpaceId, setSpaceInvitationSpaceId] = useState(0);

  const [isSpaceInvitation, setIsSpaceInvitation] = useState(false);

  useEffect(() => {
    //get the uuid from state
    const registered_email = location.state?.registered_email;
    const spaceId = location.state?.spaceId;

    if (registered_email) {
      formik.setFieldValue('email', registered_email);

      setSpaceInvitationSpaceId(spaceId);
      setSpaceInvitationEmail(registered_email);
      setIsSpaceInvitation(true);
    }
  }, [location.state?.registered_email]);

  const { auth } = useAuth();

  useEffect(() => {
    // if user is already logged in, redirect to home page
    if (auth) {
      navigate('/', { replace: true });
    }
  }, [auth, navigate]);

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      if (!executeRecaptcha) {
        console.warn('Execute reCAPTCHA not yet available');
        return;
      }

      setLoading(true);
      try {
        // Get reCAPTCHA token
        const token = await executeRecaptcha('LOGIN');

        if (!register) {
          throw new Error('JWTProvider is required for this form.');
        }

        const role = 'EVENTSTUDIO_USER';
        if (isSpaceInvitation) {
          await registerInvitedUser(
            spaceInvitationEmail,
            values.password,
            role,
            false,
            token,
            values.name,
            spaceInvitationSpaceId
          );
        } else {
          await register(values.email, values.password, role, false, token, values.name);
        }

        navigate('/auth/check-email', { replace: true });
      } catch (error: any) {
        setStatus(error?.message);
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="card max-w-[370px] w-full">
      <form
        className="card-body flex flex-col gap-5 p-10"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="text-center mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">Sign Up</h3>
          <div className="flex items-center justify-center font-medium">
            <span className="text-2sm text-gray-600 me-1.5">Already have an Account ?</span>
            <Link
              to={currentLayout?.name === 'auth-branded' ? '/auth/login' : '/auth/classic/login'}
              className="text-2sm link"
            >
              Sign In
            </Link>
          </div>
        </div>

        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Full Name</label>
          <label className="input">
            <input
              placeholder={'Full Name'}
              type="text"
              autoComplete="off"
              {...formik.getFieldProps('name')}
              className={clsx(
                'form-control bg-transparent',
                { 'is-invalid': formik.touched.name && formik.errors.name },
                {
                  'is-valid': formik.touched.name && !formik.errors.name
                }
              )}
            />
          </label>
          {formik.touched.name && formik.errors.name && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.name}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Email</label>
          <label className="input">
            {isSpaceInvitation ? (
              <input
                type="text"
                disabled={true}
                placeholder={spaceInvitationEmail}
                autoComplete="off"
                {...formik.getFieldProps('email')}
              />
            ) : (
              <input
                placeholder="email@email.com"
                type="email"
                autoComplete="off"
                {...formik.getFieldProps('email')}
                className={clsx(
                  'form-control bg-transparent',
                  { 'is-invalid': formik.touched.email && formik.errors.email },
                  {
                    'is-valid': formik.touched.email && !formik.errors.email
                  }
                )}
              />
            )}
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Password</label>
          <label className="input">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              autoComplete="off"
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.password && formik.errors.password
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password
                }
              )}
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: showPassword })}
              />
              <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: !showPassword })} />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Confirm Password</label>
          <label className="input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter Password"
              autoComplete="off"
              {...formik.getFieldProps('changepassword')}
              className={clsx(
                'form-control bg-transparent',
                {
                  'is-invalid': formik.touched.changepassword && formik.errors.changepassword
                },
                {
                  'is-valid': formik.touched.changepassword && !formik.errors.changepassword
                }
              )}
            />
            <button className="btn btn-icon" onClick={toggleConfirmPassword}>
              <KeenIcon
                icon="eye"
                className={clsx('text-gray-500', { hidden: showConfirmPassword })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx('text-gray-500', { hidden: !showConfirmPassword })}
              />
            </button>
          </label>
          {formik.touched.changepassword && formik.errors.changepassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.changepassword}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary flex justify-center grow"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? 'Please wait...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export { Signup };
