import { TDataGridRequestParams } from '@/components';
import axios, { AxiosResponse } from 'axios';
import { createContext, useState, type PropsWithChildren } from 'react';

interface ITokenProjectsContextProps {
  fetchTokenProjectList: (params: TDataGridRequestParams) => Promise<AxiosResponse<any>>;
  tokenProjectListCount: number;
  reloadData: number;
  setTokenProjectCount: (count: number) => void;
  triggerReloadData: () => void;
  currentTokenProject: any;
  fetchTokenProject: (id: string) => Promise<void>;
  fetchProjectDocument: (id: string, passcode: string) => Promise<AxiosResponse<any>>;
  getDocumentDetails: (id: string) => Promise<AxiosResponse<any>>;
}

const defaultContext: ITokenProjectsContextProps = {
  fetchTokenProjectList: async () => {
    throw new Error('fetchTeams not implemented');
  },
  tokenProjectListCount: 0,
  reloadData: 0,
  setTokenProjectCount: (count: number) => {},
  triggerReloadData: () => {},
  currentTokenProject: {},
  fetchTokenProject: async (id: string) => {},
  fetchProjectDocument: async (id: string, passcode: string) => {
    throw new Error('fetchTeams not implemented');
  },
  getDocumentDetails: async (id: string) => {
    throw new Error('fetchTeams not implemented');
  }
};

const TokenProjectsContext = createContext<ITokenProjectsContextProps>(defaultContext);

const TokenProjectsProvider = ({ children }: PropsWithChildren) => {
  const [reloadData, setReloadData] = useState(0);
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
        `${import.meta.env.VITE_APP_API_URL}/projects/list?${queryParams.toString()}`
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

  const triggerReloadData = () => {
    setReloadData(reloadData + 1);
  };

  const setTokenProjectCount = (count: number) => {
    setTokenProjectListCount(count);
  };

  const fetchProjectDocument = async (id: string, passcode: string) => {
    try {
      return await axios.post<any>(
        `${import.meta.env.VITE_APP_API_URL}/files/download/${id}`,
        {
          password: passcode
        },
        {
          responseType: 'blob' // Important for handling binary data
        }
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

  const getDocumentDetails = async (id: string) => {
    try {
      return await axios.get<any>(
        `${import.meta.env.VITE_APP_API_URL}/files/document/${id}/details`
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
            symbol: response?.data?.tokens?.[0]?.symbol,
            documents: response?.data?.documents
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

  return (
    <TokenProjectsContext.Provider
      value={{
        fetchTokenProjectList,
        tokenProjectListCount,
        setTokenProjectCount,
        reloadData,
        triggerReloadData,
        currentTokenProject,
        fetchTokenProject,
        fetchProjectDocument,
        getDocumentDetails
      }}
    >
      {children}
    </TokenProjectsContext.Provider>
  );
};

export { TokenProjectsContext, TokenProjectsProvider };
