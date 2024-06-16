import React from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 12,
  p: 4,
};
function ModalOpen({ open, header, body }) {
  return (
    <Modal open={open}>
      <Box sx={style}>
        <div style={{ marginBottom: 20 }}>{header}</div>
        {body}
      </Box>
    </Modal>
  );
}

ModalOpen.propTypes = {
  open: PropTypes.bool,
  header: PropTypes.object,
  body: PropTypes.object,
};

export default ModalOpen;
