import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import EditWholesaleCompanyDialog from "layouts/dashboard-ws/dialogs/edit-ws-company-dialog";

export default function useWholesaleCompanyData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchWsCompanies() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const wscs = response.data;

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "Контакт", accessor: "contact", align: "left" },
          { Header: "Регион", accessor: "region", align: "center" },
          { Header: "Действия", accessor: "actions", align: "center" },
        ];

        const rows = wscs.map((wsc) => ({
          id: wsc.id, // Add ID for easier row identification
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsc.name}
            </MDTypography>
          ),
          contact: (
            <MDTypography variant="caption" fontWeight="medium">
              {wsc.contact}
            </MDTypography>
          ),
          region: (
            <MDTypography variant="caption" fontWeight="medium" color="text">
              {wsc.region.name}
            </MDTypography>
          ),
          actions: (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(wsc);
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#e0f2f1",
                },
              }}
            >
              <EditIcon />
            </IconButton>
          ),
          onClick: () => navigate(`/ws/company-info/${wsc.id}`),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchWsCompanies();
  }, [accessToken, apiPath]);

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleCompanyUpdate = (updatedCompany) => {
    setData((prevData) => {
      const updatedRows = prevData.rows.map((row) =>
        row.id === updatedCompany.id
          ? {
              ...row,
              name: (
                <MDTypography variant="caption" fontWeight="medium">
                  {updatedCompany.name}
                </MDTypography>
              ),
              contact: (
                <MDTypography variant="caption" fontWeight="medium">
                  {updatedCompany.contact}
                </MDTypography>
              ),
              region: (
                <MDTypography variant="caption" fontWeight="medium" color="text">
                  {updatedCompany.region.name}
                </MDTypography>
              ),
            }
          : row
      );
      return { ...prevData, rows: updatedRows };
    });
  };

  return {
    ...data,
    EditWholesaleCompanyDialog: (
      <EditWholesaleCompanyDialog
        open={editDialogOpen}
        handleClose={handleDialogClose}
        companyToUpdate={selectedCompany}
        onUpdate={handleCompanyUpdate}
      />
    ),
  };
}
