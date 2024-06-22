import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useWholesaleProductData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchWsProducts() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const wsps = response.data;

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Категория", accessor: "category", align: "left" },
          { Header: "Производственные компании", accessor: "man_company", align: "left" },
          { Header: "Количество", accessor: "amount", align: "center" },
          { Header: "Цена", accessor: "price", align: "center" },
        ];

        const rows = wsps.map((wsp) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsp.product.name}
            </MDTypography>
          ),
          man_company: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsp.product.man_company.name}
            </MDTypography>
          ),
          category: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsp.product.category.name}
            </MDTypography>
          ),
          amount: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsp.amount}
            </MDTypography>
          ),
          price: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsp.price}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchWsProducts();
  }, [accessToken, apiPath]);

  return data;
}
