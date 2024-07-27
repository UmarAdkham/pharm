import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { Outlet } from "react-router-dom";
import WholesaleProductTable from "../tables/product-table";

function WholesaleManagerProducts() {
  const { wholesale_id } = useParams();

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <WholesaleProductTable
                path={`/ws/get-wholesale-products/${wholesale_id}`}
                navigatePath={`/ws/add-reservation/${wholesale_id}`}
              />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default WholesaleManagerProducts;
