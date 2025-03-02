import axios from 'axios';
import { IPublicSpeaker, IPublicSpeakerRequest } from '@/services/interfaces/public_forms.i.ts';
import { showToast } from '@/utils/toast_helper.ts';
import { getAuth } from '@/auth';

const API_URL = import.meta.env.VITE_APP_API_URL;
const auth_token = getAuth()?.accessToken;

export const addPublicSpeaker = async (pub_speaker: IPublicSpeakerRequest | undefined) => {
  try {
    const response = await axios.post(
      `${API_URL}/public/speak/${pub_speaker?.eventUUID}`,
      pub_speaker
    );

    if (response.status == 200) {
      showToast('success', 'Speaker request sent successfully');
    } else {
      showToast('error', 'Failed to send speaker request');
    }

    return response.status == 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    showToast('error', 'Failed to send speaker request');
    throw new Error(`Error ${error}`);
  }
};

export const getAllSpeakerRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/speak/all`, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    });

    return response.data as IPublicSpeaker[] | null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return [];
    }
    showToast('error', 'Failed to get speaker requests');
    throw new Error(`Error ${error}`);
  }
};

export const removeSpeakerRequest = async (speaker_id: number | undefined) => {
  try {
    const response = await axios.delete(`${API_URL}/public/speak/${speaker_id}`);

    const is_success = response.status == 200;

    if (is_success) {
      showToast('success', 'Speaker request removed successfully');
    } else {
      showToast('error', 'Failed to remove speaker request');
    }

    return is_success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    showToast('error', 'Failed to remove speaker request');
    throw new Error(`Error ${error}`);
  }
};
