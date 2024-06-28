import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";

export default function useWholesaleReportData(wsCompanyId, month) {
  const navigate = useNavigate();
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchWsPharmacies() {
      try {
        const response = await axiosInstance.get(
          `mr/wholesale-report-by-wholesale-id/${wsCompanyId}?month_number=${month}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const reports = response.data;

        const columns = [
          { Header: "Аптека", accessor: "pharmacy", align: "left" },
          { Header: "Регион", accessor: "region", align: "left" },
          { Header: "Медицинский представитель", accessor: "med_rep", align: "left" },
          { Header: "Контакт", accessor: "contact", align: "left" },
          { Header: "Дата", accessor: "date", align: "left" },
        ];

        const rows = reports.map((report) => ({
          pharmacy: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.pharmacy.company_name}
            </MDTypography>
          ),
          region: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.wholesale.region.name}
            </MDTypography>
          ),
          med_rep: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.pharmacy.med_rep.full_name}
            </MDTypography>
          ),
          contact: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.wholesale.contact}
            </MDTypography>
          ),
          date: (
            <MDTypography variant="caption" fontWeight="medium">
              {report.date}
            </MDTypography>
          ),
          onClick: () => {
            navigate("/ws/product-report", {
              state: { products: report.products, pharmacyName: report.pharmacy.company_name },
            });
          },
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchWsPharmacies();
  }, [accessToken, wsCompanyId, month]);

  return data;
}
