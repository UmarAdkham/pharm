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

// Import all dashboard components

// Dashboard Wrapper
import DashboardWrapper from "layouts/dashboard-wrapper";
import DirectorDashboard from "layouts/dashboard-director";
import DeputyDirectorDashboard from "layouts/dashboard-dd";
import ProductManagerDashboard from "layouts/dashboard-pm";
import RegionalManagerDashboard from "layouts/dashboard-rm";
import MedRepresentativeDashboard from "layouts/dashboard-mr";
import DirectorAdd from "layouts/dashboard-director/components/director-add";
import DeputyDirectorAdd from "layouts/dashboard-dd/components/dd-add";
import ProductManagerAdd from "layouts/dashboard-pm/components/pm-add";
import FieldForceManagerAdd from "layouts/dashboard-ff/components/ff-add";
import FieldForceManagerDashboard from "layouts/dashboard-ff";
import RegionalManagerAdd from "layouts/dashboard-rm/components/rm-add";
import MedicalRepresentativeDashboard from "layouts/dashboard-mr";

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
          <Route path="/director" element={<DashboardWrapper />}>
            <Route path="dashboard" element={<DirectorDashboard />} />
            <Route path="add" element={<DirectorAdd />} />
          </Route>
        </Route>

        {/* Deputy Director Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.DEPUTY_DIRECTOR]} />}>
          <Route path="/dd" element={<DashboardWrapper />}>
            <Route path="dashboard" element={<DeputyDirectorDashboard />} />
            <Route path="add" element={<DeputyDirectorAdd />} />
          </Route>
        </Route>

        {/* Product Manager Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.PRODUCT_MANAGER]} />}>
          <Route path="/pm" element={<DashboardWrapper />}>
            <Route path="dashboard" element={<ProductManagerDashboard />} />
            <Route path="add" element={<ProductManagerAdd />} />
          </Route>
        </Route>

        {/* Field Force Manager Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.FIELD_FORCE_MANAGER]} />}>
          <Route path="/ff" element={<DashboardWrapper />}>
            <Route path="dashboard" element={<FieldForceManagerDashboard />} />
            <Route path="add" element={<FieldForceManagerAdd />} />
          </Route>
        </Route>

        {/* Regional Manager Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.REGIONAL_MANAGER]} />}>
          <Route path="/rm" element={<DashboardWrapper />}>
            <Route path="dashboard" element={<RegionalManagerDashboard />} />
            <Route path="add" element={<RegionalManagerAdd />} />
          </Route>
        </Route>

        {/* Medical Representative Dashboard */}
        <Route element={<ProtectedRoutes allowedRoles={[userRoles.MEDICAL_REPRESENTATIVE]} />}>
          <Route path="/mr" element={<DashboardWrapper />}>
            <Route path="dashboard" element={<MedicalRepresentativeDashboard />} />
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}
