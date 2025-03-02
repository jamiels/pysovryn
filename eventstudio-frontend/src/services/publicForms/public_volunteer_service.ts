import axios from 'axios';
import { IPublicVolunteerRequest } from '@/services/interfaces/public_forms.i.ts';
import { showToast } from '@/utils/toast_helper.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const addPublicVolunteer = async (pub_volunteer: IPublicVolunteerRequest | undefined) => {
  try {
    const response = await axios.post(
      `${API_URL}/public/volunteer/${pub_volunteer?.eventUUID}`,
      pub_volunteer
    );

    const is_success = response?.data?.success;

    if (is_success) {
      showToast('success', 'Volunteer request sent successfully');
    } else {
      showToast('error', 'Failed to send volunteer request');
    }

    return is_success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    showToast('error', 'Failed to send volunteer request');
    throw new Error(`Error ${error}`);
  }
};

export const removeVolunteerRequest = async (volunteer_id: number | undefined) => {
  try {
    const response = await axios.delete(`${API_URL}/public/volunteer/${volunteer_id}`);

    const is_success = response?.data?.success;

    if (is_success) {
      showToast('success', 'Volunteer request removed successfully');
    } else {
      showToast('error', 'Failed to remove volunteer request');
    }
    return is_success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    showToast('error', 'Failed to remove volunteer request');
    throw new Error(`Error ${error}`);
  }
};
