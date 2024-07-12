import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useDoctorsData from "./data/doctors-data";
import OverallValues from "../components/overall-doctor-values";

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

function DeputyDirectorDoctorsTable() {
  const currentMonth = new Date().getMonth() + 1;
  const [month, setMonth] = useState(currentMonth);
  const [products, setProducts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [regions, setRegions] = useState([]);
  const [medicalReps, setMedicalReps] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedMedRep, setSelectedMedRep] = useState(null);
  const [totalBonus, setTotalBonus] = useState(0);

  const handleTotalBonus = (value) => {
    setTotalBonus(value);
  };

  const { columns, rows, overall } = useDoctorsData(
    month,
    selectedProduct,
    selectedDoctor,
    selectedRegion,
    selectedMedRep,
    handleTotalBonus
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const productResponse = await axiosInstance.get("common/get-product");
        setProducts(productResponse.data);

        const doctorResponse = await axiosInstance.get("mr/get-doctors");
        setDoctors(doctorResponse.data);

        const regionResponse = await axiosInstance.get("common/get-regions");
        setRegions(regionResponse.data);

        const medicalRepsData = await axiosInstance.get("common/get-medical-representatives");
        setMedicalReps(medicalRepsData.data);
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
            Список врачей
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
          <Autocomplete
            options={regions}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => setSelectedRegion(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Регион" variant="outlined" sx={{ mr: 2 }} />
            )}
            sx={{ minWidth: 150, mr: 2 }}
          />
          <Autocomplete
            options={medicalReps}
            getOptionLabel={(option) => option.full_name}
            onChange={(event, newValue) => setSelectedMedRep(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Медицинские представители" variant="outlined" />
            )}
            sx={{ minWidth: 200, marginRight: 2 }}
          />
        </MDBox>
      </MDBox>
      <OverallValues overall={overall} />
      <MDBox>
        <DataTable
          table={{
            columns,
            rows,
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={{ defaultValue: 100 }}
        />
      </MDBox>
    </Card>
  );
}

export default DeputyDirectorDoctorsTable;
