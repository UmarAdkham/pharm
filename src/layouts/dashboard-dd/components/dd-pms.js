// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import userRoles from "constants/userRoles";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import UsersTable from "layouts/user-table";
import { Outlet, useNavigate } from "react-router-dom";
import DeputyDirectorTable from "../table";

// eslint-disable-next-line react/prop-types
function DeputyDirectorPms({ children }) {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DeputyDirectorTable
                path={"common/get-users"}
                tableType="pms"
                status={userRoles.PRODUCT_MANAGER}
                title={"Менеджеры по продукту"}
                navigatePath="/dd/add-pm"
                rowPath="/dd/single-pm"
                onRowClick={(navigatePath, user) => {
                  navigate(navigatePath, { state: user });
                }}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default DeputyDirectorPms;
