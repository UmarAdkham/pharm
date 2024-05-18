// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import UsersTable from "layouts/user-table";
import { Outlet } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function DeputyDirectorPms({ children }) {
  const path = "common/get-users";
  const role = "Product Managers";
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <UsersTable path={path} role={role} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default DeputyDirectorPms;
