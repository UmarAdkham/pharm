import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { format } from "date-fns";
import { IconButton, Switch, Tooltip, Snackbar, Alert, Button } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ViewProductListDialog from "../../../dialogs/reservation-product-list-dialog";
import axiosInstance from "services/axiosInstance";
import ExpiryDateDialog from "layouts/dashboard-head/dialogs/edit-expiry-date-dialog";
import { useNavigate } from "react-router-dom";
import userRoles from "constants/userRoles";
import ViewReservationHistory from "layouts/dashboard-head/dialogs/view-reservation-history";

export default function useReservationData(apiPath, month) {
  const navigate = useNavigate();
  const [data, setData] = useState({ columns: [], rows: [] });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [open, setOpen] = useState(false);
  const [reservation, setReservation] = useState({});
  const [productListDialogOpen, setProductListDialogOpen] = useState(false);

  const handleProductListDialogOpen = () => {
    setProductListDialogOpen(true);
  };

  const handleProductListDialogClose = () => {
    setProductListDialogOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [overall, setOverall] = useState({
    numberOfInvoices: 0,
    invoiceAmount: 0,
    profit: 0,
    debt: 0,
    promo: 0,
  });
  const { accessToken, userRole } = useSelector((state) => state.auth);

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
    const type = getRsrvType(selectedReservation);
    try {
      await axiosInstance.post(
        `https://it-club.uz/head/update-${
          type === "pharmacy" ? "" : `${type}-`
        }reservation-expire-date/${selectedReservation.id}`,
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

      const overallValues = {
        numberOfInvoices: reservations.length,
        invoiceAmount: reservations.reduce((sum, r) => sum + r.total_payable_with_nds, 0),
        profit: reservations.reduce((sum, r) => sum + r.profit, 0),
        debt: reservations.reduce((sum, r) => sum + r.debt, 0),
        promo: reservations.reduce((sum, r) => {
          const promo = r.pharmacy?.promo || r.hospital?.promo || 0;
          return sum + promo;
        }, 0),
      };

      let columns = [
        { Header: "Дата  реализаци", accessor: "expiry_date", align: "left" },
        { Header: "Сумма с/ф", accessor: "total_payable", align: "left" },
        { Header: "Номер с/ф", accessor: "invoice_number", align: "left" },
        { Header: "Контрагент", accessor: "company_name", align: "left" },
        { Header: "Регион", accessor: "region", align: "left" },
        { Header: "МП", accessor: "med_rep", align: "left" },
        { Header: "Тип К/А", accessor: "type", align: "center" },
        { Header: "ИНН", accessor: "ibt", align: "center" },
        { Header: "Поступление", accessor: "profit", align: "center" },
        { Header: "Дебитор", accessor: "debt", align: "center" },
        { Header: "Скидка %", accessor: "discount", align: "center" },
        { Header: "Дата брони", accessor: "date_reservation", align: "left" },
        { Header: "Одобрено", accessor: "check", align: "left" },
        { Header: "Производитель", accessor: "man_company", align: "left" },
        { Header: "Промо", accessor: "promo", align: "left" },
        { Header: "Скачать", accessor: "download", align: "center" },
      ];

      if (userRole === userRoles.HEAD_OF_ORDERS) {
        columns.splice(
          -1,
          0,
          { Header: "Действие", accessor: "add", align: "left" },
          { Header: "История Поступлений", accessor: "view", align: "left" },
          { Header: "Список продуктов", accessor: "product_list", align: "center" }
        );
      }

      const rows = reservations.map((rsrv) => {
        const entity = rsrv.pharmacy || rsrv.hospital || rsrv.wholesale;
        return {
          ...rsrv,
          expiry_date: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <MDTypography variant="caption" fontWeight="medium">
                {format(new Date(rsrv.expire_date), "MM-dd-yyyy")}
              </MDTypography>
              {userRole === userRoles.HEAD_OF_ORDERS && (
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(rsrv)}
                  style={{ marginLeft: "8px" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          ),
          total_payable: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.total_payable_with_nds.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          invoice_number: (
            <MDTypography variant="caption" fontWeight="medium">
              <div style={{ display: "flex", alignItems: "center" }}>
                <MDTypography variant="caption" fontWeight="medium">
                  {rsrv.invoice_number}
                </MDTypography>
                {userRole === userRoles.HEAD_OF_ORDERS && (
                  <IconButton
                    size="small"
                    onClick={() =>
                      navigate("/head/set-invoice-number", {
                        state: { reservationId: rsrv.id, type: getRsrvType(rsrv) },
                      })
                    }
                    style={{ marginLeft: "8px" }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
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
              {entity.med_rep?.full_name || "-"}
            </MDTypography>
          ),
          type: (
            <MDTypography variant="caption" fontWeight="medium">
              {getRsrvTypeRussian(rsrv)}
            </MDTypography>
          ),
          ibt: (
            <MDTypography variant="caption" fontWeight="medium">
              {entity.inter_branch_turnover || "-"}
            </MDTypography>
          ),
          profit: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.profit.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          debt: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.debt.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          discount: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <MDTypography variant="caption" fontWeight="medium">
                {rsrv.discount ? `${rsrv.discount} %` : "0"}
              </MDTypography>
              {userRole === userRoles.HEAD_OF_ORDERS && (
                <IconButton
                  size="small"
                  onClick={() =>
                    navigate("/head/set-discount", {
                      state: { reservationId: rsrv.id, type: getRsrvType(rsrv) },
                    })
                  }
                  style={{ marginLeft: "8px" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          ),
          date_reservation: (
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(rsrv.date), "MM-dd-yyyy")}
            </MDTypography>
          ),
          checked: getStatusIndicator(rsrv.checked),
          check:
            // Display Switch to toggle the value only for head of orders
            userRole === userRoles.HEAD_OF_ORDERS ? (
              <Switch checked={rsrv.checked} onChange={() => confirmToggle(rsrv)} color="warning" />
            ) : (
              // Other userRoles can only see the value
              getStatusIndicator(rsrv.checked)
            ),
          man_company: (
            <MDTypography variant="caption" fontWeight="medium">
              {entity.manufactured_company || "-"}
            </MDTypography>
          ),
          promo: (
            <MDTypography variant="caption" fontWeight="medium">
              {entity.promo?.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          add: (
            <Button
              variant="contained"
              color="success"
              sx={{ color: "white" }}
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/head/pay-reservation", {
                  state: { reservationId: rsrv.id, type: getRsrvType(rsrv) },
                });
              }}
            >
              Поступление
            </Button>
          ),
          view: (
            <Tooltip title="История поступлений">
              <IconButton
                onClick={() => {
                  handleClickOpen();
                  setReservation({ id: rsrv.id, type: getRsrvType(rsrv) });
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e0f2f1",
                  },
                }}
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>
          ),
          download: (
            <Tooltip title="Загрузить отчет">
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
            </Tooltip>
          ),
          product_list: (
            <Tooltip title="Просмотр списка продуктов">
              <IconButton
                onClick={() => {
                  setReservation({ id: rsrv.id, type: !!rsrv.pharmacy });
                  handleProductListDialogOpen(rsrv);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#e0f2f1",
                  },
                }}
              >
                <RemoveRedEyeIcon />
              </IconButton>
            </Tooltip>
          ),
        };
      });
      setData({ columns, rows });
      setOverall(overallValues);
    } catch (error) {
      console.error("Error fetching reservations", error);
    }
  }

  function getRsrvType(rsrv) {
    if (rsrv.pharmacy) {
      return "pharmacy";
    } else if (rsrv.hospital) {
      return "hospital";
    } else if (rsrv.wholesale) {
      return "wholesale";
    }
  }

  function getRsrvTypeRussian(rsrv) {
    if (rsrv.pharmacy) {
      return "Аптека";
    } else if (rsrv.hospital) {
      return "Больница";
    } else if (rsrv.wholesale) {
      return "Оптовик";
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
    if (rsrv.checked) {
      setSnackbar({
        open: true,
        message: "Уже одобрено",
        severity: "warning",
      });
    } else {
      if (window.confirm("Вы уверены что хотите выполнить это действие?")) {
        toggleChecked(rsrv);
      }
    }
  }

  async function toggleChecked(rsrv) {
    const newChecked = !rsrv.checked;
    const type = getRsrvType(rsrv);
    try {
      await axiosInstance.post(
        `https://it-club.uz/head/check-${type === "pharmacy" ? "" : `${type}-`}reservation/${
          rsrv.id
        }`,
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
      setSnackbar({
        open: true,
        message: "Одобрено",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail,
        severity: "error",
      });
    }
  }

  function downloadReport(rsrv) {
    const type = getRsrvType(rsrv);
    const entity = rsrv.pharmacy || rsrv.hospital || rsrv.wholesale;
    const url =
      type === "wholesale"
        ? `https://it-club.uz/ws/get-wholesale-report/${rsrv.id}`
        : `https://it-club.uz/mr/get-${type === "pharmacy" ? "" : `${type}-`}report/${rsrv.id}`;
    axios({
      url: url,
      method: "GET",
      responseType: "blob", // Important
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        let filename = `${entity.company_name}_${format(new Date(rsrv.date), "MM-dd-yyyy")}`;

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
    overall,
    ExpiryDateDialogComponent: (
      <>
        <ExpiryDateDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          handleSubmit={handleUpdateExpiryDate}
          currentExpiryDate={selectedReservation?.expire_date}
          startDate={selectedReservation?.date_reservation}
        />
        <ViewReservationHistory open={open} handleClose={handleClose} reservation={reservation} />
        <ViewProductListDialog
          open={productListDialogOpen}
          handleClose={handleProductListDialogClose}
          reservation={reservation}
        />
      </>
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
