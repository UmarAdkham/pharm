import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import axiosInstance from "services/axiosInstance";

const StyledDialogContent = styled(DialogContent)({
  borderRadius: "15px",
});

const StyledButton = styled(Button)({
  width: "45%",
  margin: "0 2.5%",
  color: "#000",
});

const StyledBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  // backgroundColor: "#f0f0f0",
  borderRadius: "10px",
  marginBottom: "10px",
});

const StyledTextField = styled(Box)({
  marginBottom: "10px",
});

// eslint-disable-next-line react/prop-types
const NotificationDialog = React.memo(({ open, onClose, notificationId }) => {
  const [visitData, setVisitData] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (open && notificationId) {
      const fetchVisitData = async () => {
        try {
          const { data } = await axiosInstance.get(
            `https://it-club.uz/common/get-notofication/${notificationId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setVisitData(data);
        } catch (error) {
          console.error("Failed to fetch visit data:", error);
        }
      };

      fetchVisitData();
    }
  }, [open, notificationId, accessToken]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogContent>
        <DialogTitle align="center">Уведомления</DialogTitle>
        <Typography variant="subtitle1" align="end">
          дата создании:{" "}
          {visitData?.date ? format(new Date(visitData?.date), "MM-dd-yy HH:mm") : "N/A"}
        </Typography>

        <StyledBox>
          <Box display="flex" alignItems="center">
            {/* <Box mr={2}>
              <img
                src={visitType === "doctor" ? doctorImage : pharmacyImage}
                alt="Doctor"
                width="80"
                height="80"
              />
            </Box> */}
            <Box>
              <Typography>Author: {visitData?.author}</Typography>
              <Typography variant="caption">
                {visitData?.doctor
                  ? `Доктор: ${visitData?.doctor.full_name}`
                  : visitData?.pharmacy
                  ? `Аптека: ${visitData?.pharmacy?.company_name}`
                  : `Оптовая компания: ${visitData?.wholesale?.company_name}`}
              </Typography>
            </Box>
          </Box>
        </StyledBox>

        <StyledTextField>
          <Typography variant="subtitle2">Тема:</Typography>
          <Typography variant="body1">{visitData?.theme || "N/A"}</Typography>
        </StyledTextField>

        <StyledTextField>
          <Typography variant="subtitle2">Описание</Typography>
          <Typography sx={{ backgroundColor: "white" }} variant="body1">
            {visitData?.description || "N/A"}
          </Typography>
        </StyledTextField>
      </StyledDialogContent>

      <DialogActions>
        <StyledButton variant="contained" color="success" onClick={onClose}>
          ЗАКРЫТЬ
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
});

export default NotificationDialog;
