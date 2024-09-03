import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { format, differenceInDays } from "date-fns";
import { IconButton, Switch, Tooltip, Snackbar, Alert, Button } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
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
  const [loading, setLoading] = useState(true); // Add loading state

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
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axiosInstance.get(apiPath, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const filteredReservations = response.data.sort((a, b) => {
        const dateComparison = new Date(b.date) - new Date(a.date);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        return b.id - a.id;
      });

      let columns = [
        { Header: "Дата реализаци", accessor: "expiry_date", align: "left" },
        { Header: "Сумма с/ф", accessor: "total_payable", align: "left" },
        { Header: "Номер с/ф", accessor: "invoice_number", align: "left" },
        { Header: "Контрагент", accessor: "company_name", align: "left" },
        { Header: "Поступление", accessor: "profit", align: "center" },
        { Header: "Дебитор", accessor: "debt", align: "center" },
        { Header: "Скидка %", accessor: "discount", align: "center" },
        { Header: "Дата брони", accessor: "date_reservation", align: "left" },
        { Header: "Одобрено", accessor: "check", align: "left" },
        { Header: "Производитель", accessor: "man_company", align: "left" },
        { Header: "Промо", accessor: "promo", align: "left" },
        { Header: "Возврат цена", accessor: "returned_price", align: "left" },
        { Header: "Регион", accessor: "region", align: "left" },
        { Header: "История Поступлений", accessor: "view", align: "left" },
        { Header: "Список продуктов", accessor: "product_list", align: "center" },
        { Header: "МП", accessor: "med_rep", align: "left" },
        { Header: "Тип К/А", accessor: "type", align: "center" },
        { Header: "ИНН", accessor: "ibt", align: "center" },
        { Header: "Скачать", accessor: "download", align: "center" },
      ];

      if (userRole === userRoles.HEAD_OF_ORDERS) {
        columns.splice(
          -1,
          0,
          { Header: "Возвратить", accessor: "return", align: "center" },
          { Header: "Удалить", accessor: "delete", align: "center" }
        );
        columns.splice(-8, 0, { Header: "Действие", accessor: "add", align: "left" });
      }

      let expired_debt = 0;
      const rows = filteredReservations.map((rsrv) => {
        const entity = rsrv.pharmacy || rsrv.hospital || rsrv.wholesale;
        const checked = rsrv.checked;
        const daysSinceImplementation = differenceInDays(
          new Date(),
          new Date(rsrv.date_implementation)
        );

        const rowBackgroundColor =
          rsrv.checked &&
          daysSinceImplementation > (getRsrvType(rsrv) === "wholesale" ? 60 : 30) &&
          rsrv.debt > 5000
            ? "#f77c48"
            : rsrv.checked && rsrv.debt < 5000
            ? "#88f2a1"
            : "white";

        if (rowBackgroundColor === "#f77c48") {
          expired_debt += rsrv.debt;
        }

        return {
          ...rsrv,
          expiry_date: (
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(rsrv.date_implementation), "dd/MM/yyyy")}
            </MDTypography>
          ),
          total_payable: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.total_payable_with_nds?.toLocaleString("ru-RU")} сум
            </MDTypography>
          ),
          invoice_number: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.invoice_number}
            </MDTypography>
          ),
          company_name: (
            <Tooltip title={entity.company_name} arrow>
              <MDTypography variant="caption" fontWeight="medium">
                {entity.company_name.length > 20
                  ? `${entity.company_name.substring(0, 20)}...`
                  : entity.company_name}
              </MDTypography>
            </Tooltip>
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
              {rsrv.checked ? rsrv.debt.toLocaleString("ru-RU") : 0}
            </MDTypography>
          ),
          discount: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.discount ? `${rsrv.discount} %` : "0"}
            </MDTypography>
          ),
          date_reservation: (
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(rsrv.date), "dd/MM/yyyy")}
            </MDTypography>
          ),
          checked: getStatusIndicator(rsrv.checked),
          check:
            userRole === userRoles.HEAD_OF_ORDERS ? (
              <Switch checked={rsrv.checked} onChange={() => confirmToggle(rsrv)} color="warning" />
            ) : (
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
          returned_price: (
            <MDTypography variant="caption" fontWeight="medium">
              {rsrv.returned_price?.toLocaleString("ru-RU")}
            </MDTypography>
          ),
          // Add other row fields as necessary
        };
      });

      setData({ columns, rows, expired_debt });
    } catch (error) {
      console.error("Error fetching reservations", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  }

  const handleDelete = async (rsrv) => {
    // Handle delete functionality...
  };

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
    // Handle toggle functionality...
  }

  function downloadReport(rsrv) {
    // Handle report download functionality...
  }

  return {
    ...data,
    loading, // Return loading state
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
