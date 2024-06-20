// data.js (useUserData function)
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import RegionalManagerDashboard from "layouts/dashboard-rm";
import userRoles from "constants/userRoles";

export default function useUserData(apiPath, status, navigatePath, onRowClick) {
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

        const users = response.data.filter((user) => user.status === status);

        const columns = [
          { Header: "Имя пользователя", accessor: "username", align: "left" },
          { Header: "Полное имя", accessor: "full_name", align: "left" },
          { Header: "Регион", accessor: "region", align: "center" },
          { Header: "Статус", accessor: "status", align: "center" },
        ];

        const rows = users.map((user) => ({
          username: (
            <MDTypography variant="caption" fontWeight="medium">
              {user.username}
            </MDTypography>
          ),
          full_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {user.full_name}
            </MDTypography>
          ),
          region: (
            <MDTypography variant="caption" fontWeight="medium" color="text">
              {user.region.name}
            </MDTypography>
          ),
          status: (
            <MDTypography variant="caption" fontWeight="medium" color="text">
              {user.status}
            </MDTypography>
          ),
          onClick: () => {
            if (status == userRoles.MEDICAL_REPRESENTATIVE) {
              navigate("/dd/mr-info", { state: user });
            }
          }, // Use onRowClick handler
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, [accessToken, apiPath, status, navigatePath, onRowClick]);

  return data;
}
