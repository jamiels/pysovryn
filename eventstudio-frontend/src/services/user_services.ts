import axios from 'axios';

import { getAuth } from '@/auth';
import { IChangePassword, IUpdateUser, IUserAccessRequest } from '@/services/interfaces/users.i.ts';
import { showToast } from '@/utils/toast_helper.ts';
import apiClient from '@/config/axios.config.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

const auth_token = getAuth()?.accessToken;

export const getAllUsers = async (space_id: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/auth/all/${space_id}`);

    return response?.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const uploadProfileImage = async (userId: number, file: string | Blob): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/files/upload/profile-image/${userId}`, formData, {
      headers: {
        Authorization: `Bearer ${auth_token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    const is_uploaded = response?.status === 200;

    if (is_uploaded) {
      showToast('success', 'Profile image uploaded successfully');
    } else {
      showToast('error', 'Profile image not uploaded. Please try again');
    }

    return is_uploaded;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateUser = async (user_id: number, updatedUser: IUpdateUser): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}/auth/update/${user_id}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    });

    const is_updated = response?.data?.success;

    if (is_updated) {
      showToast('success', 'User updated successfully');
    } else {
      showToast('error', 'User not updated. Please try again');
    }

    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const changePassword = async (change_password_request: IChangePassword): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/auth/changepassword`, change_password_request, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    });

    const is_updated = response.status === 200;

    if (is_updated) {
      showToast('success', 'Password changed successfully');
    }

    return response.data.result;
  } catch (error) {
    showToast('error', 'Password not changed. Please try again');
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateUserAccess = async (formData: IUserAccessRequest): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/auth/update/user-access`, formData, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    });

    const is_updated = response?.data?.success;

    if (is_updated) {
      showToast('success', 'User access updated successfully');
    } else {
      showToast('error', 'User access not updated. Please try again');
    }

    return is_updated;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${e}`);
  }
};
