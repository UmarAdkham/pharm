import React, { useState, useEffect } from "react";
import Sidenav from "../../examples/Sidenav";
import { Outlet, useLocation } from "react-router-dom";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import brandWhite from "../../assets/images/logo-ct.png";
import brandDark from "../../assets/images/logo-ct-dark.png";
import roleBasedRoutes from "../../routes";
import { useSelector } from "react-redux";

function DashboardWrapper() {
  const [controller, dispatch] = useMaterialUIController();
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [isSidenavVisible, setIsSidenavVisible] = useState(true); // Set initial visibility to false
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

  const roleRoutes = roleBasedRoutes.find((route) => route.role === userRole);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

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

  const handleSidenavToggle = () => {
    setIsSidenavVisible(!isSidenavVisible);
    console.log("Sidenav visibility:", !isSidenavVisible);
  };

  return (
    <>
      <MDBox
        display={{ xs: "flex", md: "none" }}
        justifyContent="flex-end"
        alignItems="center"
        p={2}
      >
        <Icon fontSize="large" onClick={handleSidenavToggle} sx={{ cursor: "pointer" }}>
          menu
        </Icon>
      </MDBox>
      <Sidenav
        color={sidenavColor}
        brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
        brandName={userRole ? userRole.toUpperCase() : "USER"}
        routes={roleRoutes ? roleRoutes.sideNav : []}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
        isVisible={isSidenavVisible}
        onClose={handleSidenavToggle}
      />
      <Outlet />
    </>
  );
}

export default DashboardWrapper;
