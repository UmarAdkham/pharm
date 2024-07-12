import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";

export default function useBonusMrsData(month, order, handleTotalBonus) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const [loading, setLoading] = useState(true); // Add loading state
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    const getRowBackgroundColor = (factPercent) => {
      if (factPercent >= 75) {
        return "#81c784";
      } else if (factPercent >= 50) {
        return "#f2cc45";
      } else {
        return "#f77c48";
      }
    };

    async function fetchUsers() {
      setLoading(true); // Set loading to true before fetching data
      try {
        const response = await axiosInstance.get(
          `common/get-medical-representatives?month_number=${month}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const mrs = response.data;

        // Calculate total bonus
        let totalBonus = 0;

        const columns = [
          { Header: "Имя пользователя", accessor: "username", align: "left" },
          { Header: "Полное имя", accessor: "full_name", align: "left" },
          { Header: "План", accessor: "plan", align: "left" },
          { Header: "Факт", accessor: "fact", align: "left" },
          { Header: "Факт %", accessor: "fact_percent", align: "left" },
        ];

        const rows = mrs.map((mr) => {
          const totalPlan = mr.plan.reduce((acc, item) => acc + item.plan_amount, 0);
          const totalFact = mr.plan.reduce((acc, item) => acc + item.fact, 0);
          const factPercent = totalPlan > 0 ? (totalFact / totalPlan) * 100 : 0;
          const rowBackgroundColor = getRowBackgroundColor(factPercent);

          totalBonus += totalFact; // Accumulate total bonus

          return {
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
            plan: (
              <MDTypography variant="caption" fontWeight="medium">
                {totalPlan}
              </MDTypography>
            ),
            fact: (
              <MDTypography variant="caption" fontWeight="medium">
                {totalFact}
              </MDTypography>
            ),
            fact_percent: (
              <MDTypography variant="caption" fontWeight="medium">
                {factPercent.toFixed(2)}%
              </MDTypography>
            ),
            onClick: () => {
              navigate("/dd/bonus-report", { state: mr });
            },
            rowBackgroundColor,
          };
        });

        // Sort rows based on fact_percent
        if (order) {
          rows.sort((a, b) => {
            const factPercentA = parseFloat(a.fact_percent.props.children);
            const factPercentB = parseFloat(b.fact_percent.props.children);
            return order === "asc" ? factPercentA - factPercentB : factPercentB - factPercentA;
          });
        }

        handleTotalBonus(totalBonus); // Update total bonus

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }

    if (accessToken) {
      fetchUsers();
    }
  }, [accessToken, month, order, handleTotalBonus, navigate]);

  return { data, loading }; // Return loading state
}
