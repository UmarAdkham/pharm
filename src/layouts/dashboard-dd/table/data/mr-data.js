import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip
import NotificationIcon from "@mui/icons-material/Notifications";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VaccinesIcon from "@mui/icons-material/Vaccines";

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
            <div>
              <Tooltip title="Add Notification">
                <IconButton
                  onClick={() => {
                    navigate("/dd/add-notification", { state: mr });
                  }}
                >
                  <NotificationIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Doctor Plan">
                <IconButton
                  onClick={() => {
                    navigate("/dd/add-doctor-plan", { state: mr });
                  }}
                >
                  <MedicalServicesIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add Pharmacy Plan">
                <IconButton
                  onClick={() => {
                    navigate("/dd/add-doctor-plan", { state: mr });
                  }}
                >
                  <VaccinesIcon />
                </IconButton>
              </Tooltip>
            </div>
          ),
          onClick: () => {
            // onRowClick(navigatePath, user);
          },
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
