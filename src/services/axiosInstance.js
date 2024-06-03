import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://it-club.uz/",
});

export default axiosInstance;
