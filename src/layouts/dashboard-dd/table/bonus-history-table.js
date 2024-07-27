import React from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import PropTypes from "prop-types";
import useBonusHistoryData from "./data/bonus-history-data";

function BonusHistoryTable({ bonusId, doctorName }) {
  const { columns, rows } = useBonusHistoryData(bonusId);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {doctorName}: история бонусов
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox>
        {rows.length === 0 ? (
          <MDTypography variant="h6" align="center" gutterBottom>
            Пока бонусов нет
          </MDTypography>
        ) : (
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
        )}
      </MDBox>
    </Card>
  );
}

BonusHistoryTable.propTypes = {
  bonusId: PropTypes.integer,
  doctorName: PropTypes.string,
};

export default BonusHistoryTable;
