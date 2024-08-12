import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { useNavigate } from "react-router-dom";
import axiosInstance from "services/axiosInstance";
import useMedicalOrganizationData from "./data/medorg-data";

function DeputyDirectorMedOrgTable({ title, navigatePath }) {
  const navigate = useNavigate();

  // State to store regions data
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Fetch regions data
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axiosInstance.get("common/get-regions");
        setRegions(response.data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    };

    fetchRegions();
  }, []);

  // Fetch and filter medical organization data based on selected region
  const { columns, rows } = useMedicalOrganizationData(selectedRegion);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {title}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          <MDBox mr={2}>
            <Autocomplete
              options={regions}
              getOptionLabel={(option) => option.name}
              sx={{ width: 250 }}
              onChange={(event, newValue) => {
                setSelectedRegion(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Регион" variant="outlined" />}
            />
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

DeputyDirectorMedOrgTable.propTypes = {
  path: PropTypes.string,
  title: PropTypes.string,
  navigatePath: PropTypes.string,
};

DeputyDirectorMedOrgTable.defaultProps = {
  title: "",
  onRowClick: () => {},
};

export default DeputyDirectorMedOrgTable;
