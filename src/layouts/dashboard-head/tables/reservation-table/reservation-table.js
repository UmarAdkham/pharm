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
import { Autocomplete, Button, TextField } from "@mui/material";
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

import userRoles from "constants/userRoles";
import parseDate from "services/parseDate";

const entityTypes = [
  { label: "Все", value: "all" },
  { label: "Аптеки", value: "pharmacy" },
  { label: "Больницы", value: "hospital" },
  { label: "Оптовики", value: "wholesale" },
];

function ReservationTable() {
  const navigate = useNavigate();
  const [medReps, setMedReps] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [wholesales, setWholesales] = useState([]);
  const [combinedEntities, setCombinedEntities] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("all");
  const [selectedMedRep, setSelectedMedRep] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [reservationApiPath, setReservationApiPath] = useState("head/get-all-reservations");
  const [filteredRows, setFilteredRows] = useState([]);
  const { accessToken, userRole } = useSelector((state) => state.auth);

  const { columns, rows, ExpiryDateDialogComponent, SnackbarComponent, overall } =
    useReservationData(reservationApiPath, selectedMonth);

  useEffect(() => {
    fetchMedicalReps();
    fetchPharmacies();
    fetchHospitals();
    fetchWholesales();
  }, []);

  useEffect(() => {
    combineEntities();
  }, [hospitals, pharmacies, wholesales]);

  useEffect(() => {
    filterRows();
  }, [rows, selectedMedRep, selectedMonth, selectedEntity, selectedType]);

  const fetchMedicalReps = async () => {
    try {
      const response = await axiosInstance.get("common/get-med-reps", {
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
      const response = await axiosInstance.get("mr/get-all-pharmacy", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPharmacies(response.data);
    } catch (error) {
      console.error("Failed to fetch pharmacies", error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const response = await axiosInstance.get(`mr/get-hospitals`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setHospitals(response.data);
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
    }
  };

  const fetchWholesales = async () => {
    try {
      const response = await axiosInstance.get(`ws/get-wholesales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setWholesales(response.data);
    } catch (error) {
      console.error("Failed to fetch wholesales", error);
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
      ...wholesales.map((wholesale) => ({
        ...wholesale,
        type: "Оптовик",
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

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
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
      if (selectedEntity.type === "Оптовик") {
        filtered = filtered.filter((row) => row.wholesale?.company_name === selectedEntity.name);
      } else {
        filtered = filtered.filter(
          (row) =>
            row.pharmacy?.company_name === selectedEntity.company_name ||
            row.hospital?.company_name === selectedEntity.company_name
        );
      }
    }
    if (selectedType !== "all") {
      filtered = filtered.filter((row) => row[selectedType.toLowerCase()] !== undefined);
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
