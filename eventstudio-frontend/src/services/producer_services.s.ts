import axios from 'axios';

import { IProducerRequest } from '@/services/interfaces/producer.i.ts';
import { showToast } from '@/utils/toast_helper.ts';

import { getAuth } from '@/auth';
const API_URL = import.meta.env.VITE_APP_API_URL;

const auth_token = getAuth()?.accessToken;

export const getAllProducers = async (space_id: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/producer/names/${space_id}`, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    });

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

export const addProducer = async (new_producer: IProducerRequest): Promise<any> => {
  try {
    const response = await axios.post(`${API_URL}/dashboard/producer/add`, new_producer);

    return response?.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateProducer = async (
  producer_id: number | undefined,
  producer: IProducerRequest
): Promise<any> => {
  try {
    const response = await axios.put(
      `${API_URL}/dashboard/producer/update/${producer_id}`,
      producer
    );

    const is_updated = response?.status === 200;

    if (is_updated) {
      showToast('success', 'Producer updated successfully');
    } else {
      showToast('error', 'Producer was unable to be updated');
    }
    return is_updated as boolean;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const removeProducer = async (producer_id: number | undefined): Promise<any> => {
  try {
    const response = await axios.delete(`${API_URL}/dashboard/producer/del/${producer_id}`);

    const is_deleted = response?.status === 200;

    if (is_deleted) {
      showToast('success', 'Producer deleted successfully');
    } else {
      showToast('error', 'Producer was unable to be deleted');
    }
    return is_deleted as boolean;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};
