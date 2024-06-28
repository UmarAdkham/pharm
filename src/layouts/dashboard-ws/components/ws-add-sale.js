/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import axiosInstance from "services/axiosInstance";

function WholesaleAddSale() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [message, setMessage] = useState({ color: "", content: "" });

  useEffect(() => {
    async function fetchPharmacies() {
      try {
        const response = await axiosInstance.get(`mr/get-all-pharmacy`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPharmacies(response.data);
      } catch (error) {
        console.error("Failed to fetch pharmacies:", error);
      }
    }

    fetchPharmacies();
  }, [accessToken]);

  const handleNewClick = () => {
    navigate("/ws/add-pharmacy");
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!selectedPharmacy) {
      setMessage({ color: "error", content: "Пожалуйста, выберите аптеку" });
      return;
    }

    try {
      // Call the API with authorization header
      const response = await axios.post(
        `https://it-club.uz/wholesale/add-sale?pharmacy_id=${selectedPharmacy.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle a successful response
      setMessage({ color: "success", content: "Продажа добавлена" });

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось добавить продажу. " +
          (error.response?.data?.detail ||
            "Проверьте правильность введенных данных и попробуйте снова."),
      });
    }
  };

  return (
    <BasicLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Добавить продажу
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <Autocomplete
                options={pharmacies}
                getOptionLabel={(option) => option.company_name}
                onChange={(event, newValue) => setSelectedPharmacy(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Выберите аптеку" variant="outlined" fullWidth />
                )}
              />
            </MDBox>
            <MDBox mt={1} mb={1} display="flex" justifyContent="space-between">
              <MDButton variant="outlined" color="info" onClick={handleNewClick}>
                Новый
              </MDButton>
              <MDButton variant="gradient" color="info" type="submit">
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default WholesaleAddSale;
