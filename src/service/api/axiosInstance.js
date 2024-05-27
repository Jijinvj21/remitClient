import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://192.168.0.100:8085`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // take token form the local storage 
    const token = false;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;