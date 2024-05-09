// layouts/DashboardWrapper.js
import React, { useState, useEffect } from "react";
import Sidenav from "../../examples/Sidenav";
import { Outlet, useLocation } from "react-router-dom";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import Configurator from "examples/Configurator";
import brandWhite from "../../assets/images/logo-ct.png";

// Import different role routes
import {
  directorRoutes,
  deputyDirectorRoutes,
  productManagerRoutes,
  fieldForceManagerRoutes,
  regionalManagerRoutes,
  medicalRepresentativeRoutes,
} from "../../routes";
import userRoles from "constants/userRoles";
import { useSelector } from "react-redux";

function DashboardWrapper() {
  const [controller, dispatch] = useMaterialUIController();
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const {
    miniSidenav,
    direction,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const { pathname } = useLocation();
  const userRole = useSelector((state) => state.auth.userRole); // Get user role from Redux

  // Select appropriate routes based on user role
  let routes = [];
  switch (userRole) {
    case userRoles.DIRECTOR:
      routes = directorRoutes;
      break;
    case userRoles.DEPUTY_DIRECTOR:
      routes = deputyDirectorRoutes;
      break;
    case userRoles.PRODUCT_MANAGER:
      routes = productManagerRoutes;
      break;
    case userRoles.FIELD_FORCE_MANAGER:
      routes = fieldForceManagerRoutes;
      break;
    case userRoles.REGIONAL_MANAGER:
      routes = regionalManagerRoutes;
      break;
    case userRoles.MEDICAL_REPRESENTATIVE:
      routes = medicalRepresentativeRoutes;
      break;
    default:
      routes = []; // Empty if no role matches
      break;
  }

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <>
      <Sidenav
        color={sidenavColor}
        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
        brandName="Pharm"
        routes={routes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      {/* <Configurator /> */}
      {/* {configsButton} */}
      <Outlet />
    </>
  );
}

export default DashboardWrapper;
