/* eslint-disable prettier/prettier */
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import axiosInstance from "services/axiosInstance";

function HeadPayReservationHospital() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { reservationId } = location.state || {}; // Add a default value

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState({ color: "", content: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!amount || !description) {
      setMessage({ color: "error", content: "Пожалуйста, заполните все поля" });
      return;
    }

    const payload = {
      amount,
      description,
    };

    try {
      await axiosInstance.post(
        `head/pay-hospital-reservation/${reservationId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Поступление добавлено" });

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      setMessage({
        color: "error",
        content:
          "Не удалось добавить поступление. " +
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
            Поступление
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <TextField
                label="Сумма"
                type="number"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Комментарий"
                multiline
                rows={4}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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

export default HeadPayReservationHospital;
