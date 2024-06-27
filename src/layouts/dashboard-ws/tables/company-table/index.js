import React from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useWholesaleCompanyData from "./data/company-data";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function WholesaleCompanyTable({ path, navigatePath }) {
  const navigate = useNavigate();
  const { columns, rows, EditWholesaleCompanyDialog } = useWholesaleCompanyData(path);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Оптовыe компании
          </MDTypography>
        </MDBox>
        <MDBox>
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={() => {
              navigate(navigatePath);
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
      {EditWholesaleCompanyDialog}
    </Card>
  );
}

WholesaleCompanyTable.propTypes = {
  path: PropTypes.string.isRequired,
  navigatePath: PropTypes.string,
};

export default WholesaleCompanyTable;
