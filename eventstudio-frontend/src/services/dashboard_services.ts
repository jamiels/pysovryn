import axios from 'axios';

import { IDashboardStatus } from '@/services/interfaces/dashboard.i.ts';
import apiClient from '@/config/axios.config.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getAllDashboardData = async (spaceId: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/status/get/${spaceId}`);

    return response?.data.result as IDashboardStatus;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    return [];
  }
};
