// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import getFullStatusName from "constants/getFullStatusName";
import userRoles from "constants/userRoles";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MedicalRepresentativeTable from "layouts/mr-table";

// Dashboard components
import UsersTable from "layouts/user-table";
import { Outlet, useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function DeputyDirectorMrs({ children }) {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <MedicalRepresentativeTable
                path={"common/get-users"}
                status={userRoles.MEDICAL_REPRESENTATIVE}
                title={`Медицинские прредставители`}
                // navigatePath={"/dd/single-pm"}
                // onRowClick={(navigatePath, user) => {
                //   navigate(navigatePath, { state: user });
                // }}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default DeputyDirectorMrs;
