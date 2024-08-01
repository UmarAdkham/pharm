import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import ProductModal from "layouts/dashboard-dd/dialogs/modal/shared/product-modal";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { IconButton } from "@mui/material";
import AccountBalanceWalletTwoToneIcon from "@mui/icons-material/AccountBalanceWalletTwoTone";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";

export default function useProductData(apiPath, id1, id2) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [productData, setProductData] = useState({
    id: null,
    name: "",
    price: 0,
    discount_price: 0,
    man_company_id: null,
    category_id: null,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (udpatedProduct) => {
    try {
      const response = await axiosInstance.put(
        `https://it-club.uz/common/update-product/${udpatedProduct.id}`,
        udpatedProduct,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("не удалось обновить продукт:", error);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data: fetchedData } = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        fetchedData.sort((a, b) => a.name.localeCompare(b.name));

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Цена", accessor: "price", align: "left" },
          { Header: "Произ. цена", accessor: "discount_price", align: "left" },
          { Header: "Производитель", accessor: "man_company", align: "left" },
          { Header: "Категория", accessor: "category", align: "left" },
          { Header: "Статус", accessor: "status", align: "left" },
          { Header: "Расходы на маркетинг", accessor: "marketing_expenses", align: "left" },
          { Header: "Расходы на зарплату", accessor: "salary_expenses", align: "left" },
          { Header: "Внести расходы", accessor: "set_expenses", align: "left" },
          { Header: "Изменить", accessor: "update", align: "right" },
        ];

        const rows = fetchedData
          .filter((prct) => (id1 === 0 && prct) || prct.man_company.id === id1)
          .filter((prct) => (id2 === 0 && prct) || prct.category.id === id2)
          .map((product) => ({
            name: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.name}
              </MDTypography>
            ),
            price: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.price?.toLocaleString("ru-RU")}
              </MDTypography>
            ),
            discount_price: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.discount_price?.toLocaleString("ru-RU")}
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
            status: (
              <MDTypography
                variant="caption"
                fontWeight="medium"
                style={{
                  backgroundColor: product.is_exist === null ? "#f77c48" : "#81c784",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                {product.is_exist === null ? "Ожидается" : "В наличии"}
              </MDTypography>
            ),
            marketing_expenses: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.marketing_expenses?.toLocaleString("ru-RU") || "-"}
              </MDTypography>
            ),
            salary_expenses: (
              <MDTypography variant="caption" fontWeight="medium">
                {product.salary_expenses?.toLocaleString("ru-RU") || "-"}
              </MDTypography>
            ),
            set_expenses: (
              <IconButton
                onClick={() => {
                  navigate("/dd/edit-product-expenses", { state: product.id });
                }}
                aria-label="update"
              >
                <AccountBalanceWalletTwoToneIcon />
              </IconButton>
            ),
            update: (
              <div>
                <IconButton
                  onClick={() => {
                    handleOpen();
                    setProductData({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      discount_price: product.discount_price,
                      man_company_id: product.man_company.id,
                      category_id: product.category.id,
                    });
                  }}
                  aria-label="update"
                >
                  <DriveFileRenameOutlineOutlinedIcon />
                </IconButton>
                <ProductModal
                  open={open}
                  handleClose={handleClose}
                  handleSubmit={handleSubmit}
                  productToUpdate={productData}
                />
              </div>
            ),
          }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, [accessToken, apiPath, open, id1, id2]);

  return data;
}
