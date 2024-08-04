/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import axiosInstance from "services/axiosInstance";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

const russianMonths = [
  { label: "Январь", value: 1 },
  { label: "Февраль", value: 2 },
  { label: "Март", value: 3 },
  { label: "Апрель", value: 4 },
  { label: "Май", value: 5 },
  { label: "Июнь", value: 6 },
  { label: "Июль", value: 7 },
  { label: "Август", value: 8 },
  { label: "Сентябрь", value: 9 },
  { label: "Октябрь", value: 10 },
  { label: "Ноябрь", value: 11 },
  { label: "Декабрь", value: 12 },
];

function HeadPayReservationWholesale() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { reservationId } = location.state || {}; // Add a default value

  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [medReps, setMedReps] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorProducts, setDoctorProducts] = useState([
    {
      doctor: null,
      products: [],
      product: null,
      quantity: 0,
      amount: 0,
      monthNumber: new Date().getMonth() + 1,
    },
  ]);
  const [selectedMedRep, setSelectedMedRep] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [total, setTotal] = useState();
  const [debt, setDebt] = useState(0);
  const [remainderSum, setRemainderSum] = useState(0);
  const [unpayedProducts, setUnpayedProducts] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    const fetchMedReps = async () => {
      try {
        const response = await axiosInstance.get("/common/get-med-reps");
        setMedReps(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMedReps();
  }, []);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await axiosInstance.get(
          `https://it-club.uz/head/get-wholesale-reservation-payed-remiainder/${reservationId}`
        );
        setDebt(response.data.debt);
        setRemainderSum(response.data.remiainder_sum);
        setUnpayedProducts(response.data.reservation_unpayed_products);
      } catch (error) {
        console.log(error);
      }
    };

    if (reservationId) {
      fetchReservationData();
    }
  }, [reservationId]);

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const response = await axiosInstance.get("/common/get-product");
        const products = response.data;
        const productNamesMap = products.reduce((acc, product) => {
          acc[product.id] = product.name;
          return acc;
        }, {});
        setProductNames(productNamesMap);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProductNames();
  }, []);

  useEffect(() => {
    const calculateTotalSum = () => {
      const doctorProductTotal = doctorProducts.reduce((acc, doctorProduct) => {
        return acc + doctorProduct.quantity * doctorProduct.amount;
      }, 0);

      setTotalSum(doctorProductTotal);
    };

    calculateTotalSum();
  }, [unpayedProducts, doctorProducts]);

  const fetchPharmacies = async (medRepId) => {
    try {
      const response = await axiosInstance.get(`mr/get-pharmacy?user_id=${medRepId}`);
      setPharmacies(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDoctorsByMedRep = async (medRepId) => {
    try {
      const response = await axiosInstance.get(`mr/get-doctors-by-med-rep/${medRepId}`);
      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMedRepChange = (newValue) => {
    setSelectedMedRep(newValue);
    setSelectedPharmacy(null); // Clear selected pharmacy
    setDoctorProducts([
      {
        doctor: null,
        products: [],
        product: null,
        quantity: 0,
        amount: 0,
        monthNumber: new Date().getMonth() + 1,
      },
    ]); // Clear doctor products

    if (newValue) {
      fetchPharmacies(newValue.id);
      fetchDoctorsByMedRep(newValue.id);
    } else {
      setPharmacies([]);
      setDoctors([]);
    }
  };

  const handleDoctorChange = async (index, value) => {
    const updatedDoctorProducts = [...doctorProducts];
    updatedDoctorProducts[index].doctor = value;

    if (value) {
      try {
        const response = await axiosInstance.get(`/mr/doctor-attached-products/${value.id}`);
        updatedDoctorProducts[index].products = response.data.map((item) => item.product);
        setDoctorProducts(updatedDoctorProducts);
      } catch (error) {
        console.log(error);
      }
    } else {
      updatedDoctorProducts[index].products = [];
      setDoctorProducts(updatedDoctorProducts);
    }
  };

  const handleDoctorProductChange = (index, field, value) => {
    const updatedDoctorProducts = [...doctorProducts];
    updatedDoctorProducts[index][field] = value;
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleMonthChange = (index, value) => {
    const updatedDoctorProducts = [...doctorProducts];
    updatedDoctorProducts[index].monthNumber = value.value;
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleAddDoctorProduct = () => {
    setDoctorProducts([
      ...doctorProducts,
      {
        doctor: null,
        products: [],
        product: null,
        quantity: 1,
        amount: 1,
        monthNumber: new Date().getMonth() + 1,
      },
    ]);
  };

  const handleRemoveDoctorProduct = (index) => {
    const updatedDoctorProducts = doctorProducts.filter((_, i) => i !== index);
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !selectedMedRep ||
      !selectedPharmacy ||
      !total ||
      doctorProducts.some(
        ({ doctor, product, quantity, amount, monthNumber }) =>
          !doctor || !product || !quantity || !amount || !monthNumber
      )
    ) {
      setMessage({ color: "error", content: "Пожалуйста, заполните все поля" });
      return;
    }

    if (totalSum > (total+remainderSum)) {
      setMessage({ color: "error", content: "Общая сумма не может быть больше указанной суммы" });
      return;
    }

    const objects = doctorProducts.map(({ doctor, product, quantity, amount, monthNumber }) => ({
      doctor_id: doctor?.id,
      product_id: product?.id,
      quantity: parseInt(quantity, 10),
      amount: parseInt(amount, 10),
      month_number: monthNumber,
    }));

    const payload = {
      med_rep_id: selectedMedRep.id,
      pharmacy_id: selectedPharmacy.id,
      total: parseInt(total + remainderSum, 10),
      objects,
      description,
    };

    try {
      console.log(payload);
      await axiosInstance.post(`head/pay-wholesale-reservation/${reservationId}`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

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
    <DashboardLayout>
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
              <MDTypography variant="h6">
                Дебитор по с/ф № 2322: {debt?.toLocaleString("ru-RU")} сум
              </MDTypography>
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Сумма"
                type="number"
                variant="outlined"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="h6">
                Последний остаток {remainderSum} + сумма поступления{" "}
                {total?.toLocaleString("ru-RU") || 0} ={" "}
                {(remainderSum + total).toLocaleString("ru-RU") || 0} сум <br />
              </MDTypography>
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                options={medReps}
                getOptionLabel={(option) => option.full_name}
                value={selectedMedRep}
                onChange={(event, newValue) => handleMedRepChange(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Медицинский представитель" variant="outlined" />
                )}
                fullWidth
              />
            </MDBox>
            <MDBox mb={2}>
              <Tooltip
                title={selectedMedRep ? "" : "Сначала выберите медицинского представителя"}
                arrow
                disableHoverListener={!!selectedMedRep}
              >
                <span style={{ width: "100%" }}>
                  <Autocomplete
                    options={pharmacies}
                    getOptionLabel={(option) => option.company_name}
                    value={selectedPharmacy}
                    onChange={(event, newValue) => setSelectedPharmacy(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Аптека"
                        variant="outlined"
                        disabled={!selectedMedRep}
                      />
                    )}
                    fullWidth
                  />
                </span>
              </Tooltip>
            </MDBox>
            {unpayedProducts.map((product, index) => (
              <MDBox key={index} mb={2} border={1} borderRadius="lg" p={2}>
                <MDTypography variant="body1">
                  Препарат: {productNames[product.product_id] || product.product_id}
                </MDTypography>
                <MDBox display="flex" justifyContent="space-between">
                  <MDTypography variant="h6">Кол-во: {product.quantity}</MDTypography>
                  <MDTypography variant="h6">
                    Цена: {product.price?.toLocaleString("ru-RU")}
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={1}>
                  <MDTypography variant="h6">
                    Сумма: {(product.quantity * product.price)?.toLocaleString("ru-RU")}
                  </MDTypography>
                </MDBox>
              </MDBox>
            ))}
            {doctorProducts.map((doctorProduct, index) => (
              <div key={index}>
                <MDBox mb={2} display="flex" alignItems="center">
                  <Tooltip
                    title={selectedMedRep ? "" : "Сначала выберите медицинского представителя"}
                    arrow
                    disableHoverListener={!!selectedMedRep}
                  >
                    <span style={{ width: "100%" }}>
                      <Autocomplete
                        options={doctors}
                        getOptionLabel={(option) => option.full_name}
                        value={doctorProduct.doctor}
                        onChange={(event, newValue) => handleDoctorChange(index, newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Доктор"
                            variant="outlined"
                            disabled={!selectedMedRep}
                          />
                        )}
                        fullWidth
                      />
                    </span>
                  </Tooltip>
                  <Autocomplete
                    options={russianMonths}
                    getOptionLabel={(option) => option.label}
                    value={
                      russianMonths.find((month) => month.value === doctorProduct.monthNumber) ||
                      null
                    }
                    onChange={(event, newValue) => handleMonthChange(index, newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Месяц" variant="outlined" />
                    )}
                    fullWidth
                    style={{ marginLeft: 8, width: 200 }}
                  />
                </MDBox>
                <MDBox mb={2} display="flex" alignItems="center">
                  <Tooltip
                    title={doctorProduct.doctor ? "" : "Сначала выберите доктора"}
                    arrow
                    disableHoverListener={!!doctorProduct.doctor}
                  >
                    <span style={{ width: "100%" }}>
                      <Autocomplete
                        options={doctorProduct.products || []}
                        getOptionLabel={(option) => option.name}
                        value={doctorProduct.product}
                        onChange={(event, newValue) =>
                          handleDoctorProductChange(index, "product", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Продукт"
                            variant="outlined"
                            disabled={!doctorProduct.doctor}
                          />
                        )}
                        fullWidth
                      />
                    </span>
                  </Tooltip>
                  <TextField
                    type="number"
                    label="Количество"
                    variant="outlined"
                    value={doctorProduct.quantity}
                    onChange={(e) => handleDoctorProductChange(index, "quantity", e.target.value)}
                    InputProps={{ inputProps: { min: 1 } }}
                    style={{ marginLeft: 8, width: 200 }}
                  />
                  <TextField
                    type="number"
                    label="Цена"
                    variant="outlined"
                    value={doctorProduct.amount}
                    onChange={(e) => handleDoctorProductChange(index, "amount", e.target.value)}
                    InputProps={{ inputProps: { min: 1 } }}
                    style={{ marginLeft: 8, width: 200 }}
                  />
                  <MDTypography variant="h6" style={{ marginLeft: 8, width: 200 }}>
                    Сумма: {(doctorProduct.quantity * doctorProduct.amount).toLocaleString("ru-RU")}
                  </MDTypography>
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
            <MDBox mb={2} display="flex" justifyContent="center">
              <MDTypography variant="h6">
                Общая сумма: {totalSum?.toLocaleString("ru-RU")}
              </MDTypography>
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
    </DashboardLayout>
  );
}

export default HeadPayReservationWholesale;
