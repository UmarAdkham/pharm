import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import NotificationIcon from "@mui/icons-material/Notifications";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import userRoles from "constants/userRoles";

export default function useMrData(
  apiPath,
  status,
  navigatePath,
  onRowClick,
  region,
  ff_manager,
  product_manager
) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    let mrs;
    async function fetchUsers() {
      try {
        if (region === "" && ff_manager === "" && product_manager === "") {
          const response = await axiosInstance.get(apiPath, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = response.data.filter((user) => user.status === status);

          mrs = data;
        } else if (region !== "") {
          const { data } = await axiosInstance.get(
            `https://it-club.uz/common/get-users-by-username?username=${region}`
          );
          mrs = data;
        } else if (ff_manager !== "") {
          const { data } = await axiosInstance.get(
            `https://it-club.uz/common/get-users-by-username?username=${ff_manager}`
          );
          mrs = data.filter((e) => e.status === userRoles.MEDICAL_REPRESENTATIVE);
        } else if (product_manager !== "") {
          const { data } = await axiosInstance.get(
            `https://it-club.uz/common/get-users-by-username?username=${product_manager}`
          );
          mrs = data.filter((e) => e.status === userRoles.MEDICAL_REPRESENTATIVE);
        }

        const columns = [
          { Header: "Имя пользователя", accessor: "username", align: "left" },
          { Header: "Полное имя", accessor: "full_name", align: "left" },
          // { Header: "Регион", accessor: "region", align: "left" },
          { Header: "Статус", accessor: "status", align: "center" },
        ];

        if (region === "" && ff_manager === "" && product_manager === "") {
          columns.push({
            Header: "Продукт Менеджер",
            accessor: "product_manager_name",
            align: "left",
          });
        }

        if (navigatePath === "/dd/mr-info") {
          columns.push({ Header: "Действия", accessor: "actions", align: "center" });
        }

        const rows = mrs.map((mr) => ({
          username: (
            <MDTypography variant="caption" fontWeight="medium">
              {mr.username}
            </MDTypography>
          ),
          full_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {mr.full_name}
            </MDTypography>
          ),
          status: (
            <MDTypography variant="caption" fontWeight="medium" color="text">
              {mr.status}
            </MDTypography>
          ),
          product_manager_name: mr.product_manager ? (
            <MDTypography variant="caption" fontWeight="medium">
              {mr.product_manager.full_name}
            </MDTypography>
          ) : (
            ""
          ),
          actions: navigatePath === "/dd/mr-info" && (
            <div>
              <Tooltip title="Добавить уведомение">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/dd/add-notification", { state: mr });
                  }}
                >
                  <NotificationIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Добавить план врача">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/dd/add-doctor-plan", { state: mr });
                  }}
                >
                  <MedicalServicesIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Добавить план аптеки">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/dd/add-pharmacy-plan", { state: mr });
                  }}
                >
                  <VaccinesIcon />
                </IconButton>
              </Tooltip>
            </div>
          ),
          onClick: () => {
            onRowClick(navigatePath, mr);
          },
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, [accessToken, apiPath, onRowClick, navigatePath, region, ff_manager, product_manager]);

  return data;
}
