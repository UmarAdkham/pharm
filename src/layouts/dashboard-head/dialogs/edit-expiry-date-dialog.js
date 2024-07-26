import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { format } from "date-fns";

// eslint-disable-next-line react/prop-types
export default function ExpiryDateDialog({ open, handleClose, handleSubmit, initialDate }) {
  const [selectedDate, setSelectedDate] = useState(
    initialDate ? format(new Date(initialDate), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  );

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleFormSubmit = () => {
    handleSubmit(selectedDate);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Изменить дату истечения</DialogTitle>
      <DialogContent>
        <DialogContentText>Выберите новую дату истечения срока резервирования.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="date"
          label="Дата истечения"
          type="date"
          fullWidth
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleFormSubmit}>Изменить</Button>
      </DialogActions>
    </Dialog>
  );
}
