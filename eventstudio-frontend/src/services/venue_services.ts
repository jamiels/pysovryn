import axios from 'axios';

import { IVenueRequest, IVenueUpdateRequest } from '@/services/interfaces/venue.i.ts';
import { showToast } from '@/utils/toast_helper.ts';

import apiClient from '@/config/axios.config.ts';
const API_URL = import.meta.env.VITE_APP_API_URL;

export const getVenues = async (space_id: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/venue/all/${space_id}`);

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

export const addVenue = async (new_venue: IVenueRequest): Promise<any> => {
  try {
    const response = await apiClient.post(`${API_URL}/dashboard/venue/add`, new_venue);

    const is_request_sent = response?.data.success as boolean;

    if (is_request_sent) {
      showToast('success', response.data.message || 'Venue added successfully');
    } else {
      showToast('error', response.data.message || 'Failed to add venue');
    }

    return is_request_sent;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateVenue = async (
  venue_id: number | undefined,
  updated_venue: IVenueUpdateRequest
): Promise<any> => {
  try {
    const response = await apiClient.put(
      `${API_URL}/dashboard/venue/update/${venue_id}`,
      updated_venue
    );

    const is_request_sent = response?.data?.success as boolean;

    if (is_request_sent) {
      showToast('success', response?.data?.message || 'Venue updated successfully');
    } else {
      showToast('error', response?.data?.message || 'Failed to update venue');
    }

    return is_request_sent;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const deleteVenue = async (venue_id: number | undefined): Promise<any> => {
  try {
    const response = await apiClient.delete(`${API_URL}/dashboard/venue/delete/${venue_id}`);

    const is_deleted = response?.data?.success as boolean;

    if (is_deleted) {
      showToast('success', response?.data?.message || 'Venue deleted successfully');
    } else {
      showToast('error', response?.data?.message || 'Failed to delete venue');
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
