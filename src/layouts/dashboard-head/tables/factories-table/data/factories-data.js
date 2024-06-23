import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useManufacturerCompanyData(apiPath, handleRowClick, selectedFactoryId) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchManufacturerCompanies() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const manufacturerCompanies = response.data.sort((a, b) => a.id - b.id);

        const columns = [{ Header: "Название", accessor: "name", align: "left" }];

        const rows = manufacturerCompanies.map((mnfct) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {mnfct.name}
            </MDTypography>
          ),
          onClick: () => {
            handleRowClick(mnfct);
          },
          isHighlighted: mnfct.id === selectedFactoryId, // highlight the current factory row
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchManufacturerCompanies();
  }, [accessToken, apiPath, selectedFactoryId]);

  return data;
}
