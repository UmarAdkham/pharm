import userRoles from "./userRoles";

const getFullStatusName = (role) => {
  switch (role) {
    case userRoles.DIRECTOR:
      return "Director";
    case userRoles.DEPUTY_DIRECTOR:
      return "Deputy Director";
    case userRoles.PRODUCT_MANAGER:
      return "Product Manager";
    case userRoles.FIELD_FORCE_MANAGER:
      return "Field Force Manager";
    case userRoles.REGIONAL_MANAGER:
      return "Regional Manager";
    case userRoles.MEDICAL_REPRESENTATIVE:
      return "Medical Representative";
    default:
      return "";
  }
};

export const getFullStatusTranslation = (role) => {
  switch (role) {
    case userRoles.DIRECTOR:
      return "Директор";
    case userRoles.DEPUTY_DIRECTOR:
      return "Заместитель директора";
    case userRoles.PRODUCT_MANAGER:
      return "Менеджер по продукту";
    case userRoles.FIELD_FORCE_MANAGER:
      return "Менеджер полевых персоналов";
    case userRoles.REGIONAL_MANAGER:
      return "Региональный менеджер";
    case userRoles.MEDICAL_REPRESENTATIVE:
      return "Медицинский представитель";
    default:
      return "";
  }
};

export default getFullStatusName;
