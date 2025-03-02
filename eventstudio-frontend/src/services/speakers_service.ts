import axios from 'axios';
import { ISpeakerRequest } from '@/services/interfaces/speakers.i.ts';

import { showToast } from '@/utils/toast_helper.ts';
import apiClient from '@/config/axios.config.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getAllSpeakers = async (space_id: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/speakers/names/${space_id}`);

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

export const getSpeakersForEvent = async (event_id: number | undefined): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/speakers/event/${event_id}`);

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

export const addSpeaker = async (
  new_speaker: ISpeakerRequest,
  headshot: File | null
): Promise<any> => {
  try {
    const formData = new FormData();

    // Append all properties from the `public_onboard_request` object
    Object.entries(new_speaker).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (headshot) {
      formData.append('headshot', headshot);
    }

    const response = await apiClient.post(`${API_URL}/dashboard/speakers/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const added_speaker = response.data.result;
    if (response.data.success) {
      showToast('success', response?.data?.message || 'Speaker added successfully');
    } else {
      showToast('error', response?.data?.message || 'Failed to add speaker');
    }
    return added_speaker;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const deleteSpeaker = async (speaker_id: number | undefined): Promise<any> => {
  try {
    const response = await apiClient.delete(`${API_URL}/dashboard/speakers/del/${speaker_id}`);
    const is_deleted = response.data.success;

    if (is_deleted) {
      showToast('success', 'Speaker deleted successfully');
    } else {
      showToast('error', 'Failed to delete speaker');
    }
    return is_deleted;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateSpeaker = async (
  speaker_id: number,
  updated_data: ISpeakerRequest,
  headshot: File | null
): Promise<any> => {
  try {
    const formData = new FormData();

    // Append all properties from the `public_onboard_request` object
    Object.entries(updated_data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Append the file to FormData
    if (headshot) {
      formData.append('headshot', headshot);
    }

    const response = await apiClient.put(
      `${API_URL}/dashboard/speakers/update/${speaker_id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};
