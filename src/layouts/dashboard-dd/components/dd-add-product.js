/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import userRoles from "constants/userRoles";

function DeputyDirectorAddProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount_price, setDiscountPrice] = useState("");
  const [man_company_id, setManufacturerCompanyId] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [manufacturerCompanies, setManufacturerCompanies] = useState([]);
  const [message, setMessage] = useState({ color: "", content: "" });
  const user = location.state || {};

  useEffect(() => {
    const fetchManufacturerCompanies = async () => {
      try {
        const response = await axios.get(`https://heartly1.uz/common/get-manufactured-company`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const manufacturerCompanies = response.data;
        setManufacturerCompanies(manufacturerCompanies);
      } catch (error) {
        console.error("Failed to fetch manufacturer companies:", error);
      }
    };

    fetchManufacturerCompanies();
  }, [accessToken]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`https://heartly1.uz/common/get-product-category`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const categories = response.data;
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch product categories:", error);
      }
    };

    fetchCategories();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Define the request payload
    const productData = {
      name,
      price,
      discount_price,
      man_company_id,
      category_id,
    };

    try {
      // Call the API with authorization header
      const response = await axios.post("https://heartly1.uz/common/add-product", productData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Handle a successful response
      setMessage({ color: "success", content: "Product added successfully" });

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Failed to add product. " +
          (error.response?.data?.detail || "Please check your input and try again."),
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
            Add Product
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Price"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Discount price"
                fullWidth
                value={discount_price}
                onChange={(e) => setDiscountPrice(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="manufactuer-companies-label">Manufacturer Companies</InputLabel>
                <Select
                  labelId="manufactuer-companies-label"
                  value={man_company_id}
                  label="Manufacturer Companies"
                  onChange={(e) => setManufacturerCompanyId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {manufacturerCompanies.map((mc) => (
                    <MenuItem key={mc.id} value={mc.id}>
                      {mc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Product Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category_id}
                  label="Product Category"
                  onChange={(e) => setCategoryId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Add
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default DeputyDirectorAddProduct;
