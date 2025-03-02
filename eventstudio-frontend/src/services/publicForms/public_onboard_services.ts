import axios from 'axios';
import {
  IPublicOnboard,
  IPublicOnboardSpeakerRequest
} from '@/services/interfaces/public_forms.i.ts';
import { showToast } from '@/utils/toast_helper.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const addOnboardRequest = async (
  public_onboard_request: IPublicOnboardSpeakerRequest | undefined,
  headshot: File | null
) => {
  try {
    if (!public_onboard_request) {
      showToast('error', 'Failed to send onboarding request');
      return false;
    }

    const formData = new FormData();

    // Append all properties from the `public_onboard_request` object
    Object.entries(public_onboard_request).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    // Append the file to FormData
    if (headshot) {
      formData.append('headshot', headshot);
    }

    const response = await axios.post(
      `${API_URL}/public/onboard/add/${public_onboard_request.eventUUID}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.status === 201) {
      showToast('success', 'Onboarding request sent successfully');
    } else {
      showToast('error', 'Failed to send onboarding request');
    }

    return response.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }

    showToast('error', 'Failed to send onboarding request');
    throw new Error(`Error ${error}`);
  }
};

export const removeOnboardRequest = async (onboard_id: number | undefined) => {
  try {
    const response = await axios.delete(`${API_URL}/public/onboard/delete/${onboard_id}`);
    const is_removed = response.status === 200;
    if (is_removed) {
      showToast('success', 'Onboarding request removed successfully');
    } else {
      showToast('error', 'Failed to remove onboard speaker request');
    }

    return is_removed;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    showToast('error', 'Failed to remove onboard speaker request');
    throw new Error(`Error ${error}`);
  }
};

export const getAllOnboardRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/onboard/all`);

    return response.data as IPublicOnboard[] | null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return [];
    }
    showToast('error', 'Failed to get onboard speaker requests');
    throw new Error(`Error ${error}`);
  }
};
