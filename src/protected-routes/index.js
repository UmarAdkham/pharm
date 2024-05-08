import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ProtectedRoutes = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  return isAuthenticated && allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/" />;
};

ProtectedRoutes.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProtectedRoutes;
