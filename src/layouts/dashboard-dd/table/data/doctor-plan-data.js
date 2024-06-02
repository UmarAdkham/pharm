import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { format } from "date-fns";

export default function useDoctorPlanData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchDoctorPlans() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const doctorPlans = response.data;

        const columns = [
          { Header: "Дата", accessor: "date", align: "left" },
          { Header: "Тема", accessor: "theme", align: "left" },
          { Header: "Описание", accessor: "description", align: "left" },
          { Header: "Врач", accessor: "doctor", align: "left" },
        ];

        const rows = doctorPlans.map((plan) => ({
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
          doctor: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.doctor.full_name}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchDoctorPlans();
  }, [accessToken, apiPath]);

  return data;
}
