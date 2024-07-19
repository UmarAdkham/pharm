import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { format } from "date-fns";
import { IconButton, Switch, Tooltip, Snackbar, Alert } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EditIcon from "@mui/icons-material/Edit";
import axiosInstance from "services/axiosInstance";
import ExpiryDateDialog from "layouts/dashboard-head/dialogs/edit-expiry-date-dialog";
import { useNavigate } from "react-router-dom";

export default function useReservationData(apiPath) {
  const navigate = useNavigate();
  const [data, setData] = useState({ columns: [], rows: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    fetchReservations();
  }, [accessToken, apiPath]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (reservation) => {
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpdateExpiryDate = async (newDate) => {
    try {
      await axiosInstance.post(
        `https://it-club.uz/head/update-reservation-expire-date/${selectedReservation.id}`,
        { date: newDate },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchReservations(); // Refresh the data
      setSnackbar({
        open: true,
        message: "Срок истечения изменен!",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update expiry date", error);
      setSnackbar({ open: true, message: "Не удалось изменить срок истечения", severity: "error" });
    }
    handleCloseDialog();
  };

  async function fetchReservations() {
    try {
      const response = await axiosInstance.get(apiPath, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Ass", response.data[0]["pharmacy" || "hospital"]?.company_name);

      const now = new Date();

      const filteredReservations = response.data.filter(
        (reservation) => new Date(reservation.expire_date) >= now
      );

      const reservations = filteredReservations.sort((a, b) => a.id - b.id);

      console.log("uebne", reservations);

      const columns = [
        { Header: "Аптека", accessor: "pharmacy_name", align: "left" },
        { Header: "Медицинский представитель", accessor: "med_rep_name", align: "left" },
        { Header: "Сумма к оплате", accessor: "total_payable", align: "left" },
        { Header: "Скидка", accessor: "discount", align: "left" },
        { Header: "Статус", accessor: "status", align: "center" },
        { Header: "Проверить", accessor: "check", align: "center" },
        { Header: "Дата", accessor: "date", align: "left" },
        { Header: "Дата истечения", accessor: "expiry_date", align: "left" },
        { Header: "Скачать", accessor: "download", align: "center" },
      ];

      const rows = reservations.map((rsrv) => ({
        ...rsrv,
        pharmacy_name: (
          <MDTypography variant="caption" fontWeight="medium">
            {rsrv.pharmacy ? rsrv.pharmacy.company_name : rsrv.hospital.company_name || "as"}
          </MDTypography>
        ),
        med_rep_name: (
          <MDTypography variant="caption" fontWeight="medium">
            {rsrv.pharmacy ? rsrv.pharmacy : rsrv.hospital.med_rep.full_name}
          </MDTypography>
        ),
        total_payable: (
          <MDTypography variant="caption" fontWeight="medium">
            {rsrv.total_payable_with_nds}
          </MDTypography>
        ),
        discount: (
          <>
            <MDTypography variant="caption" fontWeight="medium">
              {`${rsrv.discount} %`}
            </MDTypography>
            <Tooltip title="Установить скидку">
              <IconButton
                sx={{
                  "&:hover": {
                    backgroundColor: "#e0f2f1",
                  },
                }}
                onClick={() => {
                  navigate("/head/set-discount", { state: rsrv.id });
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </>
        ),
        status: getStatusIndicator(rsrv.checked),
        check: <Switch checked={rsrv.checked} onChange={() => confirmToggle(rsrv)} />,
        date: (
          <MDTypography variant="caption" fontWeight="medium">
            {format(new Date(rsrv.date), "MM-dd-yyyy")}
          </MDTypography>
        ),
        expiry_date: (
          <>
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(rsrv.expire_date), "MM-dd-yyyy")}
            </MDTypography>
            <Tooltip title="Изменить дату истечения">
              <IconButton
                sx={{
                  "&:hover": {
                    backgroundColor: "#e0f2f1",
                  },
                }}
                onClick={() => handleOpenDialog(rsrv)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </>
        ),
        download: (
          <IconButton
            sx={{
              "&:hover": {
                backgroundColor: "#e0f2f1",
              },
            }}
            onClick={() => downloadReport(rsrv)}
          >
            <CloudDownloadIcon />
          </IconButton>
        ),
      }));
      console.log("rows", rows);
      setData({ columns, rows });
    } catch (error) {
      console.error("Error balosi ", error);
    }
  }

  function getStatusIndicator(checked) {
    return (
      <div
        style={{
          backgroundColor: checked ? "#57da79" : "#ffb938",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        <MDTypography
          variant="caption"
          fontWeight="medium"
          style={{
            color: "white",
          }}
        >
          {checked ? "Проверено" : "Не проверено"}
        </MDTypography>
      </div>
    );
  }

  function confirmToggle(rsrv) {
    if (window.confirm("Вы уверены что хотите выполнить это действие?")) {
      toggleChecked(rsrv);
    }
  }

  async function toggleChecked(rsrv) {
    const newChecked = !rsrv.checked;
    try {
      await axiosInstance.post(
        `https://it-club.uz/head/check-reservation/${rsrv.id}`,
        {
          checked: newChecked,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      rsrv.checked = newChecked;
      rsrv.status = getStatusIndicator(newChecked);
      fetchReservations(); // Refresh the data
    } catch (error) {
      console.error("Failed to update status", error);
    }
  }

  function downloadReport(rsrv) {
    axios({
      url: `https://it-club.uz/mr/get-report/${rsrv.id}`,
      method: "GET",
      responseType: "blob", // Important
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        let filename = `${rsrv.hospital.company_name}_${format(new Date(rsrv.date), "MM-dd-yyyy")}`;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.xlsx` || `report-${rsrv.id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Download error", error));
  }

  return {
    ...data,
    ExpiryDateDialogComponent: (
      <ExpiryDateDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSubmit={handleUpdateExpiryDate}
        initialDate={selectedReservation?.expire_date}
      />
    ),
    SnackbarComponent: (
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    ),
  };
}
