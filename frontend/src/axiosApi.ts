import axios, {  InternalAxiosRequestConfig } from "axios";
import { apiUrl } from "./globalConstants.ts";

const axiosApi = axios.create({
  baseURL: apiUrl,
});
export const addInterceptors = () => {
  axiosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.withCredentials = true;
    return config;
  });
};

export default axiosApi;
