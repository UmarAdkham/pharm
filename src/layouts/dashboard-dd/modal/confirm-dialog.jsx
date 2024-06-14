import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";

// eslint-disable-next-line react/prop-types
const ConfirmDialog = React.memo(({ isOpen, onClose, planId, planType }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);

  const deleted = async (event) => {
    if (planId) {
      event.stopPropagation(); // Stop the row click event from being triggered
      alert(planId);
      try {
        await axiosInstance.delete(
          `https://it-club.uz/dd/delete-${
            planType !== "" ? `${planType}-plan` : "notofications"
          }/${planId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        location.reload();
        onClose();
      } catch (error) {
        console.error("Failed to delete doctor plan:", error);
      }
    } else {
      onClose();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">{"Вы уверены что хотите удалить?"}</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены что хотите удалить?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={deleted}>
            Yes
          </Button>
          <Button variant="contained" color="success" onClick={onClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
});

export default ConfirmDialog;
