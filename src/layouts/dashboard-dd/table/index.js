import { useState } from "react";
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

function DeputyDirectorTable({ path, status, title, tableType, navigatePath, onRowClick, pmPath }) {
  const navigate = useNavigate();
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
      data = usePmData(path, status, navigatePath, onRowClick) || data;
      break;
    case "mrs":
      data = useMrData(path, status, navigatePath, onRowClick) || data;
      break;
    case "pharmacy-plan":
      data = usePharmacyPlanData(path) || data;
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
        <MDBox>
          <Button
            variant="contained"
            color="success"
            sx={{ color: "white" }}
            onClick={() => {
              navigate(navigatePath);
            }}
          >
            Добавить
          </Button>
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
  pmPath: PropTypes.string,
  onRowClick: PropTypes.func,
};

DeputyDirectorTable.defaultProps = {
  title: "",
  onRowClick: () => {}, // Default to no-op function if not provided
};

export default DeputyDirectorTable;
