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
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
function DeputyDirectorMrs({ children }) {
  const { userRole, username } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DeputyDirectorTable
                path={
                  userRole === userRoles.PRODUCT_MANAGER
                    ? `common/get-users-by-username?username=${username}`
                    : "common/get-med-reps"
                }
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
