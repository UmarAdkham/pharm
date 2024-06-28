// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
// import { Outlet } from "react-router-dom";
import WholesaleReportTable from "../tables/report-details-table/report-table";
import { useLocation, useParams } from "react-router-dom";

function WholesaleReportDetails() {
  const location = useLocation();
  const { wholesale_id } = useParams();
  const wholesale_name = location.state || "";

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <WholesaleReportTable wsCompanyName={wholesale_name} wsCompanyId={wholesale_id} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default WholesaleReportDetails;
