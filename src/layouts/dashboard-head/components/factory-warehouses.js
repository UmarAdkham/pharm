// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import FactoriesTable from "../tables/factories-table";

function HeadOfOrdersFactoryWarehouses() {
  const location = useLocation();
  const user = location.state || {};
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <FactoriesTable />
            </Grid>
            <Grid item xs={8}>
              {/* <DeputyDirectorTable
                path={`mr/get-pharmacy-visit-plan?user_id=${user.id}`}
                tableType="pharmacy-plan"
                title="Планы аптек"
                navigatePath="/dd/add-pharmacy-plan"
                navigateState={user}
              /> */}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default HeadOfOrdersFactoryWarehouses;
