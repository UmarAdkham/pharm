/* eslint-disable prettier/prettier */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import axiosInstance from "services/axiosInstance";

function HeadSetDiscount() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { reservationId, type } = location.state || "";

  const [discountRate, setDiscountRate] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!reservationId) {
      setMessage({
        color: "error",
        content: "Reservation ID не найден.",
      });
      return;
    }

    try {
      console.log(discountRate);

      const response = await axiosInstance.post(
        `https://it-club.uz/head/update-${
          type === "pharmacy" ? "" : `${type}-`
        }reservation-discount/${reservationId}?discount=${discountRate}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Скидка установлена" });

      setTimeout(() => {
        // navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось установить скидку. " +
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
            Установить скидку
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <TextField
                label="Скидка (%)"
                type="text"
                variant="outlined"
                value={discountRate}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and a single dot
                  if (/^\d*\.?\d*$/.test(value)) {
                    setDiscountRate(value);
                  }
                }}
                fullWidth
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Установить скидку
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default HeadSetDiscount;
