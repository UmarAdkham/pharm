import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import { IconButton } from "@mui/material";
// import DoctorModal from "../../dialogs/modal/shared/doctor-modal";
import { useNavigate } from "react-router-dom";

export default function useDoctorData(apiPath, onRowClick) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const doctors = response.data.sort((a, b) => a.full_name.localeCompare(b.full_name));

        const columns = [
          { Header: "Полное имя", accessor: "full_name", align: "left" },
          { Header: "Специальность", accessor: "speciality", align: "left" },
          { Header: "Медицинская организация", accessor: "medical_organization", align: "left" },
          { Header: "Категория", accessor: "category", align: "left" },
          { Header: "Действия", accessor: "action", align: "right" },
        ];

        const rows = doctors.map((doctor) => ({
          full_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.full_name}
            </MDTypography>
          ),
          speciality: (
            <MDTypography
              variant="caption"
              fontWeight="medium"
              onClick={() => onRowClick(doctor.id)}
            >
              {doctor.speciality.name}
            </MDTypography>
          ),
          medical_organization: (
            <MDTypography
              variant="caption"
              fontWeight="medium"
              onClick={() => onRowClick(doctor.id)}
            >
              {doctor.medical_organization.name}
            </MDTypography>
          ),
          category: (
            <MDTypography variant="caption" fontWeight="medium">
              {doctor.category.name}
            </MDTypography>
          ),
          action: (
            <div>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/dd/update-doctor", { state: { doctor_id: doctor.id } });
                }}
                aria-label="update"
              >
                <DriveFileRenameOutlineOutlinedIcon />
              </IconButton>
              {/* <DoctorModal
                open={open}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                doctorToUpdate={doctorToUpdate}
              /> */}
            </div>
          ),
          onClick: () => {
            onRowClick(doctor.id);
          },
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchDoctors();
  }, [accessToken, apiPath, onRowClick, open]);

  return data;
}
