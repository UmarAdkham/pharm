import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DoctorsDatabase from "./data/doctors-database";

const DeputyDirectorDoctorsDatabase = () => {
  const { columns, rows } = DoctorsDatabase();
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            База врачей
          </MDTypography>
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
          entriesPerPage={{ defaultValue: 1000 }}
        />
      </MDBox>
    </Card>
  );
};

export default DeputyDirectorDoctorsDatabase;
