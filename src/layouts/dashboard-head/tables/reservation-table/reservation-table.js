import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useReservationData from "./data/reservation-data";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function ReservationTable() {
  const [medReps, setMedReps] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("all");
  const [selectedMedRep, setSelectedMedRep] = useState("all");
  const [reservationApiPath, setReservationApiPath] = useState("head/get-all-reservations");
  const [filteredRows, setFilteredRows] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const currentMonth = dayjs().month(); // Current month (0-based index)
  const currentYear = dayjs().year(); // Current year
  const firstDate = dayjs(new Date(currentYear, currentMonth, 1)); // First date of the month
  const lastDate = dayjs(new Date(currentYear, currentMonth + 1, 0)); // Last date of the month

  const [startDate, setStartDate] = useState(firstDate);
  const [endDate, setEndDate] = useState(lastDate);

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(
        `https://it-club.uz/dd/get-med-rep-product-plan-by-month`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            start_date: startDate ? startDate.format("YYYY-MM-DD") : "",
            end_date: endDate ? endDate.format("YYYY-MM-DD") : "",
          },
        }
      );
      response.data;
    } catch (error) {
      console.error("Не удалось получить данные:", error);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const { columns, rows, ExpiryDateDialogComponent, SnackbarComponent } =
    useReservationData(reservationApiPath);

  useEffect(() => {
    fetchMedicalReps();
    fetchPharmacies();
  }, []);

  useEffect(() => {
    filterRows();
  }, [rows, selectedMedRep]);

  const fetchMedicalReps = async () => {
    try {
      const response = await axiosInstance.get(
        "https://it-club.uz/common/get-medical-representatives",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMedReps(response.data);
    } catch (error) {
      console.error("Failed to fetch medical representatives", error);
    }
  };

  const fetchPharmacies = async () => {
    try {
      const response = await axiosInstance.get("https://it-club.uz/mr/get-all-pharmacy", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPharmacies(response.data);
    } catch (error) {
      console.error("Failed to fetch pharmacies", error);
    }
  };

  const handlePharmacyChange = (event) => {
    const pharmacyId = event.target.value;
    setSelectedPharmacy(pharmacyId);
    setReservationApiPath(
      pharmacyId === "all" ? "head/get-all-reservations" : `head/get-reservations/${pharmacyId}`
    );
  };

  const handleMedRepChange = (event) => {
    const medRepId = event.target.value;
    setSelectedMedRep(medRepId);
  };

  const filterRows = () => {
    if (selectedMedRep === "all") {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) => row.pharmacy.med_rep.id === parseInt(selectedMedRep));
      setFilteredRows(filtered);
    }
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Резервации
          </MDTypography>
        </MDBox>
        <MDBox display="flex" gap={2}>
          <MDBox>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  label="От"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                />
                <DatePicker
                  label="До"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </MDBox>
          <FormControl sx={{ m: 1, minWidth: 200 }} variant="outlined" size="small">
            <InputLabel>Медицинские представители</InputLabel>
            <Select
              label="Медицинские представители"
              sx={{ height: "45px" }}
              value={selectedMedRep}
              onChange={handleMedRepChange}
            >
              <MenuItem value="all">Все</MenuItem>
              {medReps.map((rep) => (
                <MenuItem key={rep.id} value={rep.id}>
                  {rep.full_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 200 }} variant="outlined" size="small">
            <InputLabel>Аптеки</InputLabel>
            <Select
              sx={{ height: "45px" }}
              value={selectedPharmacy}
              onChange={handlePharmacyChange}
              label="Аптеки"
            >
              <MenuItem value="all">Все</MenuItem>
              {pharmacies.map((pharmacy) => (
                <MenuItem key={pharmacy.id} value={pharmacy.id}>
                  {pharmacy.company_name}
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
            rows: filteredRows,
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
      {ExpiryDateDialogComponent}
      {SnackbarComponent}
    </Card>
  );
}

export default ReservationTable;
