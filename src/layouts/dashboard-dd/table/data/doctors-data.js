import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip from Material-UI

export default function useDoctorsData(
  month,
  startDate,
  endDate,
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
    async function fetchBonuses() {
      try {
        let url = `dd/get-fact?month_number=${month}`;
        if (startDate && endDate) {
          url = `dd/get-fact?start_date=${startDate}&end_date=${endDate}`;
        }

        const regionQueryParam = selectedRegion ? `&region_id=${selectedRegion.id}` : "";
        const medRepQueryParam = selectedMedRep ? `&med_rep_id=${selectedMedRep.id}` : "";

        url += `${regionQueryParam}${medRepQueryParam}`;

        const response = await axiosInstance.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const reports = response.data.filter((report) => {
          return (
            (!selectedProduct || report.product_name === selectedProduct.name) &&
            (!selectedDoctor || report.doctor_name === selectedDoctor.full_name)
          );
        });

        const doctorMap = new Map();

        reports.forEach((report) => {
          if (!doctorMap.has(report.doctor_name)) {
            doctorMap.set(report.doctor_name, {
              doctor_name: report.doctor_name,
              med_rep: report.med_rep,
              region: report.region,
              speciality: report.speciality,
              medical_organization_name: report.medical_organization_name,
              fact: 0,
              fact_price: 0,
              bonus_amount: 0,
              bonus_payed: 0,
              bonus_remainder: 0,
              pre_investment: 0,
              monthly_plan: 0,
              details: [],
            });
          }

          const doctorData = doctorMap.get(report.doctor_name);
          doctorData.fact += report.fact;
          doctorData.fact_price += report.fact_price;
          doctorData.bonus_amount += report.bonus_amount;
          doctorData.bonus_payed += report.bonus_payed;
          doctorData.bonus_remainder += report.bonus_remainder;
          doctorData.pre_investment += report.pre_investment;
          doctorData.monthly_plan += report.monthly_plan;

          doctorData.details.push({
            product_name: report.product_name,
            monthly_plan: report.monthly_plan,
            plan_price: report.plan_price,
            fact: report.fact,
            fact_price: report.fact_price,
            bonus_amount: report.bonus_amount,
            bonus_payed: report.bonus_payed,
            bonus_remainder: report.bonus_remainder,
            pre_investment: report.pre_investment,
          });

          doctorMap.set(report.doctor_name, doctorData);
        });

        const overall = {
          numberOfDoctors: reports.length,
          monthlyPlan: reports.reduce((sum, item) => sum + item.plan_price, 0),
          fact: reports.reduce((sum, item) => sum + item.fact_price, 0),
          factPercent:
            reports.length > 0
              ? reports.reduce((sum, item) => {
                  // Skip items where plan_price is zero or undefined
                  if (!item.plan_price) return sum;
                  return sum + (item.fact_price * 100) / item.plan_price;
                }, 0) / reports.length
              : 0,
          bonus: reports.reduce((sum, item) => sum + item.bonus_amount, 0),
          bonusPaid: reports.reduce((sum, item) => sum + item.bonus_payed, 0),
          bonusLeft: reports.reduce((sum, item) => sum + (item.bonus_amount - item.bonus_payed), 0),
          pre_investment: reports.reduce((sum, item) => sum + item.pre_investment, 0),
          plan_price: reports.reduce((sum, item) => sum + item.plan_price, 0),
          hasBonus: true,
        };

        handleTotalBonus(overall.bonus);

        const columns = [
          { Header: "Имя врача", accessor: "doctor_name", align: "left" },
          { Header: "Медицинские представители", accessor: "med_rep", align: "left" },
          { Header: "Регион", accessor: "region", align: "left" },
          { Header: "Специальность", accessor: "speciality", align: "left" },
          {
            Header: "Медицинская организация",
            accessor: "medical_organization_name",
            align: "left",
            width: 200, // Set width to 200px
          },
          { Header: "Общ. План (Сум)", accessor: "plan_price", align: "left" },
          { Header: "Факт", accessor: "fact", align: "left" },
          { Header: "Факт поступ", accessor: "fact_price", align: "left" },
          { Header: "Факт %", accessor: "fact_percent", align: "left" },
          { Header: "Бонус", accessor: "bonus_amount", align: "left" },
          { Header: "Бонус выплачен", accessor: "bonus_payed", align: "left" },
          { Header: "Остаток бонуса", accessor: "bonus_remainder", align: "left" },
          { Header: "Прединвест", accessor: "pre_investment", align: "left" },
        ];

        const rows = Array.from(doctorMap.values()).map((doctorData) => {
          const factPercent = (doctorData.fact_price * 100) / doctorData.monthly_plan || 0;
          return {
            ...doctorData,
            factPercent, // Add fact_percent to row data
            doctor_name: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.doctor_name}
              </MDTypography>
            ),
            med_rep: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.med_rep}
              </MDTypography>
            ),
            region: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.region}
              </MDTypography>
            ),
            speciality: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.speciality}
              </MDTypography>
            ),
            medical_organization_name: (
              <Tooltip title={doctorData.medical_organization_name}>
                <MDTypography variant="caption" fontWeight="medium">
                  {doctorData.medical_organization_name}
                </MDTypography>
              </Tooltip>
            ),
            plan_price: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.monthly_plan?.toLocaleString("ru-RU")}
              </MDTypography>
            ),
            fact: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.fact?.toLocaleString("ru-RU")}
              </MDTypography>
            ),
            fact_price: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.fact_price?.toLocaleString("ru-RU")}
              </MDTypography>
            ),
            fact_percent: (
              <MDTypography variant="caption" fontWeight="medium">
                {factPercent.toFixed(2)}
              </MDTypography>
            ),
            bonus_amount: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.bonus_amount?.toLocaleString("ru-RU")}
              </MDTypography>
            ),
            bonus_payed: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.bonus_payed?.toLocaleString("ru-RU")}
              </MDTypography>
            ),
            bonus_remainder: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.bonus_remainder?.toLocaleString("ru-RU")}
              </MDTypography>
            ),
            pre_investment: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctorData.pre_investment?.toLocaleString("ru-RU")}
              </MDTypography>
            ),
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
    startDate,
    endDate,
    selectedProduct,
    selectedDoctor,
    selectedRegion,
    selectedMedRep,
    handleTotalBonus,
  ]);

  return data;
}
