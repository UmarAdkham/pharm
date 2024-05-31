// @mui material components
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet, useNavigate } from "react-router-dom";
import DeputyDirectorTable from "../table";

function DeputyDirectorMedicalOrganizations() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Box display="flex" justifyContent="flex-end" mb={3}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ color: "white" }}
                  onClick={() => {
                    navigate("/dd/add-medical-organziation");
                  }}
                >
                  Add
                </Button>
              </Box>
              <DeputyDirectorTable
                path={"common/get-medical-organization"}
                tableType="medical-organizaions"
                title={"Medical Organizations"}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default DeputyDirectorMedicalOrganizations;
