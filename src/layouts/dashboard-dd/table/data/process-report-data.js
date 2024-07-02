import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { IconButton, Switch, Tooltip, Snackbar, Alert } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import axiosInstance from "services/axiosInstance";

export default function useProcessReportData(month) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    fetchProcessReports();
  }, [accessToken, month]);

  async function fetchProcessReports() {
    try {
      const response = await axiosInstance.get(`https://it-club.uz/dd/get-proccess-report`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const reports = response.data;

      const columns = [
        { Header: "Имя", accessor: "name", align: "left" },
        { Header: "Контакт", accessor: "contact", align: "left" },
        { Header: "Медицинский представитель", accessor: "med_rep", align: "left" },
        { Header: "Медицинская организация", accessor: "med_org", align: "left" },
        { Header: "Скачать", accessor: "download", align: "center" },
      ];

      const rows = reports.map((report) => ({
        name: (
          <MDTypography variant="caption" fontWeight="medium">
            {report.full_name}
          </MDTypography>
        ),
        contact: (
          <MDTypography variant="caption" fontWeight="medium">
            {report.contact1}
          </MDTypography>
        ),
        med_rep: (
          <MDTypography variant="caption" fontWeight="medium">
            {report.med_rep.full_name}
          </MDTypography>
        ),
        med_org: (
          <MDTypography variant="caption" fontWeight="medium">
            {report.medical_organization.name}
          </MDTypography>
        ),
        download: (
          <IconButton
            sx={{
              "&:hover": {
                backgroundColor: "#e0f2f1",
              },
            }}
            onClick={() => downloadReport(report)}
          >
            <CloudDownloadIcon />
          </IconButton>
        ),
      }));

      setData({ columns, rows });
    } catch (error) {
      console.error(error);
    }
  }

  function downloadReport(report) {
    axios({
      url: `https://it-club.uz/dd/get-proccess-report-ecxel?month=${month}`,
      method: "GET",
      responseType: "blob", // Important
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        let filename = `${report.full_name}_${report.speciality.name}_${month}`;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.xlsx` || `report-${rsrv.id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Download error", error));
  }

  return data;
}
