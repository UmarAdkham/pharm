import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

export default function useDoctorDatabaseData() {
  const [data, setData] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(true); // Loading state
  const [doctorsWithPlansCount, setDoctorsWithPlansCount] = useState(0);
  const [doctorsWithoutPlansCount, setDoctorsWithoutPlansCount] = useState(0);
  const [filter, setFilter] = useState("all"); // New state for filtering
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

        let withPlansCount = 0;
        let withoutPlansCount = 0;

        const rows = doctors
          .map((doctor) => {
            const totalMonthlyPlan = doctor.doctormonthlyplan.reduce(
              (sum, item) => sum + item.monthly_plan,
              0
            );

            if (totalMonthlyPlan > 0) {
              withPlansCount++;
            } else {
              withoutPlansCount++;
            }

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
              hasPlan: totalMonthlyPlan > 0, // To help with filtering and sorting
              rowBackgroundColor,
            };
          })
          .sort((a, b) => (a.hasPlan === b.hasPlan ? 0 : a.hasPlan ? -1 : 1)); // Sort rows: doctors with plans first

        setDoctorsWithPlansCount(withPlansCount);
        setDoctorsWithoutPlansCount(withoutPlansCount);

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }

    fetchDoctors();
  }, [accessToken]);

  return { data, loading, doctorsWithPlansCount, doctorsWithoutPlansCount, setFilter };
}
