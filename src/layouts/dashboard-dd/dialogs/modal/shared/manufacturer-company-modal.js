import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

function ManufacturerCompanyModal({ open, handleClose, handleSubmit, campanyToUpdate }) {
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    if (campanyToUpdate) {
      setUpdatedName(campanyToUpdate.name);
    }
  }, [campanyToUpdate]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedMnfct = { id: campanyToUpdate.id, name: updatedName };
    handleSubmit(updatedMnfct);
    handleClose();
    // Trigger a refresh of data
    location.reload();
  };

  return (
    <ModalOpen
      open={open}
      header={<MDTypography>Обновить производственные компании</MDTypography>}
      body={
        <MDBox>
          <form onSubmit={handleFormSubmit}>
            <TextField
              style={{ marginBottom: 20 }}
              name="company"
              label="производственные компании"
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

ManufacturerCompanyModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  campanyToUpdate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

export default ManufacturerCompanyModal;
