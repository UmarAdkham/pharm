import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useWarehouseData from "./data/warehouse-data";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function WarehousesTable({ factoryId }) {
  const { columns, rows } = useWarehouseData(`head/get-current-factory-warehouse/${factoryId}`);
  const navigate = useNavigate();

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            В складе
          </MDTypography>
        </MDBox>
        <MDBox>
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={() => {
              navigate("/head/add-warehouse-data", { state: factoryId });
            }}
          >
            Добавить
          </Button>
        </MDBox>
      </MDBox>
      <MDBox>
        <DataTable
          table={{
            columns,
            rows,
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

WarehousesTable.propTypes = {
  factoryId: PropTypes.number.isRequired,
};

export default WarehousesTable;
