import React, { useState, useEffect, useCallback } from "react";
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
import debounce from "lodash.debounce";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import doctorImage from "assets/images/doctor.png"; // Import your image

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
  backgroundColor: "#f0f0f0",
  borderRadius: "10px",
  marginBottom: "10px",
});

const StyledTextField = styled(Box)({
  marginBottom: "10px",
});

// eslint-disable-next-line react/prop-types
const SimpleDialog = ({ open, onClose, onSave, onPostpone, visitId }) => {
  const [visitData, setVisitData] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const fetchVisitData = useCallback(
    debounce(async (id) => {
      try {
        console.log(`Inside modal: ${id}`);
        const response = await axios.get(`https://it-club.uz/mr/get-doctor-visit-plan/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setVisitData(response.data);
      } catch (error) {
        console.error("Failed to fetch visit data:", error);
      }
    }, 300),
    [accessToken]
  );

  useEffect(() => {
    if (open && visitId !== -1) {
      fetchVisitData(visitId);
    }
  }, [open, visitId, fetchVisitData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <StyledDialogContent>
        <DialogTitle align="center">Посещение доктора</DialogTitle>
        <Typography variant="subtitle1" align="center">
          Запланированная дата:{" "}
          {visitData?.date ? format(new Date(visitData.date), "MM-dd-yyyy hh:mm") : "N/A"}
        </Typography>

        <StyledBox>
          <Box display="flex" alignItems="center">
            <Box mr={2}>
              {/* Replace with the appropriate icon or image */}
              <img src={doctorImage} alt="Pharmacy" width="80" height="80" />
            </Box>
            <Box>
              <Typography>{visitData?.doctor?.full_name || "N/A"}</Typography>
              <Typography variant="caption">
                {visitData?.doctor?.medical_organization?.name || "N/A"}
              </Typography>
            </Box>
          </Box>
        </StyledBox>

        <StyledTextField>
          <Typography variant="subtitle2">Тема посещения</Typography>
          <Typography variant="body1">{visitData?.theme || "N/A"}</Typography>
        </StyledTextField>

        <StyledTextField>
          <Typography variant="subtitle2">Описание</Typography>
          <Typography variant="body1">{visitData?.description || "N/A"}</Typography>
        </StyledTextField>

        <StyledTextField>
          <Typography variant="subtitle2">Статус:</Typography>
          <Typography variant="body1">
            {" "}
            {visitData?.status ? "Сделано" : visitData?.postpone ? "Отложено" : "В очереди"}
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
};

export default SimpleDialog;
