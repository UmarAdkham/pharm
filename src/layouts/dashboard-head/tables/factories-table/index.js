import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useManufacturerCompanyData from "./data/factories-data";
import PropTypes from "prop-types";

function FactoriesTable({ handleRowClick }) {
  const { columns, rows } = useManufacturerCompanyData(
    "common/get-manufactured-company",
    handleRowClick
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Производственные компании
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

FactoriesTable.propTypes = {
  handleRowClick: PropTypes.func,
};

export default FactoriesTable;
