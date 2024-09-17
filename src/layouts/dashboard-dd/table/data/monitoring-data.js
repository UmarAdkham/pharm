import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useLoginMonitoringData(medRepId) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchLoginMonitoringData() {
      try {
        const response = await axiosInstance.get(
          `https://it-club.uz/get-login-monitoring?user_id=${medRepId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const loginData = response.data;

        // Define columns
        const columns = [
          { Header: "Дата входа", accessor: "login_date", align: "left" },
          { Header: "Дата выхода", accessor: "logout_date", align: "left" },
          { Header: "Местоположение", accessor: "location", align: "left" },
          { Header: "Продолжительность", accessor: "duration", align: "left" },
        ];

        // Define rows
        const rows = loginData.map((session) => ({
          login_date: (
            <MDTypography variant="caption" fontWeight="medium">
              {new Date(session.login_date).toLocaleString()}
            </MDTypography>
          ),
          logout_date: (
            <MDTypography variant="caption" fontWeight="medium">
              {session.logout_date ? new Date(session.logout_date).toLocaleString() : "-"}
            </MDTypography>
          ),
          location: (
            <MDTypography variant="caption" fontWeight="medium">
              {session.location ? session.location : "-"}
            </MDTypography>
          ),
          duration: (
            <MDTypography variant="caption" fontWeight="medium">
              {session.durstion ? session.durstion : "-"}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error("Failed to fetch login monitoring data:", error);
      }
    }

    // Fetch data when medRepId or monthNumber changes
    fetchLoginMonitoringData();
  }, [accessToken, medRepId]);

  return data;
}
