import axios from "axios";
import environment from "../environments";

const baseConfig = {
  baseURL: environment().baseServiceUrl,
};

const createService = (useAuth) => {
  const instance = axios.create(baseConfig);
  instance.defaults.headers.common["Content-Type"] = "application/json";
  if (useAuth) {
    instance.interceptors.request.use(
      async (config) => {
        const token = sessionStorage.getItem("auth");
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
  }
  return instance;
};

export default createService;
