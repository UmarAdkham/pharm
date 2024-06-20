import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Authentication layout components
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";

function ProductModal({ open, handleClose, handleSubmit, productToUpdate }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount_price, setDiscountPrice] = useState("");
  const [man_company_id, setManufacturerCompanyId] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [manufacturerCompanies, setManufacturerCompanies] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (open && productToUpdate) {
      setName(productToUpdate.name);
      setPrice(productToUpdate.price);
      setDiscountPrice(productToUpdate.discount_price);
      setCategoryId(productToUpdate.category_id);
      setManufacturerCompanyId(productToUpdate.man_company_id);
    }
  }, [productToUpdate, open]);

  useEffect(() => {
    if (open) {
      fetchManCompAndCategories();
    }
  }, [open]);

  const fetchManCompAndCategories = async () => {
    try {
      const [manCompanies, categories] = await Promise.all([
        axiosInstance.get("https://it-club.uz/common/get-manufactured-company", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
        axiosInstance.get("https://it-club.uz/common/get-product-category", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      ]);
      setManufacturerCompanies(manCompanies.data);
      setCategories(categories.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedProduct = {
      id: productToUpdate.id,
      name,
      price,
      discount_price,
      category_id,
      man_company_id,
    };
    handleSubmit(updatedProduct);
    handleClose();
    // Optionally, trigger a refresh of data
    location.reload();
  };

  return (
    <ModalOpen
      open={open}
      header={<MDTypography>Обновить продукт</MDTypography>}
      body={
        <MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleFormSubmit}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Название"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="number"
                  label="Цена"
                  fullWidth
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="number"
                  label="Цена производителя"
                  fullWidth
                  value={discount_price}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                />
              </MDBox>
              <MDBox mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="manufactuer-companies-label">Производители</InputLabel>
                  <Select
                    labelId="manufactuer-companies-label"
                    value={man_company_id}
                    label="Производители"
                    onChange={(e) => setManufacturerCompanyId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {manufacturerCompanies.map((mc) => (
                      <MenuItem key={mc.id} value={mc.id}>
                        {mc.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MDBox>
              <MDBox mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Категория продукта</InputLabel>
                  <Select
                    labelId="category-label"
                    value={category_id}
                    label="Категория продукта"
                    onChange={(e) => setCategoryId(e.target.value)}
                    sx={{ height: "45px" }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MDBox>

              <MDBox
                component="div"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button onClick={handleClose} size="small" variant="outlined">
                  <MDTypography variant="button">Отмена</MDTypography>
                </Button>
                <Button size="small" variant="contained" type="submit">
                  <MDTypography style={{ color: "white" }} variant="button">
                    Сохранить
                  </MDTypography>
                </Button>
              </MDBox>
            </MDBox>
          </MDBox>
        </MDBox>
      }
    />
  );
}

ProductModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  productToUpdate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    price: PropTypes.number,
    discount_price: PropTypes.number,
    man_company_id: PropTypes.number,
    category_id: PropTypes.number,
  }),
};

export default ProductModal;
