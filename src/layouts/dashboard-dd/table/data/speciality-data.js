import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useSpecialityData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchSpecialities() {
      try {
        console.log(apiPath);
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const specialities = response.data;

        const columns = [{ Header: "Name", accessor: "name", align: "left" }];

        const rows = specialities.map((speciality) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {speciality.name}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchSpecialities();
  }, [accessToken, apiPath]);

  return data;
}
