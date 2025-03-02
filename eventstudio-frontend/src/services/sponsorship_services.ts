import axios from 'axios';
import {
  IAddSponsorshipRequest,
  IUpdateSponsorshipRequest
} from '@/services/interfaces/sponsorships.i.ts';

import { showToast } from '@/utils/toast_helper.ts';
import apiClient from '@/config/axios.config.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getAllSponsorships = async (space_id: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/sponsorships/all/${space_id}`);

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

export const getEventSponsorships = async (event_id: number | undefined): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/sponsorships/event/${event_id}`);

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

export const addSponsor = async (new_sponsor: IAddSponsorshipRequest): Promise<any> => {
  try {
    const response = await apiClient.post(`${API_URL}/dashboard/sponsorships/add`, new_sponsor);

    const is_request_sent = response?.data?.success as boolean;

    const added_sponsor = response.data.result;
    if (is_request_sent) {
      showToast('success', response?.data?.message || 'Sponsor added successfully');
    } else {
      showToast('error', response?.data?.message || 'Failed to add sponsorship request');
    }
    return added_sponsor;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;

      showToast('error', message);
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateSponsor = async (
  sponsor_id: number,
  updated_sponsor: IUpdateSponsorshipRequest
): Promise<any> => {
  try {
    const response = await apiClient.put(
      `${API_URL}/dashboard/sponsorships/update/${sponsor_id}`,
      updated_sponsor
    );

    const is_request_sent = response?.status === 200;
    if (is_request_sent) {
      showToast('success', 'Sponsor updated successfully');
    } else {
      showToast('error', 'Failed to update sponsorship request');
    }
    return is_request_sent;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;

      showToast('error', message);
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const deleteSponsor = async (sponsor_id: number | undefined): Promise<any> => {
  try {
    const response = await apiClient.delete(`${API_URL}/dashboard/sponsorships/del/${sponsor_id}`);

    const is_deleted = response?.data.success;

    if (is_deleted) {
      showToast('success', 'Sponsor deleted successfully');
    } else {
      showToast('error', 'Failed to delete sponsor');
      return is_deleted;
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
