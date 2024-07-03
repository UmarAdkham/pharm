// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
// import { Outlet } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import DeputyDirectorBonusTable from "../table/bonus-table";

function DeputyDirectorBonus() {
  const location = useLocation();
  const { id, full_name } = location.state || {};

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DeputyDirectorBonusTable med_rep_id={id} med_rep_name={full_name} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DeputyDirectorBonus;
