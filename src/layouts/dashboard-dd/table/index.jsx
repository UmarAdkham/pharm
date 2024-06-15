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
import useMedicalOrganizationData from "./data/medorg.-data";
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
import VisitDialog from "../modal/visit-dialog";
import SelectCategory from "../components/category";
import useProductCategoryData from "./data/product-category-data";
import ConfirmDialog from "../modal/confirm-dialog";
import NotificationDialog from "../modal/notification-dialog";

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
  const [selectedFFM, setSelectedFFM] = useState(null);
  const [selectedRM, setSelectedRM] = useState(null); // State to track the selected Regional Manager
  const [fieldForceManagers, setFieldForceManagers] = useState([]);
  const [regionalManagers, setRegionalManagers] = useState([]); // State to store the list of Regional Managers
  const [dialogOpen, setDialogOpen] = useState(false); // State to manage dialog open/close
  const [visitId, setVisitId] = useState(-1);
  const [visitType, setVisitType] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, planId: null, planType: "" });
  const [notificationId, setNotificationId] = useState(-1);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [deleteDoctorPlan, setDeleteDoctorPlan] = useState(() => () => {});
  const [deletePharmacyPlan, setDeletePharmacyPlan] = useState(() => () => {});

  const handleDeleteDialogOpen = useCallback((planId, planType) => {
    setDeleteDialog({ isOpen: true, planId, planType });
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialog({ isOpen: false, planId: null, planType: "" });
  }, []);

  const handleDialogOpen = useCallback((visitId, visitType) => {
    setVisitId(visitId);
    setVisitType(visitType);
    setDialogOpen(true);
  }, []);

  const handleNotificationDialogOpen = useCallback((id) => {
    setNotificationId(id);
    setNotificationOpen(true);
  }, []);

  const handleVisitDialogClose = useCallback(() => {
    setNotificationOpen(false);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setVisitId(-1); // Reset visitId
    setVisitType(""); // Reset visitType
  }, []);

  useEffect(() => {
    const fetchFieldForceManagers = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const fieldForceManagers = response.data.filter(
          (user) => user.status === userRoles.FIELD_FORCE_MANAGER
        );
        setFieldForceManagers(fieldForceManagers);
      } catch (error) {
        console.error("Не удалось получить пользователей:", error);
      }
    };

    const fetchRegionalManagers = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const regionalManagers = response.data.filter(
          (user) => user.status === userRoles.REGIONAL_MANAGER
        );
        setRegionalManagers(regionalManagers);
      } catch (error) {
        console.error("Не удалось получить пользователей:", error);
      }
    };

    fetchFieldForceManagers();
    fetchRegionalManagers();
  }, [accessToken]);

  let tableData = { columns: [], rows: [] };
  let deletePharmacyPlanFunction = () => {};
  let deleteDoctorPlanFunction = () => {};

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
      tableData = useMrData(path, status, navigatePath, onRowClick) || tableData;
      break;
    case "pharmacy-plan":
      const pharmacyPlanData =
        usePharmacyPlanData(path, handleDialogOpen, handleDeleteDialogOpen) || {};
      tableData = pharmacyPlanData.data || tableData;
      deletePharmacyPlanFunction = pharmacyPlanData.deletePharmacyPlan || (() => {});
      break;
    case "doctor-plan":
      const doctorPlanData =
        useDoctorPlanData(path, handleDialogOpen, handleDeleteDialogOpen) || {};
      tableData = doctorPlanData.data || tableData;
      deleteDoctorPlanFunction = doctorPlanData.deleteDoctorPlan || (() => {});
      break;
    case "mr-pharmacies":
      tableData = usePharmacyData(path) || tableData;
      break;
    case "mr-doctors":
      tableData = useDoctorData(path) || tableData;
      break;
    case "notifications":
      tableData =
        useNotificationData(path, handleDeleteDialogOpen, handleNotificationDialogOpen) ||
        tableData;
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
          {showFilters && (
            <>
              {selectDatas?.[0] && <SelectCategory selectDatas={selectDatas[0]} />}
              {selectDatas?.[1] && <SelectCategory selectDatas={selectDatas[1]} />}
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
        open={dialogOpen}
        onClose={handleDialogClose}
        visitId={visitId}
        visitType={visitType}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteDialogClose}
        planId={deleteDialog.planId}
        planType={deleteDialog.planType}
        onDelete={
          deleteDialog.planType === "pharmacy"
            ? deletePharmacyPlanFunction
            : deleteDoctorPlanFunction
        }
      />

      <NotificationDialog
        open={notificationOpen}
        onClose={handleVisitDialogClose}
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
