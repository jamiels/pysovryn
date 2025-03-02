import axios from 'axios';
import { IOrganizationRequest, IOrganizationUpdateRequest } from '@/services/interfaces/org.i.ts';

import { showToast } from '@/utils/toast_helper.ts';

import apiClient from '@/config/axios.config.ts';
const API_URL = import.meta.env.VITE_APP_API_URL;

export const removeOrganization = async (org_id: number | undefined): Promise<any> => {
  try {
    const response = await apiClient.delete(`${API_URL}/dashboard/org/delete/${org_id}`);

    const is_deleted: boolean = response.data.success;
    if (is_deleted) {
      showToast('success', 'Organization deleted successfully');
    } else {
      showToast('error', response.data.message || 'Failed to delete organization');
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

export const addOrganization = async (new_organization: IOrganizationRequest): Promise<any> => {
  try {
    const response = await apiClient.post(`${API_URL}/dashboard/org/add`, new_organization);

    const is_request_sent: boolean = response?.data.success;

    if (is_request_sent) {
      showToast('success', 'Organization added successfully');
    } else {
      showToast('error', response.data.message || 'Failed to add organization');
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

export const updateOrganization = async (
  organization_id: number | undefined,
  updated_organization: IOrganizationUpdateRequest
): Promise<any> => {
  try {
    const response = await apiClient.put(
      `${API_URL}/dashboard/org/update/${organization_id}`,
      updated_organization
    );

    const is_request_sent: boolean = response?.data.success;

    if (is_request_sent) {
      showToast('success', 'Organization updated successfully');
    } else {
      showToast('error', response.data.message || 'Failed to update organization');
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

export const getActiveOrganizations = async (space_id: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${API_URL}/dashboard/org/active/${space_id}`);

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
