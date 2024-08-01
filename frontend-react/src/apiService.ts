import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const apiClient = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://127.0.0.1:8000/api/",
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getAccessTokenSilently();
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      return config;
    });

    return instance;
  }, [getAccessTokenSilently]);

  return apiClient;
};
