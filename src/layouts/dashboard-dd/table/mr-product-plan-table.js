import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Card,
  Button,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProductPlanTable = ({ medRepId }) => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(1);
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

  useEffect(() => {
    fetchData(month);
  }, [month]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const getRowColor = (index) => {
    return index % 2 == 0 ? "#90EE90" : "#FF8C00";
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Plan by Product
          </MDTypography>
        </MDBox>
        <MDBox>
          <FormControl variant="outlined">
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              onChange={handleMonthChange}
              label="Filter by month"
              sx={{ height: "45px", width: "200px" }}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {new Date(0, index).toLocaleString("default", { month: "long" })}
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
              {data.map((product, index) => (
                <React.Fragment key={index}>
                  <TableRow key={index} style={{ backgroundColor: getRowColor(index) }}>
                    <TableCell>{product.product}</TableCell>
                    <TableCell>Plan {product.amount}</TableCell>
                    <TableCell>
                      Fact {product.doctor_plans.reduce((acc, curr) => acc + curr.fact, 0)}
                    </TableCell>
                  </TableRow>
                  {product.doctor_plans.map((doctor, idx) => (
                    <TableRow key={idx} style={{ backgroundColor: getRowColor(index) }}>
                      <TableCell>Doctor name ({doctor.doctor_name})</TableCell>
                      <TableCell>{doctor.monthly_plan}</TableCell>
                      <TableCell>{doctor.fact}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow style={{ backgroundColor: getRowColor(index) }}>
                    <TableCell>Vakant</TableCell>
                    <TableCell>{product.vakant}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MDBox>
    </Card>
  );
};

export default ProductPlanTable;
