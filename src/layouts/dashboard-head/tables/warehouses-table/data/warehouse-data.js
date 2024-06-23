import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import CategoryModal from "layouts/dashboard-dd/dialogs/modal/shared/category-modal";

export default function useWarehouseData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchWarehouses() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const warehouses = response.data;

        const columns = [
          { Header: "Название продукта", accessor: "product_name", align: "left" },
          { Header: "Цена", accessor: "price", align: "left" },
          { Header: "Цена производителя", accessor: "discount_price", align: "left" },
          { Header: "Категория", accessor: "category", align: "left" },
          { Header: "Количество", accessor: "amount", align: "left" },
        ];

        const rows = warehouses.map((warehouse) => ({
          product_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {warehouse.product.name}
            </MDTypography>
          ),
          price: (
            <MDTypography variant="caption" fontWeight="medium">
              {warehouse.product.price}
            </MDTypography>
          ),
          discount_price: (
            <MDTypography variant="caption" fontWeight="medium">
              {warehouse.product.discount_price}
            </MDTypography>
          ),
          category: (
            <MDTypography variant="caption" fontWeight="medium">
              {warehouse.product.category.name}
            </MDTypography>
          ),
          amount: (
            <MDTypography variant="caption" fontWeight="medium">
              {warehouse.amount}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchWarehouses();
  }, [accessToken, apiPath]);

  return data;
}
