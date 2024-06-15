import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function usePharmacyData(apiPath, onRowClick) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchPharmacies() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const pharmacies = response.data;

        const columns = [
          { Header: "Название компании", accessor: "name", align: "left" },
          { Header: "Бренд", accessor: "brand", align: "left" },
          { Header: "Директор", accessor: "director", align: "left" },
        ];

        const rows = pharmacies.map((pharmacy) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {pharmacy.company_name}
            </MDTypography>
          ),
          brand: (
            <MDTypography variant="caption" fontWeight="medium">
              {pharmacy.brand_name}
            </MDTypography>
          ),
          director: (
            <MDTypography variant="caption" fontWeight="medium">
              {pharmacy.pharmacy_director}
            </MDTypography>
          ),
          onClick: () => onRowClick(pharmacy.id), // Add click handler to each row
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchPharmacies();
  }, [accessToken, apiPath]);

  return data;
}
