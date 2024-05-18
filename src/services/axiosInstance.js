import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://heartly1.uz/",
});

export default axiosInstance;
