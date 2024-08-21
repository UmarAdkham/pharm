import Card from "@mui/material/Card";
import React from "react";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import useDoctorDatabaseData from "./data/doctor-database-data.js";

const DeputyDirectorDoctorsDatabase = () => {
  const { data, loading } = useDoctorDatabaseData();
  const { columns, rows } = data;

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
        {loading ? (
          <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress />
          </MDBox>
        ) : (
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
        )}
      </MDBox>
    </Card>
  );
};

export default DeputyDirectorDoctorsDatabase;
