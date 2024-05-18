// layouts/DashboardWrapper.js
import React, { useState, useEffect } from "react";
import Sidenav from "../../examples/Sidenav";
import { Outlet, useLocation } from "react-router-dom";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import brandWhite from "../../assets/images/logo-ct.png";
import roleBasedRoutes from "../../routes";
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
  const roleRoutes = roleBasedRoutes.find((route) => route.role === userRole);

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
        brandName={userRole ? userRole.toUpperCase() : "USER"}
        routes={roleRoutes ? roleRoutes.sideNav : []}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      <Outlet />
    </>
  );
}

export default DashboardWrapper;
