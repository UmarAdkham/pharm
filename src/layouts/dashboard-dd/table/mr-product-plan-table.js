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
  IconButton,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import PlanModal from "../dialogs/modal/shared/plan-modal";

// eslint-disable-next-line react/prop-types
const ProductPlanTable = ({ medRepId }) => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();
  const firstDate = dayjs(new Date(currentYear, currentMonth, 1));
  const lastDate = dayjs(new Date(currentYear, currentMonth + 1, 0));

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [planToUpdate, setPlanToUpdate] = useState({});

  const [startDate, setStartDate] = useState(firstDate);
  const [endDate, setEndDate] = useState(lastDate);
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchData = async (startDate, endDate) => {
    try {
      const { data } = await axiosInstance.get(
        `/dd/get-med-rep-product-plan-by-month-id/${medRepId}`,
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
      setData(data);
    } catch (error) {
      console.error("Не удалось получить данные:", error);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const totalPlanAmount = data.plan
    ? data.plan.reduce((sum, item) => sum + item.plan_amount, 0)
    : 0;
  const totalPlanPrice = data.plan
    ? data.plan.reduce((sum, item) => sum + item.plan_price, 0).toLocaleString("ru-RU")
    : 0;

  // Calculate the total hospital fact across all products
  const totalHospitalFact = data.plan
    ? data.plan.reduce(
        (sum, item) =>
          sum +
          item.hospital_fact.reduce((hospitalSum, hospital) => hospitalSum + hospital.fact, 0),
        0
      )
    : 0;

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            План по продукту
          </MDTypography>
        </MDBox>
        <MDBox sx={{ overflowX: "auto" }}>
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
                    <TableCell colSpan={1} style={{ color: "#fff" }}>
                      Общ план: {totalPlanAmount}
                    </TableCell>
                    <TableCell colSpan={3} style={{ color: "#fff" }}>
                      План продажа: <br /> {totalPlanPrice} сум
                    </TableCell>
                    <TableCell style={{ color: "#fff" }}></TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: "#000" }}>
                    <TableCell colSpan={1} style={{ color: "#fff" }}>
                      Общ факт: {data.fact}
                    </TableCell>
                    <TableCell colSpan={1} style={{ color: "#fff" }}>
                      Общ Больн. факт: {totalHospitalFact}
                    </TableCell>
                    <TableCell colSpan={2} style={{ color: "#fff" }}>
                      Факт продажа: <br /> {data.fact_price.toLocaleString("ru-RU")} сум
                    </TableCell>
                    <TableCell style={{ color: "#fff" }}></TableCell>
                  </TableRow>
                  <TableRow style={{ backgroundColor: "#000" }}>
                    <TableCell colSpan={1} style={{ color: "#fff" }}>
                      Общ факт поступ: {data.fact_postupleniya}
                    </TableCell>
                    <TableCell colSpan={3} style={{ color: "#fff" }}>
                      Факт поступ. продажа: <br />{" "}
                      {data.fact_postupleniya_price.toLocaleString("ru-RU")} сум
                    </TableCell>
                    <TableCell style={{ color: "#fff" }}></TableCell>
                  </TableRow>
                  {data.plan
                    .sort((a, b) => a.product.localeCompare(b.product))
                    .map((product, index) => {
                      const totalDoctorFacts = product.doctor_plans.reduce(
                        (sum, doctor) => sum + doctor.fact,
                        0
                      );
                      const totalDoctorFactPostupleniya = product.doctor_plans.reduce(
                        (sum, doctor) => sum + doctor.fact_postupleniya,
                        0
                      );

                      // Calculate the total hospital facts for this particular product
                      const totalHospitalFactsForProduct = product.hospital_fact.reduce(
                        (sum, hospital) => sum + hospital.fact,
                        0
                      );

                      return (
                        <React.Fragment key={index}>
                          <TableRow style={{ backgroundColor: "#90EE90" }}>
                            <TableCell>
                              <b>{product.product}</b>
                              <div>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpen();
                                    setPlanToUpdate({
                                      plan_id: product.id,
                                      plan_amount: product.plan_amount,
                                      product: product.product,
                                    });
                                  }}
                                  aria-label="update"
                                >
                                  <DriveFileRenameOutlineOutlinedIcon />
                                </IconButton>
                              </div>
                            </TableCell>
                            <TableCell>План: {product.plan_amount}</TableCell>
                            <TableCell>Факт: {totalDoctorFacts}</TableCell>
                            <TableCell>Факт поступ: {totalDoctorFactPostupleniya}</TableCell>
                            <TableCell>Больн. факт: {totalHospitalFactsForProduct}</TableCell>
                          </TableRow>
                          {product.doctor_plans.map((doctor, idx) => (
                            <TableRow key={idx} style={{ backgroundColor: "#90EE90" }}>
                              <TableCell>Имя доктора ({doctor.doctor_name})</TableCell>
                              <TableCell>{doctor.monthly_plan}</TableCell>
                              <TableCell>{doctor.fact}</TableCell>
                              <TableCell colSpan={2}>{doctor.fact_postupleniya}</TableCell>
                            </TableRow>
                          ))}
                          {product.hospital_fact.map((hospital, idx) => (
                            <TableRow key={idx} style={{ backgroundColor: "#fff3b5" }}>
                              <TableCell colSpan={4}>Больница: {hospital.hospital_name}</TableCell>
                              <TableCell>Факт: {hospital.fact}</TableCell>
                            </TableRow>
                          ))}
                          {product.pharmacy_hot_sale.map((pharmacy, idx) => (
                            <TableRow key={idx} style={{ backgroundColor: "#c9daff" }}>
                              <TableCell colSpan={4}>Аптека: {pharmacy.company_name}</TableCell>
                              <TableCell>Продажа: {pharmacy.sale}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow style={{ backgroundColor: "#a1a1a1" }}>
                            <TableCell colSpan={4}>Вакант</TableCell>
                            <TableCell>{product.vakant}</TableCell>
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
      <PlanModal open={open} handleClose={handleClose} planToUpdate={planToUpdate} />
    </Card>
  );
};

export default ProductPlanTable;
