import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

export default function usePharmacyPlanData(apiPath, openDialog) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchPharmacyPlans() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const pharmacyPlans = response.data;

        const columns = [
          { Header: "Аптека", accessor: "pharmacy", align: "left" },
          { Header: "Дата", accessor: "date", align: "left" },
          { Header: "Статус", accessor: "status", align: "center" },
          { Header: "Удалить", accessor: "delete", align: "center" },
        ];

        const rows = pharmacyPlans.map((plan) => ({
          id: plan.id,
          pharmacy: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.pharmacy.company_name}
            </MDTypography>
          ),
          date: (
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(plan.date), "MM-dd-yyyy HH:mm")}
            </MDTypography>
          ),
          status: (
            <div
              style={{
                backgroundColor: plan.status ? "#57da79" : plan.postpone ? "orange" : "#42a5f5",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <MDTypography
                variant="caption"
                fontWeight="medium"
                style={{
                  color: "white",
                }}
              >
                {plan.status ? "Сделано" : plan.postpone ? "Отложено" : "В очереди"}
              </MDTypography>
            </div>
          ),
          delete: (
            <IconButton
              color="secondary"
              onClick={async (event) => {
                event.stopPropagation(); // Stop the row click event from being triggered
                try {
                  await axiosInstance.delete(
                    `https://it-club.uz/dd/delete-pharmacy-plan/${plan.id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    }
                  );
                  setData((prevData) => ({
                    ...prevData,
                    rows: prevData.rows.filter((row) => row.id !== plan.id),
                  }));
                } catch (error) {
                  console.error("Failed to delete pharmacy plan:", error);
                }
              }}
            >
              <DeleteIcon style={{ color: "red" }} />
            </IconButton>
          ),
          onClick: () => {
            openDialog(plan.id, "pharmacy");
          },
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchPharmacyPlans();
  }, [accessToken, apiPath, openDialog]);

  return data;
}
