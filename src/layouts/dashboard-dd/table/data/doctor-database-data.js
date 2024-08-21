import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

export default function useDoctorDatabaseData() {
  const [data, setData] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(true); // Loading state
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await axiosInstance.get(`/mr/get-all-doctors-with-plan`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const doctors = response.data;

        const columns = [
          { Header: "Фамилия Имя", accessor: "full_name", align: "left" },
          { Header: "Дата рождения", accessor: "date_birthday", align: "left" },
          { Header: "Медицинские организация", accessor: "med_org", align: "left" },
          { Header: "Специальность", accessor: "speciality", align: "left" },
          { Header: "Категории", accessor: "category", align: "left" },
          { Header: "Доктор план", accessor: "doctor_plan", align: "left" },
        ];

        const rows = doctors.map((doctor) => {
          const totalMonthlyPlan = doctor.doctormonthlyplan.reduce(
            (sum, item) => sum + item.monthly_plan,
            0
          );

          const rowBackgroundColor = totalMonthlyPlan === 0 ? "#e6e3e3" : "#88f2a1";

          return {
            full_name: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctor.full_name}
              </MDTypography>
            ),
            date_birthday: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctor.birth_date ? doctor.birth_date : "-"}
              </MDTypography>
            ),
            med_org: doctor.medical_organization?.name ? (
              <Tooltip title={doctor.medical_organization.name} arrow>
                <MDTypography variant="caption" fontWeight="medium">
                  {doctor.medical_organization.name.length > 20
                    ? `${doctor.medical_organization.name.substring(0, 15)}...`
                    : doctor.medical_organization.name}
                </MDTypography>
              </Tooltip>
            ) : (
              <MDTypography variant="caption" fontWeight="medium">
                -
              </MDTypography>
            ),
            speciality: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctor.speciality?.name || "-"}
              </MDTypography>
            ),
            category: (
              <MDTypography variant="caption" fontWeight="medium">
                {doctor.category?.name || "-"}
              </MDTypography>
            ),
            doctor_plan: (
              <MDTypography variant="caption" fontWeight="medium">
                {totalMonthlyPlan}
              </MDTypography>
            ),
            rowBackgroundColor,
          };
        });

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }

    fetchDoctors();
  }, [accessToken]);

  return { data, loading };
}
