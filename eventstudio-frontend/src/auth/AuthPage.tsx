import { Navigate, Route, Routes } from 'react-router';
import {
  CheckEmail,
  Login,
  ResetPassword,
  ResetPasswordChange,
  ResetPasswordChanged,
  ResetPasswordCheckEmail,
  Signup,
  TwoFactorAuth
} from './pages/jwt';
import { AuthBrandedLayout } from '@/layouts/auth-branded';
import { CheckInvitation } from '@/auth/pages/jwt/CheckInvitation.tsx';

//TODO:checked
const AuthPage = () => (
  <Routes>
    <Route element={<AuthBrandedLayout />}>
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/verify-email/:uuid" element={<CheckEmail />} />
      <Route path="/verify-invitation/:uuid" element={<CheckInvitation />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/check-email" element={<ResetPasswordCheckEmail />} />
      <Route path="/reset-password/change/:token" element={<ResetPasswordChange />} />
      <Route path="/reset-password/changed" element={<ResetPasswordChanged />} />
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Route>
  </Routes>
);

export { AuthPage };
