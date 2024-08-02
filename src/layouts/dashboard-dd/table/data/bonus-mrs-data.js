import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";

export default function useBonusMrsData(month, order) {
  const [data, setData] = useState({ columns: [], rows: [], overall: {} });
  const [loading, setLoading] = useState(true);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  const previousDataRef = useRef(data);

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
      setLoading(true);
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

        // Fetch fact_postupleniya for each medical representative
        const fetchFactPostupleniya = async (medRepId) => {
          const response = await axiosInstance.get(
            `/dd/get-doctor-bonus-by-med-rep-id/${medRepId}?month_number=${month}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          return response.data.reduce((sum, item) => sum + item.fact_postupleniya, 0);
        };

        const factPostupleniyaPromises = mrs.map((mr) =>
          fetchFactPostupleniya(mr.id).then((factPostupleniya) => ({
            id: mr.id,
            factPostupleniya,
          }))
        );

        const factPostupleniyaResults = await Promise.all(factPostupleniyaPromises);

        const factPostupleniyaMap = new Map();
        factPostupleniyaResults.forEach((result) => {
          factPostupleniyaMap.set(result.id, result.factPostupleniya);
        });

        // Calculate overall statistics
        const overall = {
          numberOfDoctors: mrs.length,
          monthlyPlan: mrs.reduce(
            (sum, mr) => sum + mr.plan.reduce((acc, item) => acc + item.plan_price, 0),
            0
          ),
          fact: mrs.reduce(
            (sum, mr) => sum + mr.plan.reduce((acc, item) => acc + item.fact_price, 0),
            0
          ),
          factPercent:
            (mrs.reduce((sum, mr) => sum + mr.plan.reduce((acc, item) => acc + item.fact, 0), 0) /
              mrs.reduce(
                (sum, mr) => sum + mr.plan.reduce((acc, item) => acc + item.plan_amount, 0),
                0
              )) *
            100,
          hasBonus: false,
        };

        const columns = [
          { Header: "Имя пользователя", accessor: "username", align: "left" },
          { Header: "Полное имя", accessor: "full_name", align: "left" },
          { Header: "План", accessor: "plan", align: "left" },
          { Header: "Факт", accessor: "fact", align: "left" },
          { Header: "Факт %", accessor: "fact_percent", align: "left" },
          { Header: "Факт поступ", accessor: "fact_postupleniya", align: "left" }, // New column
        ];

        const rows = mrs.map((mr) => {
          const totalPlan = mr.plan.reduce((acc, item) => acc + item.plan_amount, 0);
          const totalFact = mr.plan.reduce((acc, item) => acc + item.fact, 0);
          const factPercent = totalPlan > 0 ? (totalFact / totalPlan) * 100 : 0;
          const rowBackgroundColor = getRowBackgroundColor(factPercent);
          const factPostupleniya = factPostupleniyaMap.get(mr.id) || 0;

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
            fact_postupleniya: (
              <MDTypography variant="caption" fontWeight="medium">
                {factPostupleniya}
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

        const newData = { columns, rows, overall };

        if (JSON.stringify(newData) !== JSON.stringify(previousDataRef.current)) {
          previousDataRef.current = newData;
          setData(newData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (accessToken) {
      fetchUsers();
    }
  }, [accessToken, month, order, navigate]);

  return { data, loading };
}
