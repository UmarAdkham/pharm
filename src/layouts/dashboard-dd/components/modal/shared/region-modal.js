// Inside region-modal.js
import React from "react";
import PropTypes from "prop-types";
import ModalOpen from "../";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDTypography from "components/MDTypography";
import MDBox from "../../../../../components/MDBox";

function RegionModal({ open, handleClose, handleSubmit, regionToUpdate }) {
  const header = <MDTypography>Обновить регион</MDTypography>;

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const updatedName = event.target.region.value;
    const updatedRegion = { id: regionToUpdate.id, name: updatedName };
    handleSubmit(updatedRegion);
    handleClose();
  };

  const body = (
    <MDBox>
      <form onSubmit={handleFormSubmit}>
        <TextField
          style={{ marginBottom: 20 }}
          name="region"
          label="Регион"
          variant="outlined"
          margin="normal"
          fullWidth
          defaultValue={regionToUpdate ? regionToUpdate.name : ""}
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
  );

  return <ModalOpen open={open} header={header} body={body} />;
}

RegionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  regionToUpdate: PropTypes.object, // shape: { id: string, name: string }
};

export default RegionModal;
