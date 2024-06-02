// @mui material components
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DeputyDirectorTable from "../table";

function DeputyDirectorMRInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state || {};
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DeputyDirectorTable
                path={`/mr/get-doctor-visit-plan?user_id=${user.id}`}
                tableType="doctor-plan"
                title="Планы Врачей"
                showAddButton={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DeputyDirectorTable
                path={`mr/get-pharmacy-visit-plan?user_id=${user.id}`}
                tableType="pharmacy-plan"
                title="Планы Аптек"
                showAddButton={false}
              />
            </Grid>
            <Grid item xs={12}>
              <DeputyDirectorTable
                path={"common/get-notifications"}
                tableType="notifications"
                title="Уведомления"
                showAddButton={false}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default DeputyDirectorMRInfo;
