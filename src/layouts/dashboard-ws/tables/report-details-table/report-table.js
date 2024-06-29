import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useWholesalePharmacyData from "./report-data";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function WholesaleReportTable({ wsCompanyName, wsCompanyId }) {
  const navigate = useNavigate();
  const [month, setMonth] = useState(6);
  const { columns, rows } = useWholesalePharmacyData(wsCompanyId, month);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Оптовая компания: &quot;{wsCompanyName}&quot;
          </MDTypography>
        </MDBox>
        <MDBox>
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={() => {
              navigate("/ws/add-sale");
            }}
          >
            Добавить продажу
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

WholesaleReportTable.propTypes = {
  wsCompanyName: PropTypes.string.isRequired,
  wsCompanyId: PropTypes.number.isRequired,
};

WholesaleReportTable.defaultProps = {
  isReport: false,
};

export default WholesaleReportTable;
