// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Dashboard components
// import { Outlet } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import DeputyDirectorBonusTable from "../table/bonus-table";
import BonusHistoryTable from "../table/bonus-history-table";

function DeputyDirectorBonusHistory() {
  const location = useLocation();
  const { bonusId, doctorName } = location.state;

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <BonusHistoryTable bonusId={bonusId} doctorName={doctorName} />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default DeputyDirectorBonusHistory;
