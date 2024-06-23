/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import axiosInstance from "services/axiosInstance";

// eslint-disable-next-line react/prop-types
function DeputyDirectorAddProductPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [amount, setAmount] = useState();
  const [product_id, setProductId] = useState();
  const [month, setMonth] = useState();
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ color: "", content: "" });
  const med_rep_id = location.state;

  const months = [
    { id: 1, name: "Январь" },
    { id: 2, name: "Февраль" },
    { id: 3, name: "Март" },
    { id: 4, name: "Апрель" },
    { id: 5, name: "Май" },
    { id: 6, name: "Июнь" },
    { id: 7, name: "Июль" },
    { id: 8, name: "Август" },
    { id: 9, name: "Сентябрь" },
    { id: 10, name: "Октябрь" },
    { id: 11, name: "Ноябрь" },
    { id: 12, name: "Декабрь" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(`common/get-product`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const productData = response.data;
        setProducts(productData);
      } catch (error) {
        console.error("Не удалось получить продукты:", error);
      }
    };

    fetchProducts();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Define the request payload
    const productPlanData = {
      product_id,
      amount,
      month,
      med_rep_id,
    };

    console.log(productPlanData);

    try {
      // Call the API with authorization header
      const response = await axiosInstance.post(
        "dd/add-user-product-plan",
        productPlanData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle a successful response
      setMessage({ color: "success", content: "Продукт план успешно добавлен" });

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось добавить продукт план. " +
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
            Добавить продукт план
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="number"
                label="Количество"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="product-label">Продукт</InputLabel>
                <Select
                  labelId="product-label"
                  value={product_id}
                  label="Продукт"
                  onChange={(e) => setProductId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="month-label">Месяц</InputLabel>
                <Select
                  labelId="month-label"
                  value={month}
                  label="Месяц"
                  onChange={(e) => setMonth(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {months.map((month) => (
                    <MenuItem key={month.id} value={month.id}>
                      {month.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default DeputyDirectorAddProductPlan;
