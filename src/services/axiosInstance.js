import axios from "axios";

console.log("TRY");
const axiosInstance = axios.create({
  baseURL: "https://heartly1.uz/",
});

export default axiosInstance;
