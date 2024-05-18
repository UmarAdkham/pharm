// routes.js
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
import DeputyDirectorPms from "layouts/dashboard-dd/components/dd-pms";

const roleBasedRoutes = [
  {
    role: userRoles.DIRECTOR,
    path: "director",
    routes: [
      { path: "dashboard", component: <DirectorDashboard /> },
      { path: "add", component: <DirectorAdd /> },
    ],
    sideNav: [
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
    ],
  },
  {
    role: userRoles.DEPUTY_DIRECTOR,
    path: "dd",
    routes: [
      { path: "dashboard", component: <DeputyDirectorDashboard /> },
      { path: "add", component: <DeputyDirectorAdd /> },
      { path: "pms", component: <DeputyDirectorPms /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard-dd",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Add new user",
        key: "dd-add",
        icon: <Icon fontSize="small">add</Icon>,
        route: "add",
      },
      {
        type: "collapse",
        name: "Product Managers",
        key: "dd-pms",
        icon: <Icon fontSize="small">medication</Icon>,
        route: "pms",
      },
      {
        type: "collapse",
        name: "Doctor plans",
        key: "dd-doctor-plans",
        icon: <Icon fontSize="small">vaccines</Icon>,
        route: "doctor-plans",
      },
    ],
  },
  {
    role: userRoles.PRODUCT_MANAGER,
    path: "pm",
    routes: [
      { path: "dashboard", component: <ProductManagerDashboard /> },
      { path: "add", component: <ProductManagerAdd /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard-pm",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Add new user",
        key: "pm-add",
        icon: <Icon fontSize="small">add</Icon>,
        route: "add",
      },
    ],
  },
  {
    role: userRoles.FIELD_FORCE_MANAGER,
    path: "ff",
    routes: [
      { path: "dashboard", component: <FieldForceManagerDashboard /> },
      { path: "add", component: <FieldForceManagerAdd /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard-ff",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Add new user",
        key: "ff-add",
        icon: <Icon fontSize="small">add</Icon>,
        route: "add",
      },
    ],
  },
  {
    role: userRoles.REGIONAL_MANAGER,
    path: "rm",
    routes: [
      { path: "dashboard", component: <RegionalManagerDashboard /> },
      { path: "add", component: <RegionalManagerAdd /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard-rm",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Add new user",
        key: "rm-add",
        icon: <Icon fontSize="small">add</Icon>,
        route: "add",
      },
      {
        type: "collapse",
        name: "Notifications",
        key: "rm-notifications",
        icon: <Icon fontSize="small">notifications</Icon>,
        route: "notifications",
      },
    ],
  },
  {
    role: userRoles.MEDICAL_REPRESENTATIVE,
    path: "mr",
    routes: [{ path: "dashboard", component: <MedicalRepresentativeDashboard /> }],
    sideNav: [
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard-mr",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Pharmacy",
        key: "mr-pharmacy",
        icon: <Icon fontSize="small">medication</Icon>,
        route: "pharmacy",
      },
      {
        type: "collapse",
        name: "Balance",
        key: "mr-balance",
        icon: <Icon fontSize="small">balance</Icon>,
        route: "balance",
      },
      {
        type: "collapse",
        name: "Doctors",
        key: "mr-doctors",
        icon: <Icon fontSize="small">vaccines</Icon>,
        route: "doctors",
      },
      {
        type: "collapse",
        name: "Wholesales",
        key: "mr-wholesales",
        icon: <Icon fontSize="small">receipt</Icon>,
        route: "wholesales",
      },
    ],
  },
];

export default roleBasedRoutes;
