import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useProductData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const products = response.data;

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Цена", accessor: "price", align: "left" },
          { Header: "Цена со скидкой", accessor: "discount_price", align: "left" },
          { Header: "Производитель", accessor: "man_company", align: "left" },
          { Header: "Категория", accessor: "category", align: "left" },
        ];

        const rows = products.map((product) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {product.name}
            </MDTypography>
          ),
          price: (
            <MDTypography variant="caption" fontWeight="medium">
              {product.price}
            </MDTypography>
          ),
          discount_price: (
            <MDTypography variant="caption" fontWeight="medium">
              {product.discount_price}
            </MDTypography>
          ),
          man_company: (
            <MDTypography variant="caption" fontWeight="medium">
              {product.man_company.name}
            </MDTypography>
          ),
          category: (
            <MDTypography variant="caption" fontWeight="medium">
              {product.category.name}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, [accessToken, apiPath]);

  return data;
}
