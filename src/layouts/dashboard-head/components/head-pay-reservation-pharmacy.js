import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Switch from "@mui/material/Switch"; // Import the Switch component

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

function HeadPayReservationPharmacy() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const location = useLocation();
  const { reservationId, invoice_number, med_rep_id } = location.state || {}; // Add a default value

  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ color: "", content: "" });
  const [doctorProducts, setDoctorProducts] = useState([]);
  const [total, setTotal] = useState();
  const [debt, setDebt] = useState(0);
  const [remainderSum, setRemainderSum] = useState(0);
  const [unpayedProducts, setUnpayedProducts] = useState([]);
  const [productNames, setProductNames] = useState({});
  const [totalSum, setTotalSum] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state to track submission

  // Add a new state to track the bonus for each product
  const [bonusState, setBonusState] = useState(unpayedProducts.map(() => true));

  const fetchDoctors = async (monthNumber, productId) => {
    try {
      const response = await axiosInstance.get(
        `/dd/get-fact?month_number=${monthNumber}&med_rep_id=${med_rep_id}&product_id=${productId}`
      );
      const doctorsData = response.data.map((item) => ({
        doctor_id: item.doctor_id,
        doctor_name: item.doctor_name,
      }));
      return doctorsData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        const response = await axiosInstance.get(
          `/head/get-pharmacy-reservation-payed-remiainder/${reservationId}`
        );
        setDebt(response.data.debt);
        setRemainderSum(response.data.remiainder_sum);
        setUnpayedProducts(response.data.reservation_unpayed_products);
        const initialDoctorProducts = await Promise.all(
          response.data.reservation_unpayed_products.map(async (product) => {
            const doctors = await fetchDoctors(new Date().getMonth() + 1, product.product_id);
            return {
              product_id: product.product_id,
              doctor: null,
              monthNumber: new Date().getMonth() + 1,
              doctors: doctors,
            };
          })
        );
        setDoctorProducts(initialDoctorProducts);
        setBonusState(response.data.reservation_unpayed_products.map(() => true)); // Initialize bonus state
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
      const doctorProductTotal = unpayedProducts.reduce((acc, product) => {
        const quantity = parseInt(product.newQuantity || 0, 10);
        return acc + quantity * product.price;
      }, 0);

      setTotalSum(doctorProductTotal);
    };

    calculateTotalSum();
  }, [unpayedProducts]);

  const handleDoctorChange = (index, value) => {
    const updatedDoctorProducts = [...doctorProducts];
    updatedDoctorProducts[index] = { ...updatedDoctorProducts[index], doctor: value };
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleMonthChange = async (index, value) => {
    const updatedDoctorProducts = [...doctorProducts];
    updatedDoctorProducts[index] = {
      ...updatedDoctorProducts[index],
      monthNumber: value.value,
    };
    const doctors = await fetchDoctors(value.value, doctorProducts[index].product_id);
    updatedDoctorProducts[index].doctors = doctors;
    setDoctorProducts(updatedDoctorProducts);
  };

  const handleProductQuantityChange = (index, value) => {
    const updatedUnpayedProducts = [...unpayedProducts];
    updatedUnpayedProducts[index] = { ...updatedUnpayedProducts[index], newQuantity: value };
    setUnpayedProducts(updatedUnpayedProducts);
  };

  const handleBonusChange = (index, value) => {
    const newBonusState = [...bonusState];
    newBonusState[index] = value;
    setBonusState(newBonusState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !total ||
      !description ||
      !doctorProducts.some(({ doctor }, index) => doctor && unpayedProducts[index]?.newQuantity)
    ) {
      setMessage({ color: "error", content: "Пожалуйста, заполните все поля" });
      return;
    }

    if (parseInt(totalSum) > parseInt(total + remainderSum)) {
      setMessage({ color: "error", content: "Общая сумма не может быть больше указанной суммы" });
      return;
    }

    const objects = unpayedProducts
      .map((product, index) => ({
        ...product,
        originalIndex: index, // Add the original index directly in the map
      }))
      .filter((product) => product.newQuantity) // Filter based on newQuantity
      .map((product) => ({
        product_id: product.product_id,
        quantity: parseInt(product.newQuantity, 10),
        amount: parseInt(product.price, 10),
        bonus: bonusState[product.originalIndex], // Access bonus state using the original index
        month_number: doctorProducts[product.originalIndex].monthNumber, // Access doctorProducts using the original index
        doctor_id: doctorProducts[product.originalIndex].doctor?.doctor_id, // Access doctor_id using the original index
      }));

    const payload = {
      total: parseFloat(total) + parseFloat(remainderSum),
      objects,
      description,
    };

    console.log(payload);

    try {
      await axiosInstance.post(`head/pay-reservation/${reservationId}`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessage({ color: "success", content: "Поступление добавлено" });
      setIsSubmitting(true); // Disable the button after clicking

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
                Дебитор по с/ф № {invoice_number}: {debt?.toLocaleString("ru-RU")} сум
              </MDTypography>
            </MDBox>
            <MDBox mb={2}>
              <TextField
                label="Сумма"
                type="number"
                variant="outlined"
                value={total}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 0 || e.target.value === "") {
                    setTotal(e.target.value);
                  }
                }}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
                onWheel={(e) => e.target.blur()} // This prevents scroll from changing the value
              />
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="h6">
                Последний остаток {remainderSum.toLocaleString("ru-RU")} + сумма поступления{" "}
                {total?.toLocaleString("ru-RU") || 0} ={" "}
                {total
                  ? (parseFloat(remainderSum) + parseFloat(total)).toLocaleString("ru-RU")
                  : remainderSum.toLocaleString("ru-RU")}{" "}
                сум <br />
              </MDTypography>
            </MDBox>
            {unpayedProducts.map((product, index) => (
              <MDBox key={index} mb={2} border={1} borderRadius="lg" p={2}>
                <MDBox display="flex" justifyContent="space-between" mb={2}>
                  <Autocomplete
                    options={doctorProducts[index]?.doctors || []}
                    getOptionLabel={(option) => option.doctor_name}
                    value={doctorProducts[index]?.doctor || null}
                    onChange={(event, newValue) => handleDoctorChange(index, newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Доктор" variant="outlined" />
                    )}
                    fullWidth
                  />
                  <Autocomplete
                    options={russianMonths}
                    getOptionLabel={(option) => option.label}
                    value={
                      russianMonths.find(
                        (month) =>
                          month.value ===
                          (doctorProducts[index]?.monthNumber || new Date().getMonth() + 1)
                      ) || null
                    }
                    onChange={(event, newValue) => handleMonthChange(index, newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Месяц" variant="outlined" />
                    )}
                    fullWidth
                  />
                </MDBox>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <MDTypography variant="body1" style={{ marginRight: 16 }}>
                    Препарат:
                  </MDTypography>
                  <Autocomplete
                    options={[{ name: productNames[product.product_id] || product.product_id }]}
                    getOptionLabel={(option) => option.name}
                    value={{ name: productNames[product.product_id] || product.product_id }}
                    renderInput={(params) => <TextField {...params} variant="outlined" disabled />}
                    fullWidth
                  />
                </MDBox>
                <MDBox display="flex" justifyContent="space-between" mb={2}>
                  <MDTypography variant="h6">Кол-во: {product.quantity}</MDTypography>
                  <MDBox ml={2} flex={1}>
                    <TextField
                      type="number"
                      label="Новое Кол-во"
                      value={product.newQuantity || ""}
                      fullWidth
                      onChange={(e) => handleProductQuantityChange(index, e.target.value)}
                      InputProps={{ inputProps: { min: 0 } }}
                      onWheel={(e) => e.target.blur()} // This prevents scroll from changing the value
                    />
                  </MDBox>
                </MDBox>
                <MDBox display="flex" alignItems="center" mb={2}>
                  <MDTypography variant="h6" style={{ marginRight: 16 }}>
                    Бонус:
                  </MDTypography>
                  <Switch
                    checked={bonusState[index]}
                    onChange={(e) => handleBonusChange(index, e.target.checked)}
                  />
                </MDBox>
                <MDBox display="flex" justifyContent="space-between" mb={2}>
                  <MDTypography variant="h6">
                    Цена: {product.price?.toLocaleString("ru-RU")} сум
                  </MDTypography>
                  <MDTypography variant="h6">
                    Сумма:{" "}
                    {product.newQuantity
                      ? (product.newQuantity * product.price)?.toLocaleString("ru-RU")
                      : 0}{" "}
                    сум
                  </MDTypography>
                </MDBox>
              </MDBox>
            ))}
            <MDBox mb={2} display="flex" justifyContent="center">
              <MDTypography variant="h6">
                Общая сумма: {totalSum.toLocaleString("ru-RU")} сум
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
            <MDBox mt={4} mb={1} display="flex" justifyContent="space-between">
              <MDButton
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => navigate(-1)} // Navigate back to the previous page
                style={{ marginRight: "10px" }} // Add spacing between the buttons
              >
                Назад
              </MDButton>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                Добавить
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}

export default HeadPayReservationPharmacy;
