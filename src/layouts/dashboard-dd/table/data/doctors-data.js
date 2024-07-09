import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useDoctorsData(
  month,
  selectedProduct,
  selectedDoctor,
  selectedRegion,
  selectedMedRep,
  handleTotalBonus
) {
  const [data, setData] = useState({ columns: [], rows: [], overall: {} });
  const accessToken = useSelector((state) => state.auth.accessToken);

  const previousDataRef = useRef(data);

  useEffect(() => {
    const getRowBackgroundColor = (factPercent) => {
      if (factPercent >= 75) {
        return "#81c784";
      } else if (factPercent >= 50) {
        return "#f2cc45";
      } else {
        return "#f77c48";
      }
    };

    async function fetchBonuses() {
      try {
        const regionQueryParam = selectedRegion ? `&region_id=${selectedRegion.id}` : "";
        const medRepQueryParam = selectedMedRep ? `&med_rep_id=${selectedMedRep.id}` : "";

        const response = await axiosInstance.get(
          `dd/get-fact?month_number=${month}${regionQueryParam}${medRepQueryParam}`,
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

        const overall = {
          numberOfDoctors: reports.length,
          monthlyPlan: reports.reduce((sum, item) => sum + item.plan_price, 0),
          fact: reports.reduce((sum, item) => sum + item.fact_price, 0),
          factPercent:
            reports.reduce((sum, item) => sum + (item.fact_price * 100) / item.plan_price, 0) /
            reports.length,
          bonus: reports.reduce((sum, item) => sum + item.bonus_amount, 0),
          bonusPaid: reports.reduce((sum, item) => sum + item.bonus_payed, 0),
          bonusLeft: reports.reduce((sum, item) => sum + (item.bonus_amount - item.bonus_payed), 0),
        };

        handleTotalBonus(overall.bonus);

        const columns = [
          { Header: "Доктор", accessor: "doctor", align: "left" },
          { Header: "Продукт", accessor: "product", align: "left" },
          { Header: "Месячный план", accessor: "monthly_plan", align: "left" },
          { Header: "Факт", accessor: "fact", align: "left" },
          { Header: "Факт %", accessor: "fact_percent", align: "left" },
          { Header: "Бонус", accessor: "bonus", align: "left" },
          { Header: "Бонус выплачен", accessor: "bonus_paid", align: "left" },
          { Header: "Остаток бонуса", accessor: "bonus_left", align: "left" },
        ];

        const rows = reports.map((report) => {
          const factPercent = (report.fact_price * 100) / report.plan_price;
          const rowBackgroundColor = getRowBackgroundColor(factPercent);

          return {
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
                {factPercent}%
              </MDTypography>
            ),
            bonus: (
              <MDTypography variant="caption" fontWeight="medium">
                {report.bonus_amount}
              </MDTypography>
            ),
            bonus_paid: (
              <MDTypography variant="caption" fontWeight="medium">
                {report.bonus_payed}
              </MDTypography>
            ),
            bonus_left: (
              <MDTypography variant="caption" fontWeight="medium">
                {report.bonus_amount - report.bonus_payed}
              </MDTypography>
            ),
            rowBackgroundColor,
            factPercent,
          };
        });

        const newData = { columns, rows, overall };

        if (JSON.stringify(newData) !== JSON.stringify(previousDataRef.current)) {
          previousDataRef.current = newData;
          setData(newData);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchBonuses();
  }, [
    accessToken,
    month,
    selectedProduct,
    selectedDoctor,
    selectedRegion,
    selectedMedRep,
    handleTotalBonus,
  ]);

  return data;
}
