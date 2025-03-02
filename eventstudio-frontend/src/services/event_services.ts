import axios from 'axios';
import { IEvent, IEventAddRequest } from '@/services/interfaces/event.i.ts';

import { showToast } from '@/utils/toast_helper.ts';
import apiClient from '@/config/axios.config.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;
const REDIRECT_URL = import.meta.env.VITE_HOMEPAGE_URL;

export const getAllEvents = async (spaceId: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/events/get/${spaceId}`);

    return response?.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const addEvent = async (event_data: IEventAddRequest | undefined) => {
  try {
    const response = await apiClient.post(`${API_URL}/dashboard/events/add`, event_data);

    const is_added = response.status == 200;

    if (is_added) {
      showToast('success', 'Event added successfully');
      const event: IEvent = response.data.result;

      return event;
    } else {
      showToast('error', response.data.message || 'Error adding event');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateEvent = async (event_id: number | undefined, updated_event_data: any) => {
  try {
    const response = await apiClient.put(
      `${API_URL}/dashboard/events/update/${event_id}`,
      updated_event_data
    );

    const is_success = response.data.success;

    if (is_success) {
      showToast('success', 'Event updated successfully');
    } else {
      showToast('error', response.data.message);
    }
    return is_success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const deleteEvent = async (event_id: number | undefined) => {
  try {
    const response = await apiClient.delete(`${API_URL}/dashboard/events/delete/${event_id}`);

    if (response.status === 200) {
      showToast('success', 'Event deleted successfully');
    }
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

export const getActiveEvents = async (space_id: number) => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/events/active/${space_id}`);
    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

//This will get the initial data for the event creation form (venues)
export const getEventInitData = async (space_id: number) => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/events/init/${space_id}`);

    return response.data?.result?.venuesMap;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const uploadEventBanner = async (eventID: number, file: string | Blob) => {
  try {
    const formData = new FormData();
    formData.append('banner', file);

    const response = await apiClient.post(
      `${API_URL}/dashboard/events/banner/add/${eventID}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    const is_success = response.status === 200;
    if (is_success) {
      showToast('success', 'Banner uploaded successfully');
    }
    return is_success;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const getEventByUUID = async (eventUUID: string) => {
  try {
    const response = await apiClient.get(`${API_URL}/public/onboard/get/event/${eventUUID}`, {});
    if (response.data.status === 'UNAUTHORIZED') {
      window.location.href = REDIRECT_URL;
      return;
    }
    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const getEventById = async (eventId: number) => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/events/get/event/${eventId}`);

    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};
