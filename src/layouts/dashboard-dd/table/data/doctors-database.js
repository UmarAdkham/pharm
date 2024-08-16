import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function DoctorsDatabase() {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBonuses() {
      try {
        const response = await axiosInstance.get(`/mr/get-all-doctors-with-plan`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const doctors = response.data;
        console.log(doctors);

        const columns = [
          { Header: "Фамилия Имя", accessor: "full_name", align: "left" },
          { Header: "Дата рождения", accessor: "date_birthday", align: "left" },
          { Header: "Медицинские организация", accessor: "med_org", align: "left" },
          { Header: "Специальность", accessor: "speciality", align: "left" },
          { Header: "Категории", accessor: "category", align: "left" },
          { Header: "Доктор план", accessor: "doctor_plan", align: "left" },
        ];

        const rows = doctors.map((doctor) => ({
          full_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.full_name}
            </MDTypography>
          ),
          date_birthday: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.birth_date === null ? "-" : doctor.birth_date}
            </MDTypography>
          ),
          med_org: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.medical_organization.name}
            </MDTypography>
          ),
          speciality: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.speciality.name}
            </MDTypography>
          ),
          category: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.category.name}
            </MDTypography>
          ),
          doctor_plan: (
            <MDTypography variant="caption" fontWeight="medium">
              -
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchBonuses();
  }, [accessToken]);

  return data;
}
