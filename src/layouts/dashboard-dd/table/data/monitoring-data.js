import { useState, useEffect } from "react";
import MDTypography from "components/MDTypography";

export default function useLoginMonitoringData(loginData) {
  const [data, setData] = useState({ columns: [], rows: [] });

  useEffect(() => {
    function constructTable() {
      // Define columns
      const columns = [
        { Header: "Дата входа", accessor: "login_date", align: "left" },
        { Header: "Дата выхода", accessor: "logout_date", align: "left" },
        { Header: "Местоположение", accessor: "location", align: "left" },
        { Header: "Продолжительность", accessor: "duration", align: "left" },
      ];

      // Define rows
      const rows = loginData.map((session) => ({
        login_date: (
          <MDTypography variant="caption" fontWeight="medium">
            {new Date(session.login_date).toLocaleString()}
          </MDTypography>
        ),
        logout_date: (
          <MDTypography variant="caption" fontWeight="medium">
            {session.logout_date ? new Date(session.logout_date).toLocaleString() : "-"}
          </MDTypography>
        ),
        location: (
          <MDTypography variant="caption" fontWeight="medium">
            {session.location ? session.location : "-"}
          </MDTypography>
        ),
        duration: (
          <MDTypography variant="caption" fontWeight="medium">
            {session.durstion ? session.durstion : "-"}
          </MDTypography>
        ),
      }));

      setData({ columns, rows });
    }
    // Fetch data when medRepId or monthNumber changes
    constructTable();
  }, [loginData]);

  return data;
}
