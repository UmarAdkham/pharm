// App.js
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
// Import all dashboard components

// Dashboard Wrapper
import DashboardWrapper from "layouts/dashboard-wrapper";
import roleBasedRoutes from "routes";
import useAxiosInterceptor from "./hooks/useAxiosInterceptor";

export default function App() {
  // Access the global UI controller state
  const [controller, dispatch] = useMaterialUIController();
  const { direction, layout, openConfigurator, darkMode } = controller;
  const { pathname } = useLocation();

  // Set up the Axios interceptor
  useAxiosInterceptor();

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
      {layout === "vr" && <Configurator />}

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        {roleBasedRoutes.map(({ role, path, routes }) => (
          <Route key={role} element={<ProtectedRoutes allowedRoles={[role]} />}>
            <Route path={`/${path}`} element={<DashboardWrapper />}>
              {routes.map(({ path: routePath, component }) => (
                <Route key={routePath} path={routePath} element={component} />
              ))}
            </Route>
          </Route>
        ))}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}
