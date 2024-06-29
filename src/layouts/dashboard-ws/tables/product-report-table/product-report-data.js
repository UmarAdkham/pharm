import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export default function useProductReportData(products, setSelectedProduct, setDialogOpen) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    function prepareRowColumns() {
      try {
        const columns = [
          { Header: "Продукт", accessor: "product_name", align: "left" },
          { Header: "Производственная компания", accessor: "man_company", align: "left" },
          { Header: "Количество", accessor: "quantity", align: "left" },
          { Header: "Действия", accessor: "actions", align: "center" },
        ];

        const rows = products.map((element) => ({
          product_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {element.product.name}
            </MDTypography>
          ),
          man_company: (
            <MDTypography variant="caption" fontWeight="medium">
              {element.product.man_company.name}
            </MDTypography>
          ),
          quantity: (
            <MDTypography variant="caption" fontWeight="medium">
              {element.quantity}
            </MDTypography>
          ),
          actions: (
            <IconButton
              onClick={() => {
                setSelectedProduct(element);
                setDialogOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    prepareRowColumns();
  }, [accessToken, products, setSelectedProduct, setDialogOpen]);

  return data;
}
