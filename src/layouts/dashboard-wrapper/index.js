import React, { useState, useEffect } from "react";
import Sidenav from "../../examples/Sidenav";
import { Outlet, useLocation } from "react-router-dom";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { Icon } from "@mui/material";
import MDBox from "components/MDBox";
import brandWhite from "../../assets/images/logo-ct.png";
import brandDark from "../../assets/images/logo-ct-dark.png";
import roleBasedRoutes from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidenavVisibility } from "../../redux/ui/uiSlice";

function DashboardWrapper() {
  const [controller, dispatch] = useMaterialUIController();
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const sidenavDispatch = useDispatch();
  const isSidenavVisible = useSelector((state) => state.ui.isSidenavVisible);
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

  const roleRoutes = roleBasedRoutes.find((route) => route.role[0] === userRole);

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

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const handleSidenavToggle = () => {
    sidenavDispatch(toggleSidenavVisibility());
  };

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      // bgColor="white"
      // shadow="sm"
      borderRadius="50%"
      position="fixed"
      left={isSidenavVisible ? "280px" : "10px"}
      top=".2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleSidenavToggle}
    >
      <Icon fontSize="small" color="inherit">
        menu
      </Icon>
    </MDBox>
  );

  return (
    <>
      {configsButton}
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
