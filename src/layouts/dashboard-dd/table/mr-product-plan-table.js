import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Card,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";

// Function to get month names in Russian
const getRussianMonthNames = () => {
  return Array.from({ length: 12 }, (_, index) =>
    new Date(0, index).toLocaleString("ru-RU", { month: "long" })
  );
};

// eslint-disable-next-line react/prop-types
const ProductPlanTable = ({ medRepId }) => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchData = async (month) => {
    try {
      const response = await axiosInstance.get(
        `https://it-club.uz/dd/get-med-rep-product-plan-by-month-id/${medRepId}?month_number=${month}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Не удалось получить данные:", error);
    }
  };

  console.log(data);
  useEffect(() => {
    fetchData(month);
  }, [month]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const getRowColor = (index) => {
    return index % 2 === 0 ? "#90EE90" : "#FF8C00";
  };

  const russianMonthNames = getRussianMonthNames();

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            План по продукту
          </MDTypography>
        </MDBox>
        <MDBox>
          <FormControl variant="outlined">
            <InputLabel>Месяц</InputLabel>
            <Select
              value={month}
              onChange={handleMonthChange}
              label="Фильтр по месяцу"
              sx={{ height: "45px", width: "200px" }}
            >
              {russianMonthNames.map((monthName, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {monthName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                data.plan.map((product, index) => (
                  <React.Fragment key={index}>
                    <TableRow key={index} style={{ backgroundColor: getRowColor(index) }}>
                      <TableCell>{product.product}</TableCell>
                      <TableCell>План {product.plan_amount}</TableCell>
                      <TableCell>Факт {data.fact_price}</TableCell>
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
                ))
              ) : (
                <TableRow>
                  <TableCell>Планов на {russianMonthNames[month - 1]} пока нет</TableCell>
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
