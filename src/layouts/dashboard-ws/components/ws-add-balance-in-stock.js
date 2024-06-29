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

function WholesaleAddBalanceInStock({ wholesale_id }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [description, setDescription] = useState("");
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

    async function fetchManufacturers() {
      try {
        const response = await axiosInstance.get(
          "https://it-club.uz/common/get-manufactured-company"
        );
        setManufacturers(response.data);
      } catch (error) {
        console.error("Failed to fetch manufacturers", error);
      }
    }

    async function fetchProducts() {
      try {
        const response = await axiosInstance.get("https://it-club.uz/common/get-product");
        setAvailableProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    }

    fetchPharmacies();
    fetchManufacturers();
    fetchProducts();
  }, [accessToken]);

  const handleNewClick = () => {
    navigate("/ws/add-pharmacy");
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!selectedPharmacy || !selectedManufacturer || selectedProducts.length === 0) {
      setMessage({ color: "error", content: "Пожалуйста, заполните все поля" });
      return;
    }

    const productsData = selectedProducts.map((product) => ({
      product_id: product.id,
      quantity: product.quantity || 0,
    }));

    const requestData = {
      products: productsData,
      pharmacy_id: selectedPharmacy.id,
      wholesale_id,
      factory_id: selectedManufacturer.id,
      description,
    };

    try {
      // Call the API with authorization header
      await axiosInstance.post("https://it-club.uz/mr/add-balance-in-stock", requestData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Handle a successful response
      setMessage({ color: "success", content: "Баланс успешно добавлен!" });

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Failed to add balance", error);
      setMessage({
        color: "error",
        content: error.response?.data?.detail || "Не удалось добавить баланс.",
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
            Добавить остаток на складе
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox display="flex" alignItems="center" mb={2}>
              <Autocomplete
                options={pharmacies}
                getOptionLabel={(option) => option.company_name}
                onChange={(event, newValue) => setSelectedPharmacy(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Выберите аптеку" variant="outlined" fullWidth />
                )}
                sx={{ flexGrow: 1, mr: 2 }}
              />
              <MDButton variant="outlined" color="info" onClick={handleNewClick}>
                Новый
              </MDButton>
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                options={manufacturers}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => setSelectedManufacturer(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Производственная компания"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                multiple
                options={availableProducts}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => setSelectedProducts(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Продукты" variant="outlined" fullWidth />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Описание"
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputProps={{ style: { resize: "none" } }}
              />
            </MDBox>
            <MDBox mt={1} mb={1} display="flex" justifyContent="space-between">
              <MDButton variant="gradient" color="info" type="submit" fullWidth>
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

WholesaleAddBalanceInStock.propTypes = {
  wholesale_id: PropTypes.number.isRequired,
};

export default WholesaleAddBalanceInStock;
