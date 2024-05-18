// hooks/useAxiosInterceptor.js
import { useEffect } from "react";
import axiosInstance from "../services/axiosInstance";
import { isTokenExpired } from "../utils/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/auth/authSlice";

const useAxiosInterceptor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          const token = localStorage.getItem("accessToken");
          console.log("INSIDE");
          if (isTokenExpired(token)) {
            dispatch(logout());
            navigate("/"); // Redirect to login page
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup function to remove the interceptor when the component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [dispatch, navigate]);
};

export default useAxiosInterceptor;
