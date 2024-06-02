// data.js (useUserData function)
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton"; // Import IconButton
import NotificationIcon from "@mui/icons-material/Notifications"; // Import an icon, change as needed

export default function useMrData(apiPath, status, onIconClick) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const mrs = response.data.filter((user) => user.status === status);

        const columns = [
          { Header: "Имя пользователя", accessor: "username", align: "left" },
          { Header: "Полное имя", accessor: "full_name", align: "left" },
          { Header: "Статус", accessor: "status", align: "center" },
          { Header: "Действия", accessor: "actions", align: "center" }, // Add Actions column
        ];

        const rows = mrs.map((mr) => ({
          username: (
            <MDTypography variant="caption" fontWeight="medium">
              {mr.username}
            </MDTypography>
          ),
          full_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {mr.full_name}
            </MDTypography>
          ),
          status: (
            <MDTypography variant="caption" fontWeight="medium" color="text">
              {mr.status}
            </MDTypography>
          ),
          actions: (
            <IconButton
              onClick={() => {
                navigate("/dd/add-notification", { state: mr });
              }}
            >
              <NotificationIcon />
            </IconButton>
          ), // Add the icon button with onClick handler
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, [accessToken, apiPath, onIconClick]);

  return data;
}
