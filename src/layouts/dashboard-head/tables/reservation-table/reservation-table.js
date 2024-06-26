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

function ReservationTable() {
  const [medReps, setMedReps] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("all");
  const [selectedMedRep, setSelectedMedRep] = useState("all");
  const [reservationApiPath, setReservationApiPath] = useState("head/get-all-reservations");
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { columns, rows } = useReservationData(reservationApiPath);

  useEffect(() => {
    fetchMedicalReps();
    fetchPharmacies();
  }, []);

  const fetchMedicalReps = async () => {
    try {
      const response = await axiosInstance.get("https://it-club.uz/common/get-users", {
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
    // Update the API path based on the selected medical representative if necessary.
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
          <FormControl sx={{ m: 1, minWidth: 200 }} variant="outlined" size="small">
            <InputLabel>Медицинские представители</InputLabel>
            <Select
              label="Медицинские представители"
              sx={{ height: "45px" }}
              value={selectedMedRep}
              onChange={handleMedRepChange}
            >
              <MenuItem value="all">All</MenuItem>
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
              <MenuItem value="all">All</MenuItem>
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

export default ReservationTable;
