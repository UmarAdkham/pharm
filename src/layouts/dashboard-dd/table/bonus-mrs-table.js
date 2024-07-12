import React, { useState, useCallback } from "react";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useBonusMrsData from "./data/bonus-mrs-data";
import { Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

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

function DeputyDirectorBonusMrsTable() {
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [order, setOrder] = useState("");
  const [totalBonus, setTotalBonus] = useState(0);

  const handleTotalBonus = useCallback((value) => {
    setTotalBonus(value);
  }, []);

  const { data, loading } = useBonusMrsData(month, order, handleTotalBonus);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleSortToggle = () => {
    setOrder((prevOrder) => (prevOrder === "desc" || "" ? "asc" : "desc"));
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Список медицинских представителей
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          <FormControl variant="outlined" sx={{ minWidth: 120, mr: 2 }}>
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
          <Tooltip title="Сортировать по факт %">
            <IconButton onClick={handleSortToggle}>
              <SortIcon
                style={{ transform: order === "asc" ? "rotate(0deg)" : "rotate(180deg)" }}
              />
            </IconButton>
          </Tooltip>
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
              columns: data.columns,
              rows: data.rows,
            }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={{ defaultValue: 100 }}
          />
        )}
      </MDBox>
    </Card>
  );
}

export default DeputyDirectorBonusMrsTable;
