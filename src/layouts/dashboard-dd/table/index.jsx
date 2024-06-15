import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
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
import VisitDialog from "../dialogs/visit-dialog";
import SelectCategory from "../components/category";
import useProductCategoryData from "./data/product-category-data";
import DoctorInfoDialog from "../dialogs/doctor-info-dialog";
import PharmacyInfoDialog from "../dialogs/pharmacy-info-dialog";
import ConfirmDialog from "../dialogs/confirm-dialog";

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
  const [visitDialogOpen, setVisitDialogOpen] = useState(false); // State to manage visit dialog open/close
  const [visitId, setVisitId] = useState(-1);
  const [visitType, setVisitType] = useState("");
  const [doctorDialogOpen, setDoctorDialogOpen] = useState(false); // State to manage doctor info dialog
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); // State to store selected doctor ID
  const [pharmacyDialogOpen, setPharmacyDialogOpen] = useState(false); // State to manage pharmacy info dialog
  const [selectedPharmacyId, setSelectedPharmacyId] = useState(null); // State to store selected pharmacy ID
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planId, setPlanId] = useState("");
  const [planType, setPlanType] = useState("");

  const handleDeleteDialogOpen = useCallback((planId, planType) => {
    setPlanType(planType);
    setPlanId(planId);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
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

  let data = { columns: [], rows: [] }; // Default structure
  switch (tableType) {
    case "categories":
      data = useCategoryData(path) || data;
      break;
    case "product-categories":
      data = useProductCategoryData(path) || data;
      break;
    case "manufacturer-companies":
      data = useManufacturerCompanyData(path) || data;
      break;
    case "products":
      data = useProductData(path, selectDatas?.[0]?.categori, selectDatas?.[1]?.categori) || data;
      break;
    case "regions":
      data = useRegionData(path) || data;
      break;
    case "medical-organizations":
      data = useMedicalOrganizationData(path) || data;
      break;
    case "specialities":
      data = useSpecialityData(path) || data;
      break;
    case "pms":
      data = usePmData(path, status, navigatePath, onRowClick, rowPath) || data;
      break;
    case "mrs":
      data = useMrData(path, status, navigatePath, onRowClick) || data;
      break;
    case "pharmacy-plan":
      data = usePharmacyPlanData(path, handleVisitDialogOpen) || data;
      break;
    case "doctor-plan":
      data = useDoctorPlanData(path, handleVisitDialogOpen, handleDeleteDialogOpen) || data; // Pass handleVisitDialogOpen to useDoctorPlanData
      break;
    case "mr-pharmacies":
      data = usePharmacyData(path, handlePharmacyDialogOpen) || data;
      break;
    case "mr-doctors":
      data = useDoctorData(path, handleDoctorDialogOpen) || data; // Pass handleDoctorDialogOpen to useDoctorData
      break;
    case "notifications":
      data = useNotificationData(path) || data;
      break;
    default:
      break;
  }
  const { columns, rows } = data;

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
        planId={planId}
        planType={planType}
        isOpen={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
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
