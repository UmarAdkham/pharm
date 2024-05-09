import userRoles from "./userRoles";

// Create a role-based redirect object using the enums
const roleBasedRedirect = Object.freeze({
  [userRoles.DIRECTOR]: "/dashboard-director",
  [userRoles.DEPUTY_DIRECTOR]: "/dashboard-dd",
  [userRoles.PRODUCT_MANAGER]: "/dashboard-pm",
  [userRoles.FIELD_FORCE_MANAGER]: "/dashboard-ff",
  [userRoles.REGIONAL_MANAGER]: "/dashboard-rm",
  [userRoles.MEDICAL_REPRESENTATIVE]: "/dashboard-mr",
});

export default roleBasedRedirect;
