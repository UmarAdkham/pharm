import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

export default function usePharmacyPlanData(apiPath) {
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
          { Header: "Дата", accessor: "date", align: "left" },
          { Header: "Тема", accessor: "theme", align: "left" },
          { Header: "Описание", accessor: "description", align: "left" },
          { Header: "Аптека", accessor: "pharmacy", align: "left" },
          { Header: "Удалить", accessor: "delete", align: "center" },
        ];

        const rows = pharmacyPlans.map((plan) => ({
          date: (
            <MDTypography variant="caption" fontWeight="medium">
              {format(new Date(plan.date), "yyyy-MM-dd")}
            </MDTypography>
          ),
          theme: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.theme}
            </MDTypography>
          ),
          description: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.description}
            </MDTypography>
          ),
          pharmacy: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.pharmacy.company_name}
            </MDTypography>
          ),
          delete: (
            <IconButton
              color="secondary"
              onClick={async () => {
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
          id: plan.id,
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchPharmacyPlans();
  }, [accessToken, apiPath]);

  return data;
}
