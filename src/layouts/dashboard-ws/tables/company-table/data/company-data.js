import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function useWholesaleCompanyData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWsCompanies() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const wscs = response.data;

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Контакт", accessor: "contact", align: "left" },
          { Header: "Регион", accessor: "region", align: "center" },
        ];

        const rows = wscs.map((wsc) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsc.name}
            </MDTypography>
          ),
          contact: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsc.contact}
            </MDTypography>
          ),
          region: (
            <MDTypography variant="caption" fontWeight="medium" color="text">
              {wsc.region.name}
            </MDTypography>
          ),
          onClick: () => navigate(`/ws/company-info/${wsc.id}`),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchWsCompanies();
  }, [accessToken, apiPath]);

  return data;
}
