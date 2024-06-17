// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet } from "react-router-dom";
import WholesaleCompanyTable from "../tables/company-table";

function WholesaleManagerCompanies() {
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <WholesaleCompanyTable path={"ws/get-wholesales"} navigatePath="/ws/add-company" />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default WholesaleManagerCompanies;
