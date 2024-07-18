import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Card,
  Button,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

// eslint-disable-next-line react/prop-types
const ProductPlanTable = ({ medRepId }) => {
  // Set default dates to the first and last date of the current month
  const currentMonth = dayjs().month(); // Current month (0-based index)
  const currentYear = dayjs().year(); // Current year
  const firstDate = dayjs(new Date(currentYear, currentMonth, 1)); // First date of the month
  const lastDate = dayjs(new Date(currentYear, currentMonth + 1, 0)); // Last date of the month

  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(firstDate);
  const [endDate, setEndDate] = useState(lastDate);
  const [month, setMonth] = useState(currentMonth + 1); // Current month
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get(
        `https://it-club.uz/dd/get-med-rep-product-plan-by-month`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            start_date: startDate ? startDate.format("YYYY-MM-DD") : "",
            end_date: endDate ? endDate.format("YYYY-MM-DD") : "",
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Не удалось получить данные:", error);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const getRowColor = (index) => {
    return index % 2 === 0 ? "#90EE90" : "#FF8C00";
  };

  // Calculate the total plan and plan_price
  const totalPlanAmount = data.plan
    ? data.plan.reduce((sum, item) => sum + item.plan_amount, 0)
    : 0;
  const totalPlanPrice = data.plan
    ? data.plan.reduce((sum, item) => sum + item.plan_price, 0).toLocaleString("ru-RU")
    : 0;

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            План по продукту
          </MDTypography>
        </MDBox>
        <MDBox>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DatePicker
                label="От"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                label="До"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </DemoContainer>
          </LocalizationProvider>
        </MDBox>
        <MDBox>
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={() => {
              navigate("/dd/add-product-plan", { state: medRepId });
            }}
          >
            Добавить
          </Button>
        </MDBox>
      </MDBox>
      <MDBox>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {data.plan && data.plan.length > 0 ? (
                <>
                  <TableRow style={{ backgroundColor: "#000" }}>
                    <TableCell style={{ color: "#fff" }}>Общ план: {totalPlanAmount}</TableCell>
                    <TableCell style={{ color: "#fff" }}>
                      План продажа: <br /> {totalPlanPrice} сум
                    </TableCell>
                    <TableCell style={{ color: "#fff" }}></TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: "#000" }}>
                    <TableCell style={{ color: "#fff" }}>Общ факт: {data.fact}</TableCell>
                    <TableCell style={{ color: "#fff" }}>
                      Факт продажа: <br /> {data.fact_price.toLocaleString("ru-RU")} сум
                    </TableCell>
                    <TableCell style={{ color: "#fff" }}></TableCell>
                  </TableRow>
                  {data.plan.map((product, index) => {
                    const totalDoctorFacts = product.doctor_plans.reduce(
                      (sum, doctor) => sum + doctor.fact,
                      0
                    );
                    return (
                      <React.Fragment key={index}>
                        <TableRow style={{ backgroundColor: getRowColor(index) }}>
                          <TableCell>
                            <b>{product.product}</b>
                          </TableCell>
                          <TableCell>План: {product.plan_amount}</TableCell>
                          <TableCell>Факт: {totalDoctorFacts}</TableCell>
                        </TableRow>
                        {product.doctor_plans.map((doctor, idx) => (
                          <TableRow key={idx} style={{ backgroundColor: getRowColor(index) }}>
                            <TableCell>Имя доктора ({doctor.doctor_name})</TableCell>
                            <TableCell>{doctor.monthly_plan}</TableCell>
                            <TableCell>{doctor.fact}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow style={{ backgroundColor: getRowColor(index) }}>
                          <TableCell>Вакант</TableCell>
                          <TableCell>{product.vakant}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </>
              ) : (
                <TableRow>
                  <TableCell>
                    Планов на от {startDate ? startDate.format("DD.MM.YYYY") : "начало периода"} до{" "}
                    {endDate ? endDate.format("DD.MM.YYYY") : "конец периода"} пока нет
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </MDBox>
    </Card>
  );
};

export default ProductPlanTable;
