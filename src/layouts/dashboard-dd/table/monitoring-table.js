import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";
import useLoginMonitoringData from "./data/monitoring-data";

// eslint-disable-next-line react/prop-types
function DeputyDirectorLoginMonitoringTable({ loginData }) {
  const { columns, rows } = useLoginMonitoringData(loginData);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Мониторинг
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
          entriesPerPage={{ defaultValue: 1000 }}
        />
      </MDBox>
    </Card>
  );
}

export default DeputyDirectorLoginMonitoringTable;
