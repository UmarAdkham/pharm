// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import FactoriesTable from "../tables/factories-table";
import { useState } from "react";
import WarehousesTable from "../tables/warehouses-table";

function HeadOfOrdersFactoryWarehouses() {
  const [selectedFactoryId, setSelectedFactoryId] = useState(1); // display ZUMA by default

  const handleRowClick = (selectedRowValue) => {
    setSelectedFactoryId(selectedRowValue);
  };

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <FactoriesTable handleRowClick={handleRowClick} />
            </Grid>
            <Grid item xs={8}>
              <WarehousesTable factoryId={selectedFactoryId} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default HeadOfOrdersFactoryWarehouses;
