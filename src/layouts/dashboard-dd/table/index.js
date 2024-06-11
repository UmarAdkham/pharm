import { useState } from "react";
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
}) {
  const navigate = useNavigate();
  const [fieldForceManager, setFieldForceManager] = useState("");
  const [regionalManager, setRegionalManager] = useState("");

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

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {title}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="field-force-manager-label">Field Force Manager</InputLabel>
            <Select
              labelId="field-force-manager-label"
              value={fieldForceManager}
              onChange={(e) => setFieldForceManager(e.target.value)}
              label="Field Force Manager"
              sx={{ height: "45px" }}
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="regional-manager-label">Regional Manager</InputLabel>
            <Select
              labelId="regional-manager-label"
              value={regionalManager}
              onChange={(e) => setRegionalManager(e.target.value)}
              label="Regional Manager"
              sx={{ height: "45px" }}
            >
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
            </Select>
          </FormControl>
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
  navigateState: PropTypes.object, // to pass user object when necessary
};

DeputyDirectorTable.defaultProps = {
  title: "",
  onRowClick: () => {},
  showAddButton: true, // Default to no-op function if not provided
};

export default DeputyDirectorTable;
