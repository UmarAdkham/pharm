// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { useLocation } from "react-router-dom";
import WholesaleProductReportTable from "../tables/product-report-table/product-report-table";

function WholesaleProductDetails() {
  const location = useLocation();
  const { products, pharmacyName, pharmacyId, wholesaleId } = location.state || [];

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <WholesaleProductReportTable
                products={products}
                pharmacyName={pharmacyName}
                pharmacy_id={pharmacyId}
                wholesale_id={wholesaleId}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default WholesaleProductDetails;
