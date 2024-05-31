// App.js
import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { useMaterialUIController, setOpenConfigurator } from "context";
import ProtectedRoutes from "protected-routes";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import DashboardWrapper from "layouts/dashboard-wrapper";
import roleBasedRoutes from "routes";
import useAxiosInterceptor from "./hooks/useAxiosInterceptor";
import { isTokenExpired } from "./utils/auth";
import { useDispatch } from "react-redux";
import { logout } from "./redux/auth/authSlice";
import "leaflet/dist/leaflet.css";
// import "react-leaflet-geosearch/lib/react-leaflet-geosearch.css";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const { direction, layout, openConfigurator, darkMode } = controller;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();

  useAxiosInterceptor();

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // Check token expiry on load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (isTokenExpired(token)) {
      reduxDispatch(logout());
      navigate("/");
    }
  }, [reduxDispatch, navigate]);

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
