import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function useHospitalFactData(med_rep_id, month) {
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
          { Header: "Продукт", accessor: "product", align: "left" },
          { Header: "Факт", accessor: "fact", align: "left" },
        ];

        let totalFact = 0;
        const rows = [];

        reports.forEach((report) => {
          report.hospital_fact.forEach((hospital) => {
            totalFact += hospital.fact;
            rows.push({
              company_name: (
                <MDTypography variant="caption" fontWeight="medium">
                  {hospital.hospital_name}
                </MDTypography>
              ),
              product: (
                <MDTypography variant="caption" fontWeight="medium">
                  {report.product}
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

        setData({ columns, rows, totalFact });
      } catch (error) {
        console.error(error);
      }
    }

    fetchBonuses();
  }, [accessToken, med_rep_id, month]);

  return data;
}
