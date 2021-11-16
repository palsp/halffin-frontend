import axios from "axios";
import config from "config";

const axiosInstance = axios.create({
  baseURL: config.trackingServerURL,
  timeout: 8000,
});

export default axiosInstance;
