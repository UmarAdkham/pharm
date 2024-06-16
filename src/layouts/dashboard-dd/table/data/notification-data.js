import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

export default function useNotificationData(
  apiPath,
  handleDeleteDialogOpen,
  handleNotificationDialogOpen
) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const notifications = response.data;
        console.log(notifications);
        const columns = [
          { Header: "Тема", accessor: "theme", align: "left" },
          { Header: "Дата", accessor: "date", align: "left" },
          { Header: "Статус", accessor: "status", align: "center" },
          { Header: "Доктор/Аптека/Оптовая компания", accessor: "entity", align: "left" },
          { Header: "Удалить", accessor: "delete", align: "center" },
        ];

        const rows = notifications.map((notification) => {
          let entityType, entityName, entityBgColor;

          if (notification.doctor) {
            entityType = "doctor";
            entityName = notification.doctor.full_name;
            entityBgColor = "#b3e5fc"; // Light blue
          } else if (notification.pharmacy) {
            entityType = "pharmacy";
            entityName = notification.pharmacy.company_name;
            entityBgColor = "#81c784"; // Light green
          } else {
            entityType = "wholesale";
            entityName = "Оптовая компания";
            entityBgColor = "#f2cc45"; // Light yellow
          }

          return {
            id: notification.id,
            theme: (
              <MDTypography variant="caption" fontWeight="medium">
                {notification.theme}
              </MDTypography>
            ),
            date: (
              <MDTypography variant="caption" fontWeight="medium">
                {format(new Date(notification.date), "yyyy-MM-dd")}
              </MDTypography>
            ),
            status: (
              <div
                style={{
                  backgroundColor: notification.unread ? "#ffcccb" : "#d3ffd3",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                <MDTypography
                  variant="caption"
                  fontWeight="medium"
                  style={{
                    color: notification.unread ? "red" : "green",
                  }}
                >
                  {notification.unread ? "Непрочитано" : "Прочитано"}
                </MDTypography>
              </div>
            ),
            entity: (
              <div
                style={{
                  backgroundColor: entityBgColor,
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                <MDTypography variant="caption" fontWeight="medium">
                  {entityName} <br /> (
                  {entityType === "doctor"
                    ? "Доктор"
                    : entityType === "pharmacy"
                    ? "Аптека"
                    : "Оптовая компания"}
                  )
                </MDTypography>
              </div>
            ),
            delete: (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDialogOpen(notification.id, "notofications"); // type to match API
                }}
                color="secondary"
              >
                <DeleteIcon style={{ color: "red" }} />
              </IconButton>
            ),
            onClick: () => {
              handleNotificationDialogOpen(notification.id);
            },
          };
        });

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchNotifications();
  }, [accessToken, apiPath]);

  const deleteNotification = async (planId) => {
    setData((prevData) => ({
      columns: prevData.columns,
      rows: prevData.rows.filter((row) => row.id !== planId),
    }));
  };

  return { data, deleteNotification };
}
