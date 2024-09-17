import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";
import useMrsMonitoringData from "./data/mr-monitoring-data";

function DeputyDirectorMrsMonitoringTable() {
  const { columns, rows } = useMrsMonitoringData();

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Медицинские представители
          </MDTypography>
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

DeputyDirectorMrsMonitoringTable.propTypes = {
  handleRowClick: PropTypes.func,
  selectedFactoryId: PropTypes.number.isRequired,
};

export default DeputyDirectorMrsMonitoringTable;
