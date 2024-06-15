import React from "react";
import PropTypes from "prop-types";
import { Paper, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CustomTooltip = ({ open, onClose, content }) => {
  return open ? (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1300,
        padding: 3,
        width: "60%",
        maxHeight: "80%",
        overflow: "auto",
        backgroundColor: "white",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      {content}
    </Paper>
  ) : null;
};

CustomTooltip.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  content: PropTypes.node.isRequired,
};

export default CustomTooltip;
