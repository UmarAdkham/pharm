import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useRegionData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const regions = response.data;

        const columns = [{ Header: "Название", accessor: "name", align: "left" }];

        const rows = regions.map((region) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {region.name}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchRegions();
  }, [accessToken, apiPath]);

  return data;
}
