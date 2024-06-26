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
import DeputyDirectorTable from "../table";

// eslint-disable-next-line react/prop-types
function DeputyDirectorMrs({ children }) {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DeputyDirectorTable
                path={"common/get-users"}
                status={userRoles.MEDICAL_REPRESENTATIVE}
                title={`Медицинские представители`}
                tableType="mrs"
                navigatePath="/dd/mr-info"
                onRowClick={(navigatePath, user) => {
                  navigate(navigatePath, { state: user });
                }}
                showAddButton={false}
                showFilters={true}
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
