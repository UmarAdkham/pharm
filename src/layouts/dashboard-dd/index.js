// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// Data
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import { Outlet } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function DeputyDirectorDashboard({ children }) {
  const { sales, tasks } = reportsLineChartData;

  return <></>;
}

export default DeputyDirectorDashboard;
