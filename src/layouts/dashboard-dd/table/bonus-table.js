import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useBonusData from "./data/bonus-data";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  TextField,
} from "@mui/material";
import axiosInstance from "services/axiosInstance";

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

function DeputyDirectorBonusTable({ med_rep_id, med_rep_name }) {
  const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
  const [month, setMonth] = useState(currentMonth);
  const [products, setProducts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [totalBonus, setTotalBonus] = useState(0);

  const handleTotalBonus = useCallback((value) => {
    setTotalBonus(value);
  }, []);

  const { columns, rows } = useBonusData(
    med_rep_id,
    month,
    selectedProduct,
    selectedDoctor,
    handleTotalBonus
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const productResponse = await axiosInstance.get("common/get-product");
        setProducts(productResponse.data);

        const doctorResponse = await axiosInstance.get("mr/get-doctors");
        setDoctors(doctorResponse.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    }

    fetchData();
  }, []);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {med_rep_name} <br />
            <MDTypography variant="subtitle2" gutterBottom>
              Общая сумма бонуса {totalBonus} сум
            </MDTypography>
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
          <Autocomplete
            options={products}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => setSelectedProduct(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Продукт" variant="outlined" sx={{ mr: 2 }} />
            )}
            sx={{ minWidth: 150, mr: 2 }}
          />
          <Autocomplete
            options={doctors}
            getOptionLabel={(option) => option.full_name}
            onChange={(event, newValue) => setSelectedDoctor(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Доктор" variant="outlined" sx={{ mr: 2 }} />
            )}
            sx={{ minWidth: 150, mr: 2 }}
          />
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

DeputyDirectorBonusTable.propTypes = {
  med_rep_id: PropTypes.number.isRequired,
  med_rep_name: PropTypes.string.isRequired,
};

export default DeputyDirectorBonusTable;
