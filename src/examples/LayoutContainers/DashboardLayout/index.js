import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useSelector } from "react-redux"; // Import useSelector
import { useMaterialUIController, setLayout } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();

  // Get isSidenavVisible from Redux
  const isSidenavVisible = useSelector((state) => state.ui.isSidenavVisible);

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [pathname, dispatch]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        p: 3,
        position: "relative",
        marginLeft: {
          xs: 0,
          xl: isSidenavVisible
            ? miniSidenav
              ? pxToRem(120) // Margin for mini sidenav
              : pxToRem(274) // Margin for full sidenav
            : 0, // No margin when sidenav is not visible
        },
        transition: transitions.create(["margin-left", "margin-right", "width"], {
          easing: transitions.easing.easeInOut,
          duration: transitions.duration.standard,
        }),
        width: {
          xs: "100%", // Full width on small screens
          xl: isSidenavVisible
            ? `calc(100% - ${miniSidenav ? pxToRem(120) : pxToRem(274)})` // Width adjusted for visible sidenav
            : "100%", // Full width when sidenav is not visible
        },
        overflowX: "hidden", // Prevent horizontal scroll
        [breakpoints.up("xl")]: {
          marginLeft: isSidenavVisible ? (miniSidenav ? pxToRem(120) : pxToRem(274)) : 0,
          width: isSidenavVisible
            ? `calc(100% - ${miniSidenav ? pxToRem(120) : pxToRem(274)})`
            : "100%",
        },
      })}
    >
      {children}
    </MDBox>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
