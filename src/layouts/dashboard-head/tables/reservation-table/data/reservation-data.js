import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { format } from "date-fns";
import { IconButton, Switch, Tooltip, Snackbar, Alert, Button } from "@mui/material";
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

      const now = new Date();

      const filteredReservations = response.data.filter(
        (reservation) => new Date(reservation.expire_date) >= now
      );

      const reservations = filteredReservations.sort((a, b) => a.id - b.id);

      const columns = [
        { Header: "Сумма с/ф", accessor: "total_payable", align: "left" },
        { Header: "Контрагент", accessor: "company_name", align: "left" },
        { Header: "Регион", accessor: "region", align: "left" },
        { Header: "МП", accessor: "med_rep", align: "left" },
        { Header: "Тип К/А", accessor: "type", align: "center" },
        { Header: "Скидка %", accessor: "discount", align: "center" },
        { Header: "Дата брони", accessor: "date_reservation", align: "left" },
        { Header: "Одобрено", accessor: "checked", align: "left" },
        { Header: "Производитель", accessor: "man_company", align: "left" },
        { Header: "Промо", accessor: "promo", align: "left" },
        { Header: "Поступление", accessor: "add", align: "left" },
        { Header: "Скачать", accessor: "download", align: "center" },
      ];

      const rows = reservations.map((rsrv) => {
        const entity = rsrv.pharmacy || rsrv.hospital;
        return {
          ...rsrv,
          total_payable: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.total_payable_with_nds.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          company_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {entity.company_name}
            </MDTypography>
          ),
          region: (
            <MDTypography variant="caption" fontWeight="medium">
              {entity.region ? entity.region.name : "-"}
            </MDTypography>
          ),
          med_rep: (
            <MDTypography variant="caption" fontWeight="medium">
              {entity.med_rep.full_name}
            </MDTypography>
          ),
          type: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.pharmacy ? "Аптека" : "Больница"}
            </MDTypography>
          ),
          discount: (
            <MDTypography variant="caption" fontWeight="medium">
              {`${rsrv.discount} %`}
            </MDTypography>
          ),
          date_reservation: (
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(rsrv.date), "MM-dd-yyyy")}
            </MDTypography>
          ),
          checked: getStatusIndicator(rsrv.checked),
          check: <Switch checked={rsrv.checked} onChange={() => confirmToggle(rsrv)} />,
          man_company: (
            <MDTypography variant="caption" fontWeight="medium">
              {entity.manufactured_company}
            </MDTypography>
          ),
          promo: (
            <MDTypography variant="caption" fontWeight="medium">
              {entity.promo}
            </MDTypography>
          ),
          add: (
            <Button
              variant="contained"
              color="success"
              sx={{ color: "white" }}
              onClick={() => {}}
              style={{ cursor: "pointer" }}
            >
              Поступление
            </Button>
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
        };
      });
      setData({ columns, rows });
    } catch (error) {
      console.error("Error fetching reservations", error);
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
