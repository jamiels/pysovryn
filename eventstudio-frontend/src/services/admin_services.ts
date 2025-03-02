import axios from 'axios';
import apiClient from '@/config/axios.config.ts';
import { showToast } from '@/utils/toast_helper.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getAllEvents = async (): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/admin/event/get/all`);
    return response?.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
  }
};

export const getAllSpaces = async (): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/admin/space/get/all`);
    return response?.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
  }
};

export const getAllUsers = async (): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/admin/user/get/all`);
    return response?.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
  }
};

export const getAllUserLogs = async (): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/admin/audit/user`);
    return response?.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
  }
};

export const disableEvent = async (eventId: number, isDisabled: boolean): Promise<any> => {
  try {
    const response = await apiClient.post(`${API_URL}/admin/event/disable/${eventId}`, isDisabled);

    if (!response?.data?.success) {
      showToast('error', 'Something went wrong while disabling event');
      return;
    }
    const is_disabled = response?.data?.result;
    if (is_disabled) {
      showToast('success', 'Event disabled successfully');
    } else {
      showToast('success', 'Event enabled successfully');
    }
    return response?.data?.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
  }
};
export const disableSpace = async (spaceId: number, isDisabled: boolean): Promise<any> => {
  try {
    const response = await apiClient.post(`${API_URL}/admin/space/disable/${spaceId}`, isDisabled);

    if (!response?.data?.success) {
      showToast('error', 'Something went wrong while disabling space');
      return;
    }
    const is_disabled = response?.data?.result;
    if (is_disabled) {
      showToast('success', 'Space disabled successfully');
    } else {
      showToast('success', 'Space enabled successfully');
    }
    return response?.data?.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
  }
};

export const disableUser = async (userId: number, isDisabled: boolean): Promise<any> => {
  try {
    const response = await apiClient.post(`${API_URL}/admin/user/disable/${userId}`, isDisabled);

    if (!response?.data?.success) {
      showToast('error', 'Something went wrong while disabling user');
      return;
    }
    const is_disabled = response?.data?.result;
    if (is_disabled) {
      showToast('success', 'User disabled successfully');
    } else {
      showToast('success', 'User enabled successfully');
    }
    return response?.data?.success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
  }
};
