import axios from 'axios';

import {
  IAddSpaceUserRequest,
  IEmailInvite,
  IRemoveSpaceUserRequest,
  ISpaceAddRequest,
  ISpaceUpdateRequest
} from '@/services/interfaces/space.i.ts';
import { showToast } from '@/utils/toast_helper.ts';
import apiClient from '@/config/axios.config.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getSpacesByUser = async (userId: number) => {
  try {
    const response = await apiClient.get(`${API_URL}/spaces/get/user-spaces/${userId}`);
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

export const createSpace = async (space: ISpaceAddRequest) => {
  try {
    const response = await apiClient.post(`${API_URL}/spaces/create`, space);

    const isCreated = response?.data?.success;
    if (isCreated) {
      showToast('success', 'Space created successfully');
    } else {
      showToast('error', 'Failed to create space');
    }

    return isCreated;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateSpace = async (spaceId: number, updatedSpace: ISpaceUpdateRequest) => {
  try {
    const response = await apiClient.put(`${API_URL}/spaces/update/${spaceId}`, updatedSpace);

    const isUpdated = response?.data?.success;
    if (isUpdated) {
      showToast('success', 'Space updated successfully');
    } else {
      showToast('error', 'Failed to update space');
    }

    return isUpdated;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const deleteSpace = async (spaceId: number) => {
  try {
    const response = await apiClient.put(`${API_URL}/spaces/disable/${spaceId}/`);

    const isDeleted = response?.data?.success;
    if (isDeleted) {
      showToast('success', 'Space removed successfully');
    } else {
      showToast('error', 'Failed to remove space');
    }

    return isDeleted;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const addSpaceUser = async (spaceId: number, request: IAddSpaceUserRequest) => {
  try {
    const response = await apiClient.post(`${API_URL}/spaces/add/spaceUser/${spaceId}`, request);

    const isAdded = response?.data?.result?.status;

    if (isAdded) {
      showToast('success', 'User added to space successfully');
    }

    return isAdded;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const addNewSpaceUser = async (spaceId: number, request: IAddSpaceUserRequest) => {
  try {
    const response = await apiClient.post(
      `${API_URL}/spaces/add/new/spaceUser/${spaceId}`,
      request
    );

    const isAdded = response?.data?.success;

    if (isAdded) {
      showToast('success', 'User added to space successfully');
    }
    return isAdded;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const removeSpaceUser = async (request: IRemoveSpaceUserRequest) => {
  try {
    const response = await apiClient.put(`${API_URL}/spaces/remove/spaceUser`, request);

    const isRemoved = response?.data?.success;

    if (isRemoved) {
      showToast('success', 'User removed from space successfully');
    } else {
      showToast('error', response?.data?.message || 'Error occurred while removing a user');
    }

    return isRemoved;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const addNewSpaceUserByEmail = async (request: IEmailInvite) => {
  try {
    const response = await apiClient.post(`${API_URL}/auth/add-user/send-verification`, request);

    const isSent = response?.data?.success;
    if (isSent) {
      showToast('success', 'Email invite sent successfully');
    }

    return isSent;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

interface IVerifySpaceInvitationResponse {
  isUserExist: boolean;
  email: string;
  spaceId: number;
}

export const verifySpaceInvitation = async (verificationCode: string) => {
  try {
    const response = await apiClient.get(`${API_URL}/auth/add-user/verify/${verificationCode}`);

    const response_data: IVerifySpaceInvitationResponse = response?.data?.result;

    return response_data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};
