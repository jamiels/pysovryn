import { TDataGridRequestParams } from '@/components';
import axios, { AxiosResponse } from 'axios';
import { createContext, useState, type PropsWithChildren } from 'react';

interface ITokenProjectsContextProps {
  fetchTokenProjectList: (params: TDataGridRequestParams) => Promise<AxiosResponse<any>>;
  tokenProjectListCount: number;
  refreshTokenProjects: number;
  setTokenProjectCount: (count: number) => void;
  triggerTokenProjectsRefresh: () => void;
  currentTokenProject: any;
  fetchTokenProject: (id: string) => Promise<void>;
  toggleAction: (id: string, action: string) => Promise<AxiosResponse<any>>;
}

const defaultContext: ITokenProjectsContextProps = {
  fetchTokenProjectList: async () => {
    throw new Error('fetchTeams not implemented');
  },
  tokenProjectListCount: 0,
  refreshTokenProjects: 0,
  setTokenProjectCount: (count: number) => {},
  triggerTokenProjectsRefresh: () => {},
  currentTokenProject: {},
  fetchTokenProject: async (id: string) => {},
  toggleAction: async (id: string, action: string) => {
    throw new Error('Invalid Action');
  }
};

const AdminContext = createContext<ITokenProjectsContextProps>(defaultContext);

const AdminProvider = ({ children }: PropsWithChildren) => {
  const [refreshTokenProjects, setRefreshTokenProjects] = useState(0);
  const [tokenProjectListCount, setTokenProjectListCount] = useState(0);
  const [currentTokenProject, setCurrentTokenProject] = useState({});

  const fetchTokenProjectList = async (params: TDataGridRequestParams) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.set('page', String(params.pageIndex));
      queryParams.set('size', String(params.pageSize));

      if (params.sorting?.[0]?.id) {
        queryParams.set('sort', params.sorting[0].id);
        queryParams.set('order', params.sorting[0].desc ? 'desc' : 'asc');
      }

      return await axios.get<any>(
        `${import.meta.env.VITE_APP_API_URL}/admin/projects?${queryParams.toString()}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      throw new Error(`Error ${error}`);
    }
  };

  const triggerTokenProjectsRefresh = () => {
    setRefreshTokenProjects(refreshTokenProjects + 1);
  };

  const setTokenProjectCount = (count: number) => {
    setTokenProjectListCount(count);
  };

  const fetchTokenProject = async (id: string) => {
    try {
      await axios
        .get<any>(`${import.meta.env.VITE_APP_API_URL}/projects/details/get/${id}`)
        .then((response: any) => {
          setCurrentTokenProject({
            id: response?.data?.id,
            name: response?.data?.name,
            projectUrl: response?.data?.projectUrl,
            targetRaise: response?.data?.targetRaise,
            raiseStage: response?.data?.raiseStage,
            blurb: response?.data?.blurb,
            country: response?.data?.country,
            symbol: response?.data?.symbol
          });
        });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      throw new Error(`Error ${error}`);
    }
  };

  const toggleAction = async (id: string, action: string) => {
    try {
      const queryParams = new URLSearchParams();

      queryParams.set('action', action);

      return await axios.patch<any>(
        `${import.meta.env.VITE_APP_API_URL}/projects/${id}/toggle?${queryParams.toString()}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      throw new Error(`Error ${error}`);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        fetchTokenProjectList,
        tokenProjectListCount,
        setTokenProjectCount,
        refreshTokenProjects,
        triggerTokenProjectsRefresh,
        currentTokenProject,
        fetchTokenProject,
        toggleAction
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext, AdminProvider };
