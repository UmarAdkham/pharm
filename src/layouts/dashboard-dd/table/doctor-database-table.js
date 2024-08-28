import Card from "@mui/material/Card";
import React, { useState } from "react";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import CircularProgress from "@mui/material/CircularProgress";
import useDoctorDatabaseData from "./data/doctor-database-data.js";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const DeputyDirectorDoctorsDatabase = () => {
  const { data, loading, doctorsWithPlansCount, doctorsWithoutPlansCount } =
    useDoctorDatabaseData();
  const { columns, rows } = data;

  const [filter, setFilter] = useState("all");

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            База врачей
          </MDTypography>
        </MDBox>
        {/* Combine Typography into a single line */}
        <MDBox
          display="flex"
          alignItems="center"
          sx={{ flexGrow: 1, justifyContent: "flex-end", gap: 2 }}
        >
          <MDTypography variant="h6" gutterBottom sx={{ whiteSpace: "nowrap" }}>
            С планами: {doctorsWithPlansCount}, Без планов: {doctorsWithoutPlansCount}
          </MDTypography>
          {/* FormControl with increased width */}
          <FormControl variant="outlined" size="medium" sx={{ minWidth: 150 }}>
            <InputLabel>Фильтр</InputLabel>
            <Select
              onChange={handleFilterChange}
              label="Фильтр"
              value={filter}
              sx={{ height: 40 }} // Increase the height for better visibility
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="planned">С планами</MenuItem>
              <MenuItem value="unplanned">Без планов</MenuItem>
            </Select>
          </FormControl>
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
              rows: rows.filter((row) => {
                if (filter === "all") return true;
                if (filter === "planned") return row.hasPlan;
                if (filter === "unplanned") return !row.hasPlan;
                return true;
              }),
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
