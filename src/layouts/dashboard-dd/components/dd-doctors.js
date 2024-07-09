// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { useLocation, useParams } from "react-router-dom";
import DeputyDirectorDoctorsTable from "../table/doctors-table";

function DeputyDirectorDoctors() {
  const location = useLocation();

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <DeputyDirectorDoctorsTable med_rep_id={8} med_rep_name={"Eshmat Toshmatov"} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DeputyDirectorDoctors;
