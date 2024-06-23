// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
import { Outlet } from "react-router-dom";
import FactoriesTable from "../tables/factories-table";
import { useState } from "react";
import WarehousesTable from "../tables/warehouses-table";

function HeadOfOrdersFactoryWarehouses() {
  const [selectedFactory, setSelectedFactory] = useState({}); // initially an empty object

  const handleRowClick = (selectedRowValue) => {
    setSelectedFactory(selectedRowValue);
  };

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <FactoriesTable
                handleRowClick={handleRowClick}
                selectedFactoryId={selectedFactory.id}
              />
            </Grid>
            <Grid item xs={8}>
              {selectedFactory.id ? (
                <WarehousesTable
                  factoryId={selectedFactory.id}
                  factoryName={selectedFactory.name}
                />
              ) : (
                <MDTypography variant="h6" gutterBottom>
                  Выберите производственную компанию
                </MDTypography>
              )}
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
}

export default HeadOfOrdersFactoryWarehouses;
