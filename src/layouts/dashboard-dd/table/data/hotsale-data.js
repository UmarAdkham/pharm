import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MDBox from "components/MDBox";

export default function useHotsaleData(med_rep_id, month) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBonuses() {
      try {
        const response = await axiosInstance.get(
          `/dd/get-med-rep-product-plan-by-month-id/${med_rep_id}?month_number=${month}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const reports = response.data.plan;

        const columns = [
          { Header: "Название компании", accessor: "company_name", align: "left" },
          { Header: "Тип", accessor: "type", align: "left" },
          { Header: "Горячая продажа", accessor: "sale", align: "left" },
          { Header: "Факт", accessor: "fact", align: "left" },
        ];

        const rows = [];

        reports.forEach((report) => {
          report.pharmacy_hot_sale.forEach((pharmacy) => {
            rows.push({
              company_name: (
                <MDTypography variant="caption" fontWeight="medium">
                  {pharmacy.company_name}
                </MDTypography>
              ),
              type: (
                <MDTypography variant="caption" fontWeight="medium">
                  Аптека
                </MDTypography>
              ),
              sale: (
                <MDTypography variant="caption" fontWeight="medium">
                  {pharmacy.sale}
                </MDTypography>
              ),
              fact: (
                <MDTypography variant="caption" fontWeight="medium">
                  -
                </MDTypography>
              ),
            });
          });

          report.hospital_fact.forEach((hospital) => {
            rows.push({
              company_name: (
                <MDTypography variant="caption" fontWeight="medium">
                  {hospital.hospital_name}
                </MDTypography>
              ),
              type: (
                <MDTypography variant="caption" fontWeight="medium">
                  Больница
                </MDTypography>
              ),
              sale: (
                <MDTypography variant="caption" fontWeight="medium">
                  -
                </MDTypography>
              ),
              fact: (
                <MDTypography variant="caption" fontWeight="medium">
                  {hospital.fact}
                </MDTypography>
              ),
            });
          });
        });

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchBonuses();
  }, [accessToken, med_rep_id, month]);

  return data;
}
