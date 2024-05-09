/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";

// @mui icons
import Icon from "@mui/material/Icon";
import ProtectedRoutes from "protected-routes";
import DirectorDashboard from "layouts/dashboard-director";
import DeputyDirectorDashboard from "layouts/dashboard-dd";
import ProductManagerDashboard from "layouts/dashboard-pm";
import FieldForceDashboard from "layouts/dashboard-ff";
import RegionalManagerDashboard from "layouts/dashboard-rm";
import MedRepresentativeDashboard from "layouts/dashboard-mr";
import userRoles from "constants/userRoles";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Director Dashboard",
    key: "dashboard-director",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-director",
    component: (
      <ProtectedRoutes allowedRoles={[userRoles.DIRECTOR]}>
        <DirectorDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    type: "collapse",
    name: "Deputy Director Dashboard",
    key: "dashboard-dd",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-dd",
    component: (
      <ProtectedRoutes allowedRoles={[userRoles.DEPUTY_DIRECTOR]}>
        <DeputyDirectorDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    type: "collapse",
    name: "Product Manager Dashboard",
    key: "dashboard-pm",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-pm",
    component: (
      <ProtectedRoutes allowedRoles={[userRoles.PRODUCT_MANAGER]}>
        <ProductManagerDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    type: "collapse",
    name: "Field Force Manager Dashboard",
    key: "dashboard-ff",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-ff",
    component: (
      <ProtectedRoutes allowedRoles={[userRoles.FIELD_FORCE_MANAGER]}>
        <FieldForceDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    type: "collapse",
    name: "Regional Manager Dashboard",
    key: "dashboard-rm",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-rm",
    component: (
      <ProtectedRoutes allowedRoles={[userRoles.REGIONAL_MANAGER]}>
        <RegionalManagerDashboard />
      </ProtectedRoutes>
    ),
  },
  {
    type: "collapse",
    name: "Medical Representative Dashboard",
    key: "dashboard-mr",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard-mr",
    component: (
      <ProtectedRoutes allowedRoles={[userRoles.MEDICAL_REPRESENTATIVE]}>
        <MedRepresentativeDashboard />
      </ProtectedRoutes>
    ),
  },
  // {
  //   type: "collapse",
  //   name: "Sign In",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/",
  //   component: <SignIn />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/sign-up",
  //   component: <SignUp />,
  // },
];

// roleRoutes.js
// Director-specific routes
export const directorRoutes = [
  {
    type: "collapse",
    name: "Director Dashboard",
    key: "dashboard-director",
    icon: <Icon fontSize="small">Director</Icon>,
    route: "/dashboard-director",
  },
  // Other routes relevant to the Director
];

// Deputy Director-specific routes
export const deputyDirectorRoutes = [
  {
    type: "collapse",
    name: "Deputy Director Dashboard",
    key: "dashboard-dd",
    icon: <Icon fontSize="small">Deputy</Icon>,
    route: "/dashboard-dd",
  },
  // Additional routes for Deputy Director
];

// Product Manager-specific routes
export const productManagerRoutes = [
  {
    type: "collapse",
    name: "Product Manager Dashboard",
    key: "dashboard-pm",
    icon: <Icon fontSize="small">Product Manager</Icon>,
    route: "/dashboard-pm",
  },
  // Add other Product Manager routes
];

// Field Force Manager-specific routes
export const fieldForceManagerRoutes = [
  {
    type: "collapse",
    name: "Field Force Manager Dashboard",
    key: "dashboard-pm",
    icon: <Icon fontSize="small">Field Force Manager</Icon>,
    route: "/dashboard-pm",
  },
  // Add other Field Force Manager routes
];

// Regional Manager-specific routes
export const regionalManagerRoutes = [
  {
    type: "collapse",
    name: "Regional Manager Dashboard",
    key: "dashboard-pm",
    icon: <Icon fontSize="small">Regional Manager</Icon>,
    route: "/dashboard-rm",
  },
  // Add other Regional Manager routes
];

// Medical Representative-specific routes
export const medicalRepresentativeRoutes = [
  {
    type: "collapse",
    name: "Medical Representative Dashboard",
    key: "dashboard-pm",
    icon: <Icon fontSize="small">Medical Representative</Icon>,
    route: "/dashboard-rm",
  },
  // Add other Medical Representative routes
];

// Additional route arrays for other roles...

export default routes;
