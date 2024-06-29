import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

export default function EditProductQuantityDialog({
  open,
  handleClose,
  handleSubmit,
  initialQuantity,
}) {
  const [quantity, setQuantity] = useState(initialQuantity || 0);

  useEffect(() => {
    if (open) {
      setQuantity(initialQuantity || 0);
    }
  }, [initialQuantity, open]);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleFormSubmit = () => {
    handleSubmit(quantity);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Возврат товара</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="quantity"
          label="Количество"
          type="number"
          fullWidth
          value={quantity}
          onChange={handleQuantityChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleFormSubmit}>Изменить</Button>
      </DialogActions>
    </Dialog>
  );
}

EditProductQuantityDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialQuantity: PropTypes.number,
};
