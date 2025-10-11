import axios from "axios";
import { env } from "../env";
import { auth } from "@/services/firebase";

const apiClient = axios.create({
  baseURL: env.urls.baseUrl,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await auth.currentUser?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
