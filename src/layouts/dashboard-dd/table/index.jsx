import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useCategoryData from "./data/category-data";
import useManufacturerCompanyData from "./data/manufacturer-company-data";
import useProductData from "./data/product-data";
import useRegionData from "./data/region-data";
import useMedicalOrganizationData from "./data/medorg-data";
import useSpecialityData from "./data/speciality-data";
import { useNavigate } from "react-router-dom";
import usePmData from "./data/pm-data";
import useMrData from "./data/mr-data";
import usePharmacyPlanData from "./data/pharmacy-plan-data";
import useDoctorPlanData from "./data/doctor-plan-data";
import usePharmacyData from "./data/mr-pharmacies-data";
import useDoctorData from "./data/mr-doctors-data";
import useNotificationData from "./data/notification-data";
import userRoles from "constants/userRoles";
import { useSelector } from "react-redux";
import axios from "axios";
import VisitDialog from "../dialogs/visit-dialog";
import SelectCategory from "../components/category-menu";
import useProductCategoryData from "./data/product-category-data";
import PharmacyInfoDialog from "../dialogs/pharmacy-info-dialog";
import DoctorInfoDialog from "../dialogs/doctor-info-dialog";
import ConfirmDialog from "../dialogs/confirm-dialog";
import NotificationDialog from "../dialogs/notification-dialog";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ManagersMenu from "../components/managers-menu";
import months from "../../../constants/months"; // Import the Russian month names

function DeputyDirectorTable({
  path,
  status,
  title,
  tableType,
  navigatePath,
  onRowClick,
  showAddButton,
  rowPath,
  navigateState,
  showFilters,
  selectDatas,
}) {
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [visitDialogOpen, setVisitDialogOpen] = useState(false); // State to manage visit dialog open/close
  const [visitId, setVisitId] = useState(-1);
  const [visitType, setVisitType] = useState("");
  const [doctorDialogOpen, setDoctorDialogOpen] = useState(false); // State to manage doctor info dialog
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, planId: null, planType: "" });
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); // State to store selected doctor ID
  const [pharmacyDialogOpen, setPharmacyDialogOpen] = useState(false); // State to manage pharmacy info dialog
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(null); // State to store selected pharmacy ID
  const [notificationId, setNotificationId] = useState(-1);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [region, setRegion] = useState("");
  const [ff_manager, setFf_manager] = useState("");
  const [product_manager, setProduct_manager] = useState("");
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString().padStart(2, "0")); // State to store selected month

  const handleDeleteDialogOpen = useCallback((planId, planType) => {
    setDeleteDialog({ isOpen: true, planId, planType });
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialog({ isOpen: false, planId: null, planType: "" });
  }, []);

  const handleVisitDialogOpen = useCallback((visitId, visitType) => {
    setVisitId(visitId);
    setVisitType(visitType);
    setVisitDialogOpen(true);
  }, []);

  const handleVisitDialogClose = useCallback(() => {
    setVisitDialogOpen(false);
    setVisitId(-1); // Reset visitId
    setVisitType(""); // Reset visitType
  }, []);

  const handleNotificationDialogOpen = useCallback((id) => {
    setNotificationId(id);
    setNotificationOpen(true);
  }, []);

  const handleNotificationDialogClose = useCallback(() => {
    setNotificationOpen(false);
  }, []);

  const handleDoctorDialogOpen = useCallback((doctorId) => {
    setSelectedDoctorId(doctorId);
    setDoctorDialogOpen(true);
  }, []);

  const handleDoctorDialogClose = useCallback(() => {
    setDoctorDialogOpen(false);
    setSelectedDoctorId(null);
  }, []);

  const handlePharmacyDialogOpen = useCallback((pharmacyId) => {
    setSelectedPharmacyId(pharmacyId);
    setPharmacyDialogOpen(true);
  }, []);

  const handlePharmacyDialogClose = useCallback(() => {
    setPharmacyDialogOpen(false);
    setSelectedPharmacyId(null);
  }, []);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  let tableData = { columns: [], rows: [] };
  let deletePharmacyPlanFunction = () => {};
  let deleteDoctorPlanFunction = () => {};
  let deleteNotificationFunction = () => {};

  switch (tableType) {
    case "categories":
      tableData = useCategoryData(path) || tableData;
      break;
    case "product-categories":
      tableData = useProductCategoryData(path) || tableData;
      break;
    case "manufacturer-companies":
      tableData = useManufacturerCompanyData(path) || tableData;
      break;
    case "products":
      tableData =
        useProductData(path, selectDatas?.[0]?.categori, selectDatas?.[1]?.categori) || tableData;
      break;
    case "regions":
      tableData = useRegionData(path) || tableData;
      break;
    case "medical-organizations":
      tableData = useMedicalOrganizationData(path) || tableData;
      break;
    case "specialities":
      tableData = useSpecialityData(path) || tableData;
      break;
    case "pms":
      tableData = usePmData(path, status, navigatePath, onRowClick, rowPath) || tableData;
      break;
    case "mrs":
      tableData =
        useMrData(path, status, navigatePath, onRowClick, region, ff_manager, product_manager) ||
        tableData;
      break;
    case "pharmacy-plan":
      const pharmacyPlanData =
        usePharmacyPlanData(path, handleVisitDialogOpen, handleDeleteDialogOpen, selectedMonth) ||
        {};
      tableData = pharmacyPlanData.data || tableData;
      deletePharmacyPlanFunction = pharmacyPlanData.deletePharmacyPlan || (() => {});
      break;
    case "doctor-plan":
      const doctorPlanData =
        useDoctorPlanData(path, handleVisitDialogOpen, handleDeleteDialogOpen, selectedMonth) || {};
      tableData = doctorPlanData.data || tableData;
      deleteDoctorPlanFunction = doctorPlanData.deleteDoctorPlan || (() => {});
      break;
    case "mr-pharmacies":
      tableData = usePharmacyData(path, handlePharmacyDialogOpen) || tableData;
      break;
    case "mr-doctors":
      tableData = useDoctorData(path, handleDoctorDialogOpen) || tableData;
      break;
    case "notifications":
      const notificationData =
        useNotificationData(path, handleDeleteDialogOpen, handleNotificationDialogOpen) || {};
      tableData = notificationData.data || tableData;
      deleteNotificationFunction = notificationData.deleteNotification || (() => {});
      break;
    default:
      break;
  }
  const { columns, rows } = tableData;

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {title}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          {(tableType === "doctor-plan" || tableType === "pharmacy-plan") && (
            <FormControl variant="outlined" sx={{ minWidth: 120, marginRight: 2 }}>
              <InputLabel>Месяц</InputLabel>
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                label="Месяц"
                sx={{ height: "45px" }}
              >
                {months.map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {showFilters && (
            <>
              {selectDatas?.[0] && <SelectCategory selectDatas={selectDatas[0]} />}
              {selectDatas?.[1] && <SelectCategory selectDatas={selectDatas[1]} />}

              {!selectDatas?.[0] && !selectDatas?.[1] && (
                <ManagersMenu
                  setFf_manager={setFf_manager}
                  setRegion={setRegion}
                  setProduct_manager={setProduct_manager}
                  ff_manager={ff_manager}
                  region={region}
                  product_manager={product_manager}
                />
              )}
            </>
          )}

          {showAddButton && (
            <MDBox>
              <Button
                variant="contained"
                color="success"
                sx={{ color: "white" }}
                onClick={() => {
                  navigateState
                    ? navigate(navigatePath, { state: navigateState })
                    : navigate(navigatePath);
                }}
              >
                Добавить
              </Button>
            </MDBox>
          )}
        </MDBox>
      </MDBox>
      <MDBox>
        <DataTable
          table={{
            columns,
            rows,
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>

      <VisitDialog
        open={visitDialogOpen}
        onClose={handleVisitDialogClose}
        visitId={visitId}
        visitType={visitType}
      />

      <DoctorInfoDialog
        open={doctorDialogOpen}
        onClose={handleDoctorDialogClose}
        doctorId={selectedDoctorId}
      />

      <PharmacyInfoDialog
        open={pharmacyDialogOpen}
        onClose={handlePharmacyDialogClose}
        pharmacyId={selectedPharmacyId}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteDialogClose}
        planId={deleteDialog.planId}
        planType={deleteDialog.planType}
        onDelete={
          deleteDialog.planType === "pharmacy-plan"
            ? deletePharmacyPlanFunction
            : deleteDialog.planType === "doctor-plan"
            ? deleteDoctorPlanFunction
            : deleteNotificationFunction
        }
      />

      <NotificationDialog
        open={notificationOpen}
        onClose={handleNotificationDialogClose}
        notificationId={notificationId}
      />
    </Card>
  );
}

DeputyDirectorTable.propTypes = {
  path: PropTypes.string,
  status: PropTypes.string,
  title: PropTypes.string,
  tableType: PropTypes.string,
  navigatePath: PropTypes.string,
  rowPath: PropTypes.string,
  onRowClick: PropTypes.func,
  showAddButton: PropTypes.bool,
  showFilters: PropTypes.bool,
  navigateState: PropTypes.object,
  selectDatas: PropTypes.arrayOf(PropTypes.object),
};

DeputyDirectorTable.defaultProps = {
  title: "",
  onRowClick: () => {},
  showAddButton: true,
  showFilters: false,
  selectDatas: [],
};

export default DeputyDirectorTable;
