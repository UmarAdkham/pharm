import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import { List, ListItem, ListItemText } from "@mui/material";
import axiosInstance from "services/axiosInstance";

const ViewProductListDialog = ({ open, handleClose, reservation }) => {
  const [productList, setProductList] = useState(null);

  useEffect(() => {
    if (reservation.id) {
      fetchProductList(reservation.id, reservation.type);
    }
  }, [reservation]);

  const fetchProductList = async (id, type) => {
    try {
      const response = await axiosInstance.get(
        type === "wholesale"
          ? `https://it-club.uz/ws/get-wholesale-reservation-products/${id}`
          : `https://it-club.uz/mr/get-${type === "pharmacy" ? "" : `${type}-`}reservation/${id}`
      );
      setProductList(response.data);
    } catch (error) {
      console.error("Failed to fetch product list", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Список продуктов</DialogTitle>
      <DialogContent>
        {productList && (
          <div>
            <List>
              {productList.products.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${item.product.name} - Количество: ${item.quantity}`} />
                </ListItem>
              ))}
            </List>
            <MDTypography variant="body2">Скидка: {productList.discount}%</MDTypography>
            <MDTypography variant="body2">
              Сумма: {productList.total_amount.toLocaleString("ru-RU")} сум
            </MDTypography>
            <MDTypography variant="body2">
              Сумма с НДС: {productList.total_payable_with_nds.toLocaleString("ru-RU")} сум
            </MDTypography>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ViewProductListDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  reservation: PropTypes.object,
};

export default ViewProductListDialog;
