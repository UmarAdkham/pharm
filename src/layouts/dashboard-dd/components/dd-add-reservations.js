/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import axiosInstance from "services/axiosInstance";
import BasicLayout from "layouts/authentication/components/BasicLayout";

function ReservationAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([{ product: null, quantity: "" }]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [discountable, setDiscountable] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission
  const [message, setMessage] = useState({ color: "", content: "" });

  useEffect(() => {
    async function fetchPharmacies() {
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
    }

    async function fetchManufacturers() {
      try {
        const response = await axiosInstance.get("common/get-manufactured-company");
        setManufacturers(response.data);
      } catch (error) {
        console.error("Failed to fetch manufacturers", error);
      }
    }

    async function fetchProducts() {
      try {
        const response = await axiosInstance.get("common/get-product", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAvailableProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    }

    fetchPharmacies();
    fetchManufacturers();
    fetchProducts();
  }, [accessToken]);

  const handleProductChange = (index, value) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].product = value;
    setSelectedProducts(newSelectedProducts);
  };

  const handleQuantityChange = (index, value) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts[index].quantity = value;
    setSelectedProducts(newSelectedProducts);
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { product: null, quantity: "" }]);
  };

  const handleRemoveProduct = (index) => {
    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (
      !selectedPharmacy ||
      !selectedManufacturer ||
      !invoiceNumber ||
      selectedProducts.some((sp) => !sp.product || !sp.quantity)
    ) {
      setMessage({ color: "error", content: "Пожалуйста, заполните все поля" });
      return;
    }

    const productsData = selectedProducts.map((sp) => ({
      product_id: sp.product.id,
      quantity: sp.quantity,
    }));

    const requestData = {
      manufactured_company_id: selectedManufacturer.id,
      invoice_number: invoiceNumber,
      discountable: discountable,
      products: productsData,
    };

    try {
      // Call the API with authorization header
      const response = await axiosInstance.post(
        `mr/reservation/${selectedPharmacy.id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response);
      // Handle a successful response
      setMessage({ color: "success", content: "Баланс успешно добавлен!" });
      setIsSubmitting(true); // Disable the button after clicking

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
            Добавить бронь
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
                  <TextField {...params} label="Аптека" variant="outlined" fullWidth />
                )}
              />
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
              <TextField
                label="Номер счета"
                variant="outlined"
                fullWidth
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" mb={2}>
              <Switch
                checked={discountable}
                onChange={(e) => setDiscountable(e.target.checked)}
                inputProps={{ "aria-label": "discountable switch" }}
              />
              <MDTypography variant="button" fontWeight="medium">
                Скидка доступна
              </MDTypography>
            </MDBox>
            {selectedProducts.map((selectedProduct, index) => (
              <MDBox key={index} display="flex" alignItems="center" mb={1}>
                <Autocomplete
                  options={availableProducts}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => handleProductChange(index, newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Продукт" variant="outlined" fullWidth />
                  )}
                  value={selectedProduct.product}
                  sx={{ width: "70%", mr: 1 }}
                />
                <TextField
                  label="Количество"
                  variant="outlined"
                  value={selectedProduct.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  sx={{ width: "25%", mr: 1 }}
                />
                <IconButton onClick={() => handleRemoveProduct(index)}>
                  <DeleteIcon />
                </IconButton>
              </MDBox>
            ))}
            <MDBox display="flex" justifyContent="space-around" mb={2}>
              <IconButton onClick={handleAddProduct}>
                <AddIcon />
              </IconButton>
            </MDBox>
            <MDBox mt={1} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="gradient"
                color="info"
                type="submit"
                fullWidth
                disabled={isSubmitting}
              >
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default ReservationAdd;
