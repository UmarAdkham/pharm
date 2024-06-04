import Icon from "@mui/material/Icon";
import DirectorDashboard from "layouts/dashboard-director";
import DeputyDirectorDashboard from "layouts/dashboard-dd";
import ProductManagerDashboard from "layouts/dashboard-pm";
import RegionalManagerDashboard from "layouts/dashboard-rm";
import userRoles from "constants/userRoles";
import DirectorAdd from "layouts/dashboard-director/components/director-add";
import DeputyDirectorAdd from "layouts/dashboard-dd/components/dd-add-pm";
import ProductManagerAdd from "layouts/dashboard-pm/components/pm-add";
import FieldForceManagerAdd from "layouts/dashboard-ff/components/ff-add";
import FieldForceManagerDashboard from "layouts/dashboard-ff";
import RegionalManagerAdd from "layouts/dashboard-rm/components/rm-add";
import MedicalRepresentativeDashboard from "layouts/dashboard-mr";
import DeputyDirectorPms from "layouts/dashboard-dd/components/dd-pms";
import DDProductManager from "layouts/dashboard-dd/components/dd-single-pm";
import DeputyDirectorAddFieldForce from "layouts/dashboard-dd/components/dd-add-ff";
import DeputyDirectorSinglePM from "layouts/dashboard-dd/components/dd-single-pm";
import DeputyDirectorAddRegionalManager from "layouts/dashboard-dd/components/dd-add-rm";
import DeputyDirectorAddMedicalRepresentative from "layouts/dashboard-dd/components/dd-add-mr";
import DeputyDirectorMrs from "layouts/dashboard-dd/components/dd-mrs";
import DeputyDirectorAddNotification from "layouts/dashboard-dd/components/dd-add-ntfc";
import DeputyDirectorAddProductCategory from "layouts/dashboard-dd/components/dd-add-ctgr";
import DeputyDirectorCategories from "layouts/dashboard-dd/components/dd-categories";
import DeputyDirectorManufacturerCompanies from "layouts/dashboard-dd/components/dd-mnfcts";
import DeputyDirectorAddManufacturerCompany from "layouts/dashboard-dd/components/dd-add-mnfct";
import DeputyDirectorProducts from "layouts/dashboard-dd/components/dd-products";
import DeputyDirectorAddProduct from "layouts/dashboard-dd/components/dd-add-product";
import DeputyDirectorRegions from "layouts/dashboard-dd/components/dd-regions";
import DeputyDirectorAddRegion from "layouts/dashboard-dd/components/dd-add-region";
import DeputyDirectorMedicalOrganizations from "layouts/dashboard-dd/components/dd-medorg";
import DeputyDirectorAddMedicalOrganization from "layouts/dashboard-dd/components/dd-add-medorg";
import DeputyDirectorAddSpeciality from "layouts/dashboard-dd/components/dd-add-speciality";
import DeputyDirectorSpecialities from "layouts/dashboard-dd/components/dd-specialities";
import DeputyDirectorAddDoctorPlan from "layouts/dashboard-dd/components/dd-add-doctor-plan";
import DeputyDirectorAddPharmacyPlan from "layouts/dashboard-dd/components/dd-add-pharmacy-plan";
import DeputyDirectorMRInfo from "layouts/dashboard-dd/components/dd-mr-info";
import DeputyDirectorAddPharmacy from "layouts/dashboard-dd/components/dd-add-pharmacy";
import DeputyDirectorAddDoctor from "layouts/dashboard-dd/components/dd-add-doctor";

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
        name: "Панель управления",
        key: "dashboard-director",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Добавить нового пользователя",
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
      { path: "add-pm", component: <DeputyDirectorAdd /> },
      { path: "pms", component: <DeputyDirectorPms /> },
      { path: "single-pm", component: <DeputyDirectorSinglePM /> },
      { path: "add-ff", component: <DeputyDirectorAddFieldForce /> },
      { path: "add-rm", component: <DeputyDirectorAddRegionalManager /> },
      { path: "add-mr", component: <DeputyDirectorAddMedicalRepresentative /> },
      { path: "mrs", component: <DeputyDirectorMrs /> },
      { path: "add-notification", component: <DeputyDirectorAddNotification /> },
      { path: "categories", component: <DeputyDirectorCategories /> },
      { path: "add-category", component: <DeputyDirectorAddProductCategory /> },
      { path: "manufacturer-companies", component: <DeputyDirectorManufacturerCompanies /> },
      { path: "add-manufacturer-company", component: <DeputyDirectorAddManufacturerCompany /> },
      { path: "products", component: <DeputyDirectorProducts /> },
      { path: "add-product", component: <DeputyDirectorAddProduct /> },
      { path: "regions", component: <DeputyDirectorRegions /> },
      { path: "add-region", component: <DeputyDirectorAddRegion /> },
      { path: "medical-organizations", component: <DeputyDirectorMedicalOrganizations /> },
      { path: "add-medical-organization", component: <DeputyDirectorAddMedicalOrganization /> },
      { path: "specialities", component: <DeputyDirectorSpecialities /> },
      { path: "add-speciality", component: <DeputyDirectorAddSpeciality /> },
      { path: "add-doctor-plan", component: <DeputyDirectorAddDoctorPlan /> },
      { path: "add-pharmacy-plan", component: <DeputyDirectorAddPharmacyPlan /> },
      { path: "add-pharmacy", component: <DeputyDirectorAddPharmacy /> },
      { path: "add-doctor", component: <DeputyDirectorAddDoctor /> },
      { path: "mr-info", component: <DeputyDirectorMRInfo /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Менеджеры по продукту",
        key: "dd-pms",
        icon: <Icon fontSize="small">manage_accounts</Icon>,
        route: "pms",
      },
      {
        type: "collapse",
        name: "Медицинские представители",
        key: "dd-mrs",
        icon: <Icon fontSize="small">support_agent</Icon>,
        route: "mrs",
      },
      {
        type: "collapse",
        name: "Категории",
        key: "dd-add-category",
        icon: <Icon fontSize="small">category</Icon>,
        route: "categories",
      },
      {
        type: "collapse",
        name: "Производственные компании",
        key: "dd-manufacturer-companies",
        icon: <Icon fontSize="small">business</Icon>,
        route: "manufacturer-companies",
      },
      {
        type: "collapse",
        name: "Продукты",
        key: "dd-products",
        icon: <Icon fontSize="small">inventory</Icon>,
        route: "products",
      },
      {
        type: "collapse",
        name: "Регионы",
        key: "dd-regions",
        icon: <Icon fontSize="small">south_america</Icon>,
        route: "regions",
      },
      {
        type: "collapse",
        name: "Медицинские организации",
        key: "dd-medical-organizations",
        icon: <Icon fontSize="small">corporate_fare</Icon>,
        route: "medical-organizations",
      },
      {
        type: "collapse",
        name: "Специальности",
        key: "dd-specialities",
        icon: <Icon fontSize="small">work</Icon>,
        route: "specialities",
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
        name: "Панель управления",
        key: "dashboard-pm",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Добавить нового пользователя",
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
        name: "Панель управления",
        key: "dashboard-ff",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Добавить нового пользователя",
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
        name: "Панель управления",
        key: "dashboard-rm",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Добавить нового пользователя",
        key: "rm-add",
        icon: <Icon fontSize="small">add</Icon>,
        route: "add",
      },
      {
        type: "collapse",
        name: "Уведомления",
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
        name: "Панель управления",
        key: "dashboard-mr",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
      {
        type: "collapse",
        name: "Аптека",
        key: "mr-pharmacy",
        icon: <Icon fontSize="small">medication</Icon>,
        route: "pharmacy",
      },
      {
        type: "collapse",
        name: "Баланс",
        key: "mr-balance",
        icon: <Icon fontSize="small">balance</Icon>,
        route: "balance",
      },
      {
        type: "collapse",
        name: "Врачи",
        key: "mr-doctors",
        icon: <Icon fontSize="small">vaccines</Icon>,
        route: "doctors",
      },
      {
        type: "collapse",
        name: "Оптовая торговля",
        key: "mr-wholesales",
        icon: <Icon fontSize="small">receipt</Icon>,
        route: "wholesales",
      },
    ],
  },
  {
    role: "head_of_co",
    path: "hoc",
    routes: [{ path: "dashboard", component: <ProductManagerDashboard /> }],
    sideNav: [
      {
        type: "collapse",
        name: "Панель управления",
        key: "dashboard-hoc",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
    ],
  },
  {
    role: "sabrina",
    path: "sabrina",
    routes: [
      { path: "dashboard", component: <ProductManagerDashboard /> },
      { path: "dashboard", component: <ProductManagerDashboard /> },
    ],
    sideNav: [
      {
        type: "collapse",
        name: "Панель управления",
        key: "dashboard-sabrina",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "dashboard",
      },
    ],
  },
];

export default roleBasedRoutes;
