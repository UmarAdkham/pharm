import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MDBox from "../../../../components/MDBox";

export default function useBonusData(
  med_rep_id,
  month,
  selectedProduct,
  selectedDoctor,
  handleTotalBonus,
  handleTotalPaidBonus
) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  const memoizedHandleTotalBonus = useCallback(handleTotalBonus, [handleTotalBonus]);
  const memoizedHandleTotalPaidBonus = useCallback(handleTotalPaidBonus, [handleTotalPaidBonus]);
  const memoizedSelectedProduct = useMemo(() => selectedProduct, [selectedProduct]);
  const memoizedSelectedDoctor = useMemo(() => selectedDoctor, [selectedDoctor]);

  useEffect(() => {
    async function fetchBonuses() {
      try {
        const response = await axiosInstance.get(
          `/dd/get-doctor-bonus-by-med-rep-id/${med_rep_id}?month_number=${month}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const reports = response.data.filter((report) => {
          return (
            (!memoizedSelectedProduct || report.product_name === memoizedSelectedProduct.name) &&
            (!memoizedSelectedDoctor || report.doctor_name === memoizedSelectedDoctor.full_name)
          );
        });

        const totalBonus = reports.reduce((sum, item) => sum + item.bonus_amount, 0);
        memoizedHandleTotalBonus(totalBonus);
        const totalPaidBonus = reports.reduce((sum, item) => sum + item.bonus_payed, 0);
        memoizedHandleTotalPaidBonus(totalPaidBonus);

        const columns = [
          { Header: "Доктор", accessor: "doctor", align: "left" },
          { Header: "Продукт", accessor: "product", align: "left" },
          { Header: "Месячный план", accessor: "monthly_plan", align: "left" },
          { Header: "Факт", accessor: "fact", align: "left" },
          { Header: "Факт %", accessor: "fact_percent", align: "left" },
          { Header: "Факт поступ.", accessor: "fact_postupleniya", align: "left" },
          { Header: "Бонус", accessor: "bonus", align: "left" },
          { Header: "Бонус выплачен", accessor: "bonus_paid", align: "left" },
          { Header: "Остаток бонуса", accessor: "bonus_left", align: "left" },
          { Header: "Прединвест", accessor: "pre_investment", align: "left" },
          { Header: "Действие", accessor: "action", align: "center" },
        ];

        const rows = reports.map((report) => ({
          doctor: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.doctor_name}
            </MDTypography>
          ),
          product: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.product_name}
            </MDTypography>
          ),
          monthly_plan: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.monthly_plan?.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          fact: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.fact?.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          fact_percent: (
            <MDTypography variant="caption" fontWeight="medium">
              {(report.fact_postupleniya * 100) / report.monthly_plan}%
            </MDTypography>
          ),
          fact_postupleniya: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.fact_postupleniya?.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          bonus: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.bonus_amount?.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          bonus_paid: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.bonus_payed?.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          bonus_left: (
            <MDTypography variant="caption" fontWeight="medium">
              {(report.bonus_amount - report.bonus_payed).toLocaleString("ru-RU")}
            </MDTypography>
          ),
          pre_investment: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.pre_investment?.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          action: (
            <MDBox>
              <Button
                variant="contained"
                color="success"
                sx={{ color: "white" }}
                onClick={() => {
                  navigate("/dd/add-bonus", {
                    state: {
                      bonusId: report.bonus_id,
                      totalBonus: report.bonus_amount,
                      remainingBonus: report.bonus_amount - report.bonus_payed,
                    },
                  });
                }}
                style={{ cursor: "pointer" }}
              >
                Бонус
              </Button>
              <Button
                variant="contained"
                color="success"
                sx={{ marginLeft: "5px", color: "white" }}
                onClick={() => {
                  navigate("/dd/bonus-history", {
                    state: { bonusId: report.bonus_id, doctorName: report.doctor_name },
                  });
                }}
              >
                История бонусов
              </Button>
            </MDBox>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchBonuses();
  }, [
    accessToken,
    med_rep_id,
    month,
    memoizedSelectedProduct,
    memoizedSelectedDoctor,
    memoizedHandleTotalBonus,
    memoizedHandleTotalPaidBonus,
  ]);

  return data;
}
