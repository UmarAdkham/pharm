import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Authentication layout components
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import axiosInstance from "services/axiosInstance";
import { useSelector } from "react-redux";
import MDButton from "components/MDButton";

function ProductModal({ open, handleClose, handleSubmit, productToUpdate }) {
  console.log("OPEN: " + open);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount_price, setDiscountPrice] = useState("");
  const [man_company_id, setManufacturerCompanyId] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [manufacturerCompanies, setManufacturerCompanies] = useState([]);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (open) {
      if (productToUpdate) {
        setName(productToUpdate.name);
        setPrice(productToUpdate.price);
        setDiscountPrice(productToUpdate.discount_price);
        setCategoryId(productToUpdate.category_id);
        setManufacturerCompanyId(productToUpdate.man_company_id);
      }
      fetchManCompAndCategories();
    }
  }, [productToUpdate, open]);

  const fetchManCompAndCategories = async () => {
    try {
      const [manCompanies, categories] = await Promise.all([
        axiosInstance.get("`https://it-club.uz/common/get-manufactured-company`", {
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
      address,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      region_id,
      med_rep_id,
    };
    handleSubmit(updatedProduct);
    handleClose();
    // Trigger a refresh of data
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

              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth type="submit">
                  Добавить
                </MDButton>
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
