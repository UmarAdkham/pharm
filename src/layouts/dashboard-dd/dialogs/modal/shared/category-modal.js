import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

function CategoryModal({ open, handleClose, handleSubmit, categoryToUpdate }) {
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    if (categoryToUpdate) {
      setUpdatedName(categoryToUpdate.name);
    }
  }, [categoryToUpdate]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedCategory = { id: categoryToUpdate.id, name: updatedName };
    handleSubmit(updatedCategory);
    handleClose();
    // Trigger a refresh of data
    location.reload();
  };

  return (
    <ModalOpen
      open={open}
      header={<MDTypography>Обновить категорий</MDTypography>}
      body={
        <MDBox>
          <form onSubmit={handleFormSubmit}>
            <TextField
              style={{ marginBottom: 20 }}
              name="company"
              label="Категория"
              variant="outlined"
              margin="normal"
              fullWidth
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
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
          </form>
        </MDBox>
      }
    />
  );
}

CategoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  categoryToUpdate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

export default CategoryModal;
