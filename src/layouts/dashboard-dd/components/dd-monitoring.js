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

function DeputyDirectorLoginMonitoring() {
  const location = useLocation();
  const medRepId = location.state;

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DeputyDirectorLoginMonitoringTable medRepId={medRepId} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DeputyDirectorLoginMonitoring;
