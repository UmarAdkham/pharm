import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { format } from "date-fns";

export default function usePharmacyPlanData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchPharmacyPlans() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const pharmacyPlans = response.data;

        const columns = [
          { Header: "Дата", accessor: "date", align: "left" },
          { Header: "Тема", accessor: "theme", align: "left" },
          { Header: "Описание", accessor: "description", align: "left" },
          { Header: "Аптека", accessor: "pharmacy", align: "left" },
        ];

        const rows = pharmacyPlans.map((plan) => ({
          date: (
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(plan.date), "yyyy-MM-dd")}
            </MDTypography>
          ),
          theme: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.theme}
            </MDTypography>
          ),
          description: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.description}
            </MDTypography>
          ),
          pharmacy: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.pharmacy.company_name}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchPharmacyPlans();
  }, [accessToken, apiPath]);

  return data;
}
