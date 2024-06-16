import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

function SpecialityModal({ open, handleClose, handleSubmit, specialityToUpdate }) {
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    if (specialityToUpdate) {
      setUpdatedName(specialityToUpdate.name);
    }
  }, [specialityToUpdate]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedSpeciality = { id: specialityToUpdate.id, name: updatedName };
    handleSubmit(updatedSpeciality);
    handleClose();
  };

  return (
    <ModalOpen
      open={open}
      header={<MDTypography>Обновить специальности</MDTypography>}
      body={
        <MDBox>
          <form onSubmit={handleFormSubmit}>
            <TextField
              style={{ marginBottom: 20 }}
              name="region"
              label="Специальности"
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

SpecialityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  specialityToUpdate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

export default SpecialityModal;
