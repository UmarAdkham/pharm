import React, { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import CloseIcon from "@mui/icons-material/Close";
import "leaflet/dist/leaflet.css";
import IconButton from "@mui/material/IconButton";

export default function useLoginMonitoringData(loginData) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    function constructTable() {
      // Define columns
      const columns = [
        { Header: "Дата входа", accessor: "login_date", align: "left" },
        { Header: "Дата выхода", accessor: "logout_date", align: "left" },
        { Header: "Местоположение", accessor: "location", align: "left" },
        { Header: "Продолжительность", accessor: "duration", align: "left" },
      ];

      // Define rows
      const rows = loginData.map((session) => ({
        login_date: (
          <MDTypography variant="caption" fontWeight="medium">
            {new Date(session.login_date).toLocaleString()}
          </MDTypography>
        ),
        logout_date: (
          <MDTypography variant="caption" fontWeight="medium">
            {session.logout_date ? new Date(session.logout_date).toLocaleString() : "-"}
          </MDTypography>
        ),
        location: (
          <MDTypography
            variant="caption"
            fontWeight="medium"
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => handleRowClick(session.latitude, session.longitude)}
          >
            {session.location ? session.location : "н/д"}
          </MDTypography>
        ),
        duration: (
          <MDTypography variant="caption" fontWeight="medium">
            {session.durstion ? session.durstion : "-"}
          </MDTypography>
        ),
      }));

      setData({ columns, rows });
    }

    constructTable();
  }, [loginData]);

  const isValidCoordinate = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
  };

  const handleRowClick = (latitude, longitude) => {
    if (isValidCoordinate(latitude) && isValidCoordinate(longitude)) {
      setSelectedLocation({ latitude, longitude });
      setOpenDialog(true);
    } else {
      setSnackbarMessage("Invalid latitude or longitude");
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLocation(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return {
    columns: data.columns,
    rows: data.rows,
    DialogComponent: (
      <>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            Location Map
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {selectedLocation && (
            <MapContainer
              center={[
                parseFloat(selectedLocation.latitude),
                parseFloat(selectedLocation.longitude),
              ]}
              zoom={13}
              style={{ height: "400px", width: "600px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[
                  parseFloat(selectedLocation.latitude),
                  parseFloat(selectedLocation.longitude),
                ]}
              />
            </MapContainer>
          )}
        </Dialog>

        {/* Snackbar for displaying error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </>
    ),
  };
}
