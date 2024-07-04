import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

export default function useDoctorPlanData(apiPath, openDialog, deleteDialogOpen, selectedMonth) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchDoctorPlans() {
      try {
        const { data } = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const filteredData = selectedMonth
          ? data.filter(
              (plan) => new Date(plan.date).getMonth() + 1 === parseInt(selectedMonth, 10)
            )
          : data;

        const columns = [
          { Header: "Врач", accessor: "doctor", align: "left" },
          { Header: "Дата", accessor: "date", align: "left" },
          { Header: "Статус", accessor: "status", align: "center" },
          { Header: "Удалить", accessor: "delete", align: "center" },
        ];

        const rows = filteredData.map((plan) => ({
          id: plan.id,
          doctor: (
            <MDTypography variant="caption" fontWeight="medium">
              {plan.doctor.full_name}
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
              onClick={(e) => {
                e.stopPropagation();
                deleteDialogOpen(plan.id, "doctor-plan");
              }}
            >
              <DeleteIcon style={{ color: "red" }} />
            </IconButton>
          ),
          onClick: () => {
            openDialog(plan.id, "doctor");
          },
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchDoctorPlans();
  }, [accessToken, apiPath, openDialog, selectedMonth]);

  const deleteDoctorPlan = async (planId) => {
    setData((prevData) => ({
      columns: prevData.columns,
      rows: prevData.rows.filter((row) => row.id !== planId),
    }));
  };

  return { data, deleteDoctorPlan };
}
