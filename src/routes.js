// @mui icons
import Icon from "@mui/material/Icon";
import DirectorDashboard from "layouts/dashboard-director";
import DeputyDirectorDashboard from "layouts/dashboard-dd";
import ProductManagerDashboard from "layouts/dashboard-pm";
import RegionalManagerDashboard from "layouts/dashboard-rm";
import userRoles from "constants/userRoles";
import DirectorAdd from "layouts/dashboard-director/components/director-add";
import DeputyDirectorAdd from "layouts/dashboard-dd/components/dd-add";
import ProductManagerAdd from "layouts/dashboard-pm/components/pm-add";
import FieldForceManagerAdd from "layouts/dashboard-ff/components/ff-add";
import FieldForceManagerDashboard from "layouts/dashboard-ff";
import RegionalManagerAdd from "layouts/dashboard-rm/components/rm-add";
import MedicalRepresentativeDashboard from "layouts/dashboard-mr";

// roleRoutes.js
// Director-specific routes
export const directorRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard-director",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Add new user",
    key: "director-add",
    icon: <Icon fontSize="small">add</Icon>,
    route: "add",
  },
  // Other routes relevant to the Director
];

// Deputy Director-specific routes
export const deputyDirectorRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard-director",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Add new user",
    key: "director-add",
    icon: <Icon fontSize="small">add</Icon>,
    route: "add",
  },
  {
    type: "collapse",
    name: "Pharmacy",
    key: "director-add",
    icon: <Icon fontSize="small">medication</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Doctor plans",
    key: "director-add",
    icon: <Icon fontSize="small">vaccines</Icon>,
    route: "dashboard",
  },
  // Additional routes for Deputy Director
];

// Product Manager-specific routes
export const productManagerRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard-director",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Add new user",
    key: "director-add",
    icon: <Icon fontSize="small">add</Icon>,
    route: "add",
  },
  // Add other Product Manager routes
];

// Field Force Manager-specific routes
export const fieldForceManagerRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard-director",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Add new user",
    key: "director-add",
    icon: <Icon fontSize="small">add</Icon>,
    route: "add",
  },
  // Add other Field Force Manager routes
];

// Regional Manager-specific routes
export const regionalManagerRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard-director",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Add new user",
    key: "director-add",
    icon: <Icon fontSize="small">add</Icon>,
    route: "add",
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "director-add",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "dashboard",
  },
  // Add other Regional Manager routes
];

// Medical Representative-specific routes
export const medicalRepresentativeRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard-director",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Pharmacy",
    key: "director-add",
    icon: <Icon fontSize="small">medication</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Balance",
    key: "director-add",
    icon: <Icon fontSize="small">balance</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Doctors",
    key: "director-add",
    icon: <Icon fontSize="small">vaccines</Icon>,
    route: "dashboard",
  },
  {
    type: "collapse",
    name: "Wholesales",
    key: "director-add",
    icon: <Icon fontSize="small">receipt</Icon>,
    route: "dashboard",
  },
  // Add other Medical Representative routes
];

const roleBasedRoutes = [
  {
    role: userRoles.DIRECTOR,
    path: "director",
    routes: [
      { path: "dashboard", component: <DirectorDashboard /> },
      { path: "add", component: <DirectorAdd /> },
      // Add more routes for Director here
    ],
  },
  {
    role: userRoles.DEPUTY_DIRECTOR,
    path: "dd",
    routes: [
      { path: "dashboard", component: <DeputyDirectorDashboard /> },
      { path: "add", component: <DeputyDirectorAdd /> },
      // Add more routes for Deputy Director here
    ],
  },
  {
    role: userRoles.PRODUCT_MANAGER,
    path: "pm",
    routes: [
      { path: "dashboard", component: <ProductManagerDashboard /> },
      { path: "add", component: <ProductManagerAdd /> },
      // Add more routes for Product Manager here
    ],
  },
  {
    role: userRoles.FIELD_FORCE_MANAGER,
    path: "ff",
    routes: [
      { path: "dashboard", component: <FieldForceManagerDashboard /> },
      { path: "add", component: <FieldForceManagerAdd /> },
      // Add more routes for Field Force Manager here
    ],
  },
  {
    role: userRoles.REGIONAL_MANAGER,
    path: "rm",
    routes: [
      { path: "dashboard", component: <RegionalManagerDashboard /> },
      { path: "add", component: <RegionalManagerAdd /> },
      // Add more routes for Regional Manager here
    ],
  },
  {
    role: userRoles.MEDICAL_REPRESENTATIVE,
    path: "mr",
    routes: [
      { path: "dashboard", component: <MedicalRepresentativeDashboard /> },
      // Add more routes for Medical Representative here
    ],
  },
];

export default roleBasedRoutes;
