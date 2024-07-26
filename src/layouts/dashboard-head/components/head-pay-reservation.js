/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import axiosInstance from "services/axiosInstance";

function HeadPayReservation() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { reservationId, type } = location.state || {}; // Add a default value
  const isPharmacy = type === "pharmacy";

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [doctors, setDoctors] = useState([]);
  const [products, setProducts] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [medReps, setMedReps] = useState([]);
  const [doctorProducts, setDoctorProducts] = useState([
    { doctor: null, product: null, quantity: 1 },
  ]);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [selectedMedRep, setSelectedMedRep] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("https://it-club.uz/mr/get-doctors");
        setDoctors(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://it-club.uz/common/get-product");
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPharmacies = async () => {
      try {
        const response = await axios.get("https://it-club.uz/mr/get-all-pharmacy");
        setPharmacies(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMedReps = async () => {
      try {
        const response = await axios.get("https://it-club.uz/common/get-med-reps");
        setMedReps(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctors();
    fetchProducts();
    if (type === "wholesale") {
      fetchPharmacies();
      fetchMedReps();
    }
  }, [type]);

  const handleDoctorProductChange = (index, field, value) => {
    const updatedDoctorProducts = [...doctorProducts];
    updatedDoctorProducts[index][field] = value;
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleAddDoctorProduct = () => {
    setDoctorProducts([...doctorProducts, { doctor: null, product: null, quantity: 1 }]);
  };

  const handleRemoveDoctorProduct = (index) => {
    const updatedDoctorProducts = doctorProducts.filter((_, i) => i !== index);
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const objects = doctorProducts.map(({ doctor, product, quantity }) => ({
      amount: quantity,
      doctor_id: doctor?.id,
      product_id: product?.id,
    }));

    const payload =
      type === "wholesale"
        ? {
            med_rep_id: selectedMedRep?.id,
            pharmacy_id: selectedPharmacy?.id,
            objects,
            description,
          }
        : {
            objects,
            description,
          };

    try {
      const response = await axiosInstance.post(
        `head/pay${isPharmacy ? "" : "-hospital"}-reservation/${reservationId}`,
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
              <MDInput
                type="number"
                label="Сумма"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </MDBox>
            {type === "wholesale" && (
              <>
                <MDBox mb={2}>
                  <Autocomplete
                    options={medReps}
                    getOptionLabel={(option) => option.full_name}
                    value={selectedMedRep}
                    onChange={(event, newValue) => setSelectedMedRep(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Выберите медицинского представителя"
                        variant="outlined"
                      />
                    )}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2}>
                  <Autocomplete
                    options={pharmacies}
                    getOptionLabel={(option) => option.company_name}
                    value={selectedPharmacy}
                    onChange={(event, newValue) => setSelectedPharmacy(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Выберите аптеку" variant="outlined" />
                    )}
                    fullWidth
                  />
                </MDBox>
              </>
            )}
            {doctorProducts.map((doctorProduct, index) => (
              <div key={index}>
                <MDBox mb={2}>
                  <Autocomplete
                    options={doctors}
                    getOptionLabel={(option) => option.full_name}
                    value={doctorProduct.doctor}
                    onChange={(event, newValue) =>
                      handleDoctorProductChange(index, "doctor", newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Выберите доктора" variant="outlined" />
                    )}
                    fullWidth
                  />
                </MDBox>
                <MDBox mb={2} display="flex" alignItems="center">
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.name}
                    value={doctorProduct.product}
                    onChange={(event, newValue) =>
                      handleDoctorProductChange(index, "product", newValue)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Выберите продукт" variant="outlined" />
                    )}
                    fullWidth
                  />
                  <TextField
                    type="number"
                    label="Количество"
                    variant="outlined"
                    value={doctorProduct.quantity}
                    onChange={(e) => handleDoctorProductChange(index, "quantity", e.target.value)}
                    InputProps={{ inputProps: { min: 1 } }}
                    style={{ marginLeft: 8, width: 100 }}
                  />
                  {index > 0 && (
                    <IconButton onClick={() => handleRemoveDoctorProduct(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </MDBox>
              </div>
            ))}
            <MDBox display="flex" justifyContent="center" mb={2}>
              <IconButton onClick={handleAddDoctorProduct} color="default">
                <AddIcon />
              </IconButton>
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

export default HeadPayReservation;
