// @mui material components
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet, useNavigate } from "react-router-dom";
import DeputyDirectorMrsMonitoringTable from "../table/mr-monitoring-table";

function DeputyDirectorMrsMonitoring() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DeputyDirectorMrsMonitoringTable />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DeputyDirectorMrsMonitoring;
