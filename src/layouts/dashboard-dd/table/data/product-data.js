import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import ProductModal from "layouts/dashboard-dd/dialogs/modal/shared/product-modal";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { IconButton, Switch } from "@mui/material";
import AccountBalanceWalletTwoToneIcon from "@mui/icons-material/AccountBalanceWalletTwoTone";
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

  const handleSubmit = async (updatedProduct) => {
    try {
      await axiosInstance.put(
        `https://it-club.uz/common/update-product/${updatedProduct.id}`,
        updatedProduct,
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

  const handleToggleSubmit = async (product) => {
    const confirmationMessage = product.is_exist
      ? "Вы уверены, что хотите изменить статус на 'Ожидается'?"
      : "Вы уверены, что хотите изменить статус на 'В наличии'?";

    const confirmed = window.confirm(confirmationMessage);

    if (!confirmed) return;

    const updatedProduct = {
      ...product,
      is_exist: !product.is_exist,
    };

    try {
      await axiosInstance.put(
        `https://it-club.uz/common/update-product/${product.id}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Re-fetch the data to ensure the state is updated
      fetchProducts();
    } catch (error) {
      console.error("не удалось обновить продукт:", error);
    }
  };

  const fetchProducts = async () => {
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
        { Header: "Toggle Exist", accessor: "toggle_exist", align: "right" }, // New column for toggle
      ];

      const rows = fetchedData
        .filter((prct) => (id1 === 0 && prct) || prct.man_company.id === id1)
        .filter((prct) => (id2 === 0 && prct) || prct.category.id === id2)
        .map((product) => ({
          id: product.id, // Add id to identify rows
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
                backgroundColor: product.is_exist ? "#81c784" : "#f77c48",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {product.is_exist ? "В наличии" : "Ожидается"}
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
          toggle_exist: (
            <Switch checked={product.is_exist} onChange={() => handleToggleSubmit(product)} />
          ), // Switch to toggle is_exist
        }));

      setData({ columns, rows });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [accessToken, apiPath, id1, id2]);

  return data;
}
