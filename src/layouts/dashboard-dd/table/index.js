import { useEffect, useState } from "react";
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
}) {
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [selectedFFM, setSelectedFFM] = useState(null);
  const [selectedRM, setSelectedRM] = useState(null); // State to track the selected Regional Manager
  const [fieldForceManagers, setFieldForceManagers] = useState([]);
  const [regionalManagers, setRegionalManagers] = useState([]); // State to store the list of Regional Managers

  let data = { columns: [], rows: [] }; // Default structure
  switch (tableType) {
    case "categories":
      data = useCategoryData(path) || data;
      break;
    case "manufacturer-companies":
      data = useManufacturerCompanyData(path) || data;
      break;
    case "products":
      data = useProductData(path) || data;
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
      data = usePharmacyPlanData(path) || data;
      break;
    case "doctor-plan":
      data = useDoctorPlanData(path) || data;
      break;
    case "mr-pharmacies":
      data = usePharmacyData(path) || data;
      break;
    case "mr-doctors":
      data = useDoctorData(path) || data;
      break;
    case "notifications":
      data = useNotificationData(path) || data;
      break;
    default:
      break;
  }
  const { columns, rows } = data;

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
              <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="field-force-manager-label">Field Force Manager</InputLabel>
                <Select
                  labelId="field-force-manager-label"
                  value={selectedFFM}
                  onChange={(e) => setSelectedFFM(e.target.value)}
                  label="Field Force Manager"
                  sx={{ height: "45px" }}
                >
                  {fieldForceManagers.map((ffm) => (
                    <MenuItem key={ffm.id} value={ffm}>
                      {ffm.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="regional-manager-label">Regional Manager</InputLabel>
                <Select
                  labelId="regional-manager-label"
                  value={selectedRM}
                  onChange={(e) => setSelectedRM(e.target.value)}
                  label="Regional Manager"
                  sx={{ height: "45px" }}
                >
                  {regionalManagers.map((rm) => (
                    <MenuItem key={rm.id} value={rm}>
                      {rm.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
};

DeputyDirectorTable.defaultProps = {
  title: "",
  onRowClick: () => {},
  showAddButton: true,
  showFilters: false,
};

export default DeputyDirectorTable;
