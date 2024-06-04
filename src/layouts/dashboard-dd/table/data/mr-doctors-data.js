import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useDoctorData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const doctors = response.data;

        const columns = [
          { Header: "Полное имя", accessor: "full_name", align: "left" },
          { Header: "Специальность", accessor: "speciality", align: "left" },
          { Header: "Медицинская организация", accessor: "medical_organization", align: "left" },
          { Header: "Категория", accessor: "category", align: "left" },
        ];

        const rows = doctors.map((doctor) => ({
          full_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.full_name}
            </MDTypography>
          ),
          speciality: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.speciality.name}
            </MDTypography>
          ),
          medical_organization: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.medical_organization.name}
            </MDTypography>
          ),
          category: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.category.name}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchDoctors();
  }, [accessToken, apiPath]);

  return data;
}
