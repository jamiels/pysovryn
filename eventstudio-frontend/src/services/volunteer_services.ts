import axios from 'axios';

import apiClient from '@/config/axios.config.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getVolunteers = async (): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/public/volunteer/all`);

    return response?.data?.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};
