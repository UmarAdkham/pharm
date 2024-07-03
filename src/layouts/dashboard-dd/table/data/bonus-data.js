import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useBonusData(med_rep_id, month, selectedProduct, selectedDoctor) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchBonuses() {
      try {
        const response = await axiosInstance.get(
          `https://it-club.uz/dd/get-doctor-bonus-by-med-rep-id/${med_rep_id}?month_number=${month}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const reports = response.data.filter((report) => {
          return (
            (!selectedProduct || report.product_name === selectedProduct.name) &&
            (!selectedDoctor || report.doctor_name === selectedDoctor.full_name)
          );
        });

        const columns = [
          { Header: "Доктор", accessor: "doctor", align: "left" },
          { Header: "Продукт  ", accessor: "product", align: "left" },
          { Header: "Месячный план", accessor: "monthly_plan", align: "left" },
          { Header: "Факт", accessor: "fact", align: "left" },
          { Header: "Факт_процент", accessor: "fact_percent", align: "left" },
          { Header: "Бонус", accessor: "bonus", align: "left" },
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
              {report.monthly_plan}
            </MDTypography>
          ),
          fact: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.fact}
            </MDTypography>
          ),
          fact_percent: (
            <MDTypography variant="caption" fontWeight="medium">
              {(report.fact * 100) / report.monthly_plan}%
            </MDTypography>
          ),
          bonus: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.bonus_amount}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchBonuses();
  }, [accessToken, med_rep_id, month, selectedProduct, selectedDoctor]);

  return data;
}
