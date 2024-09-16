import React, { useEffect } from "react";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { Autocomplete, Button, TextField, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  setMedReps,
  setPharmacies,
  setHospitals,
  setWholesales,
} from "../../../../redux/reservation/reservationSlice";
import useReservationData from "./data/reservation-data";
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import OverallReservationValues from "layouts/dashboard-dd/elements/overall-reserve-values";
import userRoles from "constants/userRoles";

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

const entityTypes = [
  { label: "Все", value: "all" },
  { label: "Аптеки", value: "pharmacy" },
  { label: "Больницы", value: "hospital" },
  { label: "Оптовики", value: "wholesale" },
];

function ReservationTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reservations, filters, medReps, pharmacies, hospitals, wholesales } = useSelector(
    (state) => state.reservation
  );
  const {
    selectedMonth,
    selectedPharmacy,
    selectedMedRep,
    selectedEntity,
    selectedType,
    invoiceNumber,
  } = filters;
  const { accessToken, userRole } = useSelector((state) => state.auth);

  const { columns, rows, expired_debt, ExpiryDateDialogComponent, SnackbarComponent } =
    useReservationData();

  useEffect(() => {
    fetchMedicalReps();
    fetchPharmacies();
    fetchHospitals();
    fetchWholesales();
  }, []);

  const fetchMedicalReps = async () => {
    try {
      const response = await axiosInstance.get("common/get-med-reps", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setMedReps(response.data));
    } catch (error) {
      console.error("Failed to fetch medical representatives", error);
    }
  };

  const fetchPharmacies = async () => {
    try {
      const response = await axiosInstance.get("mr/get-all-pharmacy", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setPharmacies(response.data));
    } catch (error) {
      console.error("Failed to fetch pharmacies", error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axiosInstance.get(`mr/get-hospitals`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setHospitals(response.data));
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    }
  };

  const fetchWholesales = async () => {
    try {
      const response = await axiosInstance.get(`ws/get-wholesales`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch(setWholesales(response.data));
    } catch (error) {
      console.error("Failed to fetch wholesales", error);
    }
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    dispatch(setFilters({ selectedMonth: newMonth }));
  };

  const handleMedRepChange = (event, newValue) => {
    dispatch(setFilters({ selectedMedRep: newValue }));
  };

  const handleEntityChange = (event, newValue) => {
    dispatch(setFilters({ selectedEntity: newValue }));
  };

  const handleTypeChange = (event) => {
    dispatch(setFilters({ selectedType: event.target.value }));
  };

  const handleInvoiceNumberChange = (event) => {
    dispatch(setFilters({ invoiceNumber: event.target.value }));
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDTypography variant="h6" gutterBottom>
          Брони
        </MDTypography>
        <MDBox display="flex" alignItems="center" gap={2}>
          {/* Month Selector */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Месяц</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              sx={{ height: "35px" }}
              label="Месяц"
            >
              {monthNames.map((month, index) => (
                <MenuItem key={index} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* MedRep Selector */}
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

          {/* Entity Selector */}
          <Autocomplete
            options={hospitals.concat(pharmacies, wholesales)}
            getOptionLabel={(option) =>
              `${option.type === "Оптовик" ? option.name : option.company_name} (${option.type})`
            }
            value={selectedEntity}
            onChange={handleEntityChange}
            renderInput={(params) => (
              <TextField {...params} label="Выберите компанию" variant="outlined" size="small" />
            )}
            sx={{ minWidth: 200 }}
          />

          {/* Entity Type Selector */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Тип</InputLabel>
            <Select
              value={selectedType}
              onChange={handleTypeChange}
              sx={{ height: "35px" }}
              label="Тип"
            >
              {entityTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Invoice Number Input */}
          <TextField
            label="Номер счета"
            type="number"
            value={invoiceNumber}
            onChange={handleInvoiceNumberChange}
            size="small"
            sx={{ minWidth: 150 }}
          />

          {/* Create Reservation Button */}
          {userRole === userRoles.HEAD_OF_ORDERS && (
            <Button
              variant="contained"
              color="success"
              sx={{ color: "white", minWidth: 100 }}
              onClick={() => {
                navigate("/head/add-reservation");
              }}
            >
              Создать бронь
            </Button>
          )}
        </MDBox>
      </MDBox>

      <OverallReservationValues overall={{ expired_debt, rows }} />
      <MDBox>
        <DataTable
          table={{ columns, rows }}
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
