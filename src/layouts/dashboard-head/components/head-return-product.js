/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

function HeadReturnProduct() {
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const { reservationId, reservationType } = location.state;
  const [products, setProducts] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });

  useEffect(() => {
    // Fetch all products to map product_id to product name
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://it-club.uz/common/get-product", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const productsData = response.data;
        const productNamesMap = productsData.reduce((acc, product) => {
          acc[product.id] = product.name;
          return acc;
        }, {});
        setProductNames(productNamesMap);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  useEffect(() => {
    // Fetch reservation unpaid products based on reservation type
    const fetchReservationProducts = async () => {
      try {
        const url =
          reservationType === "pharmacy"
            ? `https://it-club.uz/head/get-pharmacy-reservation-payed-remiainder/${reservationId}`
            : `https://it-club.uz/head/get-wholesale-reservation-payed-remiainder/${reservationId}`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const reservationProducts = response.data.reservation_unpayed_products.map((product) => ({
          ...product,
          name: productNames[product.product_id] || "Unknown Product",
        }));

        setProducts(reservationProducts);
      } catch (error) {
        console.error("Error fetching reservation products:", error);
      }
    };

    if (reservationId && reservationType) {
      fetchReservationProducts();
    }
  }, [reservationId, reservationType, productNames, accessToken]);

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedProduct || !quantity) {
      setMessage({ color: "error", content: "Please select a product and enter a quantity." });
      return;
    }

    try {
      await axios.post(
        `https://it-club.uz/head/return-product/${reservationId}?product_id=${selectedProduct.product_id}&quantity=${quantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Product returned successfully!" });

      // Optional: Redirect or other actions after a successful submission
      setTimeout(() => {
        setMessage({ color: "", content: "" });
      }, 2000);
    } catch (error) {
      console.error("Error returning product:", error);
      setMessage({
        color: "error",
        content:
          "Не удалось возвратить товар. " +
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
            Return Product
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.name}
                onChange={handleProductChange}
                renderInput={(params) => (
                  <TextField {...params} label="Select Product" variant="outlined" fullWidth />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Quantity"
                type="number"
                variant="outlined"
                value={quantity}
                onChange={handleQuantityChange}
                fullWidth
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Return Product
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default HeadReturnProduct;
