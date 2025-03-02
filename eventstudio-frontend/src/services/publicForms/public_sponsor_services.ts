import axios from 'axios';
import { IPublicSponsor, IPublicSponsorRequest } from '@/services/interfaces/public_forms.i.ts';
import { showToast } from '@/utils/toast_helper.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const addSponsorRequest = async (pub_sponsor_req: IPublicSponsorRequest | undefined) => {
  try {
    const response = await axios.post(
      `${API_URL}/public/sponsor/${pub_sponsor_req?.eventUUID}`,
      pub_sponsor_req
    );

    if (response.status == 200) {
      showToast('success', 'Sponsorship request sent successfully');
    } else {
      showToast('error', 'Failed to send sponsorship request');
    }

    return response.status == 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    showToast('error', 'Failed to send sponsorship request');
    throw new Error(`Error ${error}`);
  }
};

export const getAllSponsorRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/public/sponsor/all`);

    return response.data as IPublicSponsor[] | null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return [];
    }
    showToast('error', 'Failed to get sponsorship requests');
    throw new Error(`Error ${error}`);
  }
};

export const removeSponsorRequest = async (sponsor_id: number | undefined) => {
  try {
    const response = await axios.delete(`${API_URL}/public/sponsor/${sponsor_id}`);

    const is_success = response?.data?.success;

    if (is_success) {
      showToast('success', 'Sponsorship request removed successfully');
    } else {
      showToast('error', 'Failed to remove sponsorship request');
    }
    return is_success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    showToast('error', 'Failed to remove sponsorship request');
    throw new Error(`Error ${error}`);
  }
};
