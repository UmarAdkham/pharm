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
import { Button, Autocomplete, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import OverallReservationValues from "layouts/dashboard-dd/components/overall-reserve-values";

const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import userRoles from "constants/userRoles";
import parseDate from "services/parseDate";

function ReservationTable() {
  const navigate = useNavigate();
  const [medReps, setMedReps] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [combinedEntities, setCombinedEntities] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("all");
  const [selectedMedRep, setSelectedMedRep] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [reservationApiPath, setReservationApiPath] = useState("head/get-all-reservations");
  const [filteredRows, setFilteredRows] = useState([]);
  const { accessToken, userRole } = useSelector((state) => state.auth);

  const { columns, rows, ExpiryDateDialogComponent, SnackbarComponent, overall } =
    useReservationData(reservationApiPath, selectedMonth);

  useEffect(() => {
    fetchMedicalReps();
    fetchPharmacies();
    fetchHospitals();
  }, []);

  useEffect(() => {
    combineEntities();
  }, [hospitals, pharmacies]);

  useEffect(() => {
    filterRows();
  }, [rows, selectedMedRep, selectedMonth, selectedEntity]);

  const fetchMedicalReps = async () => {
    try {
      const response = await axiosInstance.get("https://it-club.uz/common/get-med-reps", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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

  const fetchHospitals = async (medRepId) => {
    try {
      const response = await axiosInstance.get(`https://it-club.uz/mr/get-hospitals`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setHospitals(response.data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    }
  };

  const combineEntities = () => {
    const combined = [
      ...hospitals.map((hospital) => ({
        ...hospital,
        type: "Больница",
      })),
      ...pharmacies.map((pharmacy) => ({
        ...pharmacy,
        type: "Аптека",
      })),
    ];
    setCombinedEntities(combined);
  };

  const handlePharmacyChange = (event) => {
    const pharmacyId = event.target.value;
    setSelectedPharmacy(pharmacyId);
    setReservationApiPath(
      pharmacyId === "all" ? "head/get-all-reservations" : `head/get-reservations/${pharmacyId}`
    );
  };

  const handleMedRepChange = (event, newValue) => {
    setSelectedMedRep(newValue);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleEntityChange = (event, newValue) => {
    setSelectedEntity(newValue);
  };

  const filterRows = () => {
    let filtered = rows;
    if (selectedMedRep) {
      filtered = filtered.filter(
        (row) =>
          row.pharmacy?.med_rep?.full_name === selectedMedRep.full_name ||
          row.hospital?.med_rep?.full_name === selectedMedRep.full_name
      );
    }
    if (selectedMonth !== "") {
      filtered = filtered.filter(
        (row) =>
          parseDate(row.date_reservation.props.children).getMonth() === parseInt(selectedMonth)
      );
    }
    if (selectedEntity) {
      filtered = filtered.filter(
        (row) =>
          row.pharmacy?.company_name === selectedEntity.company_name ||
          row.hospital?.company_name === selectedEntity.company_name
      );
    }
    setFilteredRows(filtered);
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Брони
          </MDTypography>
        </MDBox>
        <MDBox display="flex" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Месяц</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              sx={{ height: "35px" }}
              label="Месяц"
            >
              <MenuItem value="">Все</MenuItem>
              {monthNames.map((month, index) => (
                <MenuItem key={index} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            options={medReps}
            getOptionLabel={(option) => option.full_name}
            value={selectedMedRep}
            onChange={handleMedRepChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Медицинские представители"
                variant="outlined"
                size="small"
              />
            )}
            sx={{ minWidth: 200 }}
          />
          <Autocomplete
            options={combinedEntities}
            getOptionLabel={(option) => `${option.company_name} (${option.type})`}
            value={selectedEntity}
            onChange={handleEntityChange}
            renderInput={(params) => (
              <TextField {...params} label="Выберите компанию" variant="outlined" size="small" />
            )}
            sx={{ minWidth: 200 }}
          />
          {userRole === userRoles.HEAD_OF_ORDERS && (
            <Button
              variant="contained"
              color="success"
              sx={{ color: "white" }}
              onClick={() => {
                navigate("/head/add-reservation");
              }}
            >
              Создать бронь
            </Button>
          )}
        </MDBox>
      </MDBox>
      <OverallReservationValues overall={overall} />
      <MDBox>
        <DataTable
          table={{
            columns,
            rows: filteredRows,
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={{ defaultValue: 100 }}
        />
      </MDBox>
      {ExpiryDateDialogComponent}
      {SnackbarComponent}
    </Card>
  );
}

export default ReservationTable;
