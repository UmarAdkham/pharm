import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useProductReportData from "./product-report-data";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function WholesaleProductReportTable({ pharmacyName, products }) {
  const navigate = useNavigate();
  const [month, setMonth] = useState(6);
  const { columns, rows } = useProductReportData(products);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {pharmacyName}
          </MDTypography>
        </MDBox>
        <MDBox>
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={() => {
              alert("In process");
            }}
          >
            Добавить продукт
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

WholesaleProductReportTable.propTypes = {
  pharmacyName: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
};

export default WholesaleProductReportTable;
