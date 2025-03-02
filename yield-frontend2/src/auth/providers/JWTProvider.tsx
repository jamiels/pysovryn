/* eslint-disable no-unused-vars */
import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useState
} from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';

const API_URL = import.meta.env.VITE_APP_API_URL;
export const LOGIN_URL = `${API_URL}/auth/login`;
export const REGISTER_URL = `${API_URL}/auth/register`;
export const REQUEST_EMAIL_URL = `${API_URL}/auth/request-verification-email`;
export const VERIFY_EMAIL_URL = `${API_URL}/auth/verify-email`;
export const FORGOT_PASSWORD_URL = `${API_URL}/auth/forgot-password`;
export const VERIFY_RESET_TOKEN_URL = `${API_URL}/auth/verify-reset-token`;
export const RESET_PASSWORD_URL = `${API_URL}/auth/reset-password`;
export const GET_USER_URL = `${API_URL}/user`;

interface AuthContextProps {
  isLoading: boolean;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (
    email: string,
    password: string,
    role: string[],
    acceptBlasts: boolean,
    captchaToken: string
  ) => Promise<void>;
  requestEmailLink: (email: string) => Promise<void>;
  verifyEmailLink: (token: string) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  verifyPasswordResetToken: (token: string) => Promise<void>;
  changePassword: (email: string, password: string) => Promise<void>;
  getUser: () => Promise<AxiosResponse<any>>;
  logout: () => void;
  verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

  const verify = async () => {
    if (auth) {
      try {
        const { data: user } = await getUser();
        setCurrentUser(user);
      } catch {
        saveAuth(undefined);
        setCurrentUser(undefined);
      }
    }
  };

  useEffect(() => {
    verify().finally(() => {
      setLoading(false);
    });
  }, []);

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data: auth } = await axios.post<AuthModel>(LOGIN_URL, {
        email,
        password
      });
      saveAuth(auth);

      const { data: user } = await getUser();
      // setCurrentUser(user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const register = async (
    email: string,
    password: string,
    role: string[],
    acceptBlasts: boolean,
    captchaToken: string
  ) => {
    try {
      await axios
        .post(REGISTER_URL, {
          email,
          password,
          role,
          acceptBlasts,
          captchaToken
        })
        .then((response) => {
          const userInfo: UserModel = {
            id: 0,
            username: 'testing',
            password: undefined,
            email: email,
            first_name: '',
            last_name: '',
            fullname: undefined,
            occupation: undefined,
            companyName: undefined,
            phone: undefined,
            roles: undefined,
            pic: undefined,
            language: undefined,
            auth: undefined
          };

          // saveAuth(auth);
          // const { data: user } = await getUser();
          setCurrentUser(userInfo);
        });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'An error occurred';
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(error?.response?.data?.message);
    }
  };

  const requestEmailLink = async (email: string) => {
    try {
      await axios.post(REQUEST_EMAIL_URL, {
        email
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const verifyEmailLink = async (token: string) => {
    try {
      await axios.get(VERIFY_EMAIL_URL + '/' + token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    try {
      await axios.post(FORGOT_PASSWORD_URL, {
        email
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const verifyPasswordResetToken = async (token: string) => {
    try {
      await axios.get(VERIFY_RESET_TOKEN_URL + '/' + token).then((response) => {
        const userInfo: UserModel = {
          id: 0,
          username: 'testing',
          password: undefined,
          email: response.data?.data?.email,
          first_name: '',
          last_name: '',
          fullname: undefined,
          occupation: undefined,
          companyName: undefined,
          phone: undefined,
          roles: undefined,
          pic: undefined,
          language: undefined,
          auth: undefined
        };

        setCurrentUser(userInfo);
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const changePassword = async (email: string, password: string) => {
    try {
      await axios.post(RESET_PASSWORD_URL, {
        email,
        password
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const getUser = async () => {
    try {
      return await axios.get<UserModel>(GET_USER_URL);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading: loading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestEmailLink,
        verifyEmailLink,
        requestPasswordResetLink,
        verifyPasswordResetToken,
        changePassword,
        getUser,
        logout,
        verify
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
