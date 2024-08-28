import React, { useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import useHospitalFactData from "./data/hospital-fact-data";

const months = [
  { name: "Январь", value: 1 },
  { name: "Февраль", value: 2 },
  { name: "Март", value: 3 },
  { name: "Апрель", value: 4 },
  { name: "Май", value: 5 },
  { name: "Июнь", value: 6 },
  { name: "Июль", value: 7 },
  { name: "Август", value: 8 },
  { name: "Сентябрь", value: 9 },
  { name: "Октябрь", value: 10 },
  { name: "Ноябрь", value: 11 },
  { name: "Декабрь", value: 12 },
];

function DeputyDirectorHospitalFactTable({ med_rep_id }) {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
  const [month, setMonth] = useState(currentMonth);

  const { columns, rows, totalFact } = useHospitalFactData(med_rep_id, month);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Больница
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          {/* Adjusted to uppercase and added margin */}
          <MDTypography variant="h6" gutterBottom sx={{ ml: 3, mr: 3, textTransform: "uppercase" }}>
            Общ факт: {totalFact?.toLocaleString("ru-RU")}
          </MDTypography>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="month-select-label">Месяц</InputLabel>
            <Select
              labelId="month-select-label"
              value={month}
              onChange={handleMonthChange}
              label="Месяц"
              sx={{ height: 45 }}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

DeputyDirectorHospitalFactTable.propTypes = {
  med_rep_id: PropTypes.number.isRequired,
};

export default DeputyDirectorHospitalFactTable;
