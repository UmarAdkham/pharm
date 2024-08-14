import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDButton from "components/MDButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function DeputyDirectorUpdateDoctor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor_id } = location.state || "";
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [doctorData, setDoctorData] = useState({
    full_name: "",
    contact1: "",
    contact2: "",
    email: "",
    birth_date: "",
    category_id: null,
    speciality_id: null,
    medical_organization_id: null,
  });

  const [categories, setCategories] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [medicalOrganizations, setMedicalOrganizations] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch existing doctor data
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axiosInstance.get(`/mr/get-doctor/${doctor_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = response.data;
        setDoctorData({
          full_name: data.full_name,
          contact1: data.contact1,
          contact2: data.contact2,
          email: data.email,
          birth_date: data.birth_date,
          category_id: data.category?.id || null,
          speciality_id: data.speciality?.id || null,
          medical_organization_id: data.medical_organization?.id || null,
        });
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };
    fetchDoctorData();
  }, [doctor_id, accessToken]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("common/get-category");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [accessToken]);

  // Fetch Specialities
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const response = await axiosInstance.get("common/get-speciality");
        setSpecialities(response.data);
      } catch (error) {
        console.error("Error fetching specialities:", error);
      }
    };
    fetchSpecialities();
  }, [accessToken]);

  // Fetch Medical Organizations
  useEffect(() => {
    const fetchMedicalOrganizations = async () => {
      try {
        const response = await axiosInstance.get("common/get-medical-organization");
        setMedicalOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching medical organizations:", error);
      }
    };
    fetchMedicalOrganizations();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields are filled
    if (
      !doctorData.full_name ||
      !doctorData.contact1 ||
      !doctorData.contact2 ||
      !doctorData.email ||
      !doctorData.birth_date ||
      !doctorData.category_id ||
      !doctorData.speciality_id ||
      !doctorData.medical_organization_id
    ) {
      setSnackbar({ open: true, message: "Все поля должны быть заполнены", severity: "error" });
      return;
    }

    try {
      await axiosInstance.patch(`mr/update-doctor/${doctor_id}`, doctorData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbar({
        open: true,
        message: "Информация о враче успешно обновлена",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({ open: true, message: "Ошибка при обновлении данных врача", severity: "error" });
      console.error("Ошибка при обновлении данных врача:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <DashboardLayout>
      <Card>
        <MDBox p={3}>
          <MDTypography variant="h5" mb={3}>
            Обновить информацию о враче
          </MDTypography>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <TextField
                label="Полное имя"
                variant="outlined"
                fullWidth
                value={doctorData.full_name}
                onChange={(e) => setDoctorData({ ...doctorData, full_name: e.target.value })}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Контакт 1"
                variant="outlined"
                fullWidth
                value={doctorData.contact1}
                onChange={(e) => setDoctorData({ ...doctorData, contact1: e.target.value })}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Контакт 2"
                variant="outlined"
                fullWidth
                value={doctorData.contact2}
                onChange={(e) => setDoctorData({ ...doctorData, contact2: e.target.value })}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Электронная почта"
                variant="outlined"
                fullWidth
                value={doctorData.email}
                onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Дата рождения"
                type="date"
                variant="outlined"
                fullWidth
                value={doctorData.birth_date}
                onChange={(e) => setDoctorData({ ...doctorData, birth_date: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                options={categories}
                getOptionLabel={(option) => option.name}
                value={
                  categories.find((category) => category.id === doctorData.category_id) || null
                }
                onChange={(event, newValue) => {
                  setDoctorData({ ...doctorData, category_id: newValue?.id || null });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Категория" variant="outlined" fullWidth />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                options={specialities}
                getOptionLabel={(option) => option.name}
                value={
                  specialities.find((speciality) => speciality.id === doctorData.speciality_id) ||
                  null
                }
                onChange={(event, newValue) => {
                  setDoctorData({ ...doctorData, speciality_id: newValue?.id || null });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Специальность" variant="outlined" fullWidth />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                options={medicalOrganizations}
                getOptionLabel={(option) => option.name}
                value={
                  medicalOrganizations.find(
                    (org) => org.id === doctorData.medical_organization_id
                  ) || null
                }
                onChange={(event, newValue) => {
                  setDoctorData({
                    ...doctorData,
                    medical_organization_id: newValue?.id || null,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Медицинская организация"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </MDBox>
            <MDBox mt={3}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Обновить
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default DeputyDirectorUpdateDoctor;
