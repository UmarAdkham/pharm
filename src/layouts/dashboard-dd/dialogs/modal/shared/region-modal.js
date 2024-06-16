import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalOpen from "../modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

function RegionModal({ open, handleClose, handleSubmit, regionToUpdate }) {
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    if (regionToUpdate) {
      setUpdatedName(regionToUpdate.name);
    }
  }, [regionToUpdate]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedRegion = { id: regionToUpdate.id, name: updatedName };
    handleSubmit(updatedRegion);
    handleClose();
    // Trigger a refresh of data
    location.reload();
  };

  return (
    <ModalOpen
      open={open}
      header={<MDTypography>Обновить регион</MDTypography>}
      body={
        <MDBox>
          <form onSubmit={handleFormSubmit}>
            <TextField
              style={{ marginBottom: 20 }}
              name="region"
              label="Регион"
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

RegionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  regionToUpdate: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
};

export default RegionModal;
