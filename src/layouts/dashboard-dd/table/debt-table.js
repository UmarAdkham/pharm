import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";
import { Autocomplete, Button, TextField, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

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
import useDebtData from "./data/debt-data";
import OverallDebtValues from "../elements/overall-debt-values";

const entityTypes = [
  { label: "Все", value: "all" },
  { label: "Аптеки", value: "pharmacy" },
  { label: "Больницы", value: "hospital" },
  { label: "Оптовики", value: "wholesale" },
];

function DebtTable() {
  const navigate = useNavigate();
  const [medReps, setMedReps] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [wholesales, setWholesales] = useState([]);
  const [combinedEntities, setCombinedEntities] = useState([]);
  const [selectedMedRep, setSelectedMedRep] = useState(null);
  const [debtFilter, setDebtFilter] = useState("all"); // New state for debt filter

  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [reservationApiPath, setReservationApiPath] = useState(
    `head/get-reservations-debt?month_number=${currentMonth}`
  );
  const [filteredRows, setFilteredRows] = useState([]);
  const { accessToken, userRole } = useSelector((state) => state.auth);

  const { columns, rows, expired_debt, ExpiryDateDialogComponent, SnackbarComponent } =
    useDebtData(reservationApiPath);

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
  }, [rows, selectedMedRep, selectedEntity, selectedType, debtFilter]);

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

      const seen = new Set();
      const uniquePharmacies = response.data.filter((pharmacy) => {
        const duplicate = seen.has(pharmacy.company_name);
        seen.add(pharmacy.company_name);
        return !duplicate;
      });

      setPharmacies(uniquePharmacies);
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

  const handleMedRepChange = (event, newValue) => {
    setSelectedMedRep(newValue);
  };

  const handleMonthChange = (event) => {
    const newMonth = event.target.value;
    setSelectedMonth(newMonth);
    setReservationApiPath(`head/get-reservations-debt?month_number=${newMonth}`);
  };

  const handleDebtFilterChange = (event) => {
    setDebtFilter(event.target.value);
  };

  const handleEntityChange = (event, newValue) => {
    setSelectedEntity(newValue);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleInvoiceNumberChange = (event) => {
    setInvoiceNumber(event.target.value);
  };

  const handleSearchByInvoiceNumber = () => {
    filterRows();
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
    if (invoiceNumber) {
      filtered = filtered.filter((row) =>
        row.invoice_number_value.toString().includes(invoiceNumber)
      );
    }

    // Apply the debt filter logic
    if (debtFilter === "expired") {
      filtered = filtered.filter((row) => row.expiredDebtValue > 0);
    }

    setFilteredRows(filtered);
  };

  const overall = {
    numberOfInvoices: filteredRows.length,
    invoiceAmount: filteredRows.reduce((sum, r) => sum + parseFloat(r.total_payable_with_nds), 0),
    profit: filteredRows.reduce(
      (sum, r) => sum + parseFloat(r.profit?.props?.children.replace(/\D/g, "")),
      0
    ),
    debt: filteredRows.reduce((sum, r) => sum + parseFloat(r.isChecked ? 0 : r.debtValue), 0),
    promo: filteredRows.reduce(
      (sum, r) => sum + parseFloat(r.promo?.props?.children.replace(/\D/g, "") || 0),
      0
    ),
    expired_debt,
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Дебиторы
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 100 }}>
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
          <Autocomplete
            options={medReps}
            getOptionLabel={(option) => option.full_name}
            value={selectedMedRep}
            onChange={handleMedRepChange}
            renderInput={(params) => (
              <TextField {...params} label="МП" variant="outlined" size="small" />
            )}
            sx={{ minWidth: 150 }}
          />
          <Autocomplete
            options={combinedEntities}
            getOptionLabel={(option) =>
              `${option.type === "Оптовик" ? option.name : option.company_name} (${option.type})`
            }
            value={selectedEntity}
            onChange={handleEntityChange}
            renderInput={(params) => (
              <TextField {...params} label="Котрагент" variant="outlined" size="small" />
            )}
            sx={{ minWidth: 150 }}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
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
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Фильтр долга</InputLabel>
            <Select
              value={debtFilter}
              onChange={handleDebtFilterChange}
              sx={{ height: "35px" }}
              label="Фильтр долга"
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="expired">Просроченные</MenuItem>
            </Select>
          </FormControl>
          <MDBox display="flex" alignItems="center" gap={1}>
            <TextField
              label="Номер счета"
              type="number"
              value={invoiceNumber}
              onChange={handleInvoiceNumberChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  handleSearchByInvoiceNumber();
                }
              }}
              size="small"
              sx={{ minWidth: 100 }}
            />
            <Tooltip title={invoiceNumber ? "" : "Сперва введите номер счета"} arrow>
              <span>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSearchByInvoiceNumber}
                  sx={{ height: "35px", color: "white" }}
                  disabled={!invoiceNumber}
                >
                  Поиск
                </Button>
              </span>
            </Tooltip>
          </MDBox>
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

      <OverallDebtValues overall={overall} filteredRows={filteredRows} />
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

export default DebtTable;
