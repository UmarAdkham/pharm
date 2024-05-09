import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { useMaterialUIController, setOpenConfigurator } from "context";
import ProtectedRoutes from "protected-routes";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import userRoles from "./constants/userRoles";
import roleBasedRedirect from "./constants/roleBasedDashboards";

// Import all dashboard components

// Dashboard Wrapper
import DashboardWrapper from "layouts/dashboard-wrapper";
import DirectorDashboard from "layouts/dashboard-director";
import DeputyDirectorDashboard from "layouts/dashboard-dd";
import ProductManagerDashboard from "layouts/dashboard-pm";
import FieldForceDashboard from "layouts/dashboard-ff";
import RegionalManagerDashboard from "layouts/dashboard-rm";
import MedRepresentativeDashboard from "layouts/dashboard-mr";

export default function App() {
  // Access the global UI controller state
  const [controller, dispatch] = useMaterialUIController();
  const { direction, layout, openConfigurator, darkMode } = controller;
  const { pathname } = useLocation();

  // Update the document direction
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Reset page scroll position when changing routes
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {/* Configurator visible only in "vr" mode */}
      {layout === "vr" && <Configurator />}

      <Routes>
        {/* Authentication routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Director Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.DIRECTOR]} />}>
          <Route
            path="/dashboard-director"
            element={
              <DashboardWrapper>
                <DirectorDashboard />
              </DashboardWrapper>
            }
          />
        </Route>

        {/* Deputy Director Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.DEPUTY_DIRECTOR]} />}>
          <Route
            path="/dashboard-dd"
            element={
              <DashboardWrapper>
                <DeputyDirectorDashboard />
              </DashboardWrapper>
            }
          />
        </Route>

        {/* Product Manager Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.PRODUCT_MANAGER]} />}>
          <Route
            path="/dashboard-pm"
            element={
              <DashboardWrapper>
                <ProductManagerDashboard />
              </DashboardWrapper>
            }
          />
        </Route>

        {/* Field Force Manager Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.FIELD_FORCE_MANAGER]} />}>
          <Route
            path="/dashboard-ff"
            element={
              <DashboardWrapper>
                <FieldForceDashboard />
              </DashboardWrapper>
            }
          />
        </Route>

        {/* Regional Manager Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.REGIONAL_MANAGER]} />}>
          <Route
            path="/dashboard-rm"
            element={
              <DashboardWrapper>
                <RegionalManagerDashboard />
              </DashboardWrapper>
            }
          />
        </Route>

        {/* Medical Representative Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.MEDICAL_REPRESENTATIVE]} />}>
          <Route
            path="/dashboard-mr"
            element={
              <DashboardWrapper>
                <MedRepresentativeDashboard />
              </DashboardWrapper>
            }
          />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}
