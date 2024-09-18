// @mui material components
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DeputyDirectorMrsMonitoringTable from "../table/mr-monitoring-table";
import DeputyDirectorLoginMonitoringTable from "../table/monitoring-table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import CustomCalendar from "../elements/monitoring-calendar";

function DeputyDirectorLoginMonitoring() {
  const location = useLocation();
  const medRepId = location.state;
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [loginData, setLoginData] = useState([]);

  useEffect(() => {
    fetchLoginMonitoringData();
  }, [accessToken]);

  async function fetchLoginMonitoringData() {
    try {
      const response = await axiosInstance.get(`get-login-monitoring?user_id=${medRepId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setLoginData(response.data);
    } catch (error) {
      console.error("Failed to fetch login monitoring data:", error);
    }
  }

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <DeputyDirectorLoginMonitoringTable loginData={loginData} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <CustomCalendar loginData={loginData} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DeputyDirectorLoginMonitoring;
