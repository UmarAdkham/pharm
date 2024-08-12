import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import IconButton from "@mui/material/IconButton";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import MDTypography from "components/MDTypography";
import MedorgModal from "../../dialogs/modal/shared/medorg-modal";

export default function useMedicalOrganizationData(selectedRegion) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [open, setOpen] = useState(false);
  const [medorgToUpdate, setMedorgToUpdate] = useState({
    id: null,
    name: "",
    medOrgAdress: "",
    latitude: "",
    longitude: "",
    medOrgregion: null,
    medOrgRep: null,
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (updatedMedOrg) => {
    try {
      console.log(updatedMedOrg);
      const response = await axiosInstance.put(
        `common/update-medical-organization/${updatedMedOrg.id}`,
        updatedMedOrg,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating medical organization:", error);
    }
  };

  const fetchMedicalOrganizations = async () => {
    try {
      const response = await axiosInstance.get("common/get-medical-organization", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      let medicalOrganizations = response.data.sort((a, b) => a.id - b.id);

      // Filter based on selected region if provided
      if (selectedRegion) {
        medicalOrganizations = medicalOrganizations.filter(
          (medOrg) => medOrg.region.id === selectedRegion.id
        );
      }

      const columns = [
        { Header: "Название", accessor: "name", align: "left" },
        { Header: "Адрес", accessor: "address", align: "left" },
        { Header: "Регион", accessor: "region", align: "left" },
        { Header: "Действия", accessor: "action", align: "right" },
      ];

      const rows = medicalOrganizations.map((medOrg) => ({
        name: (
          <MDTypography variant="caption" fontWeight="medium">
            {medOrg.name}
          </MDTypography>
        ),
        address: (
          <MDTypography variant="caption" fontWeight="medium">
            {medOrg.address}
          </MDTypography>
        ),
        region: (
          <MDTypography variant="caption" fontWeight="medium">
            {medOrg.region.name}
          </MDTypography>
        ),
        action: (
          <div>
            <IconButton
              onClick={() => {
                handleOpen();
                setMedorgToUpdate({
                  id: medOrg.id,
                  name: medOrg.name,
                  address: medOrg.address,
                  latitude: medOrg.latitude,
                  longitude: medOrg.longitude,
                  region_id: medOrg.region.id,
                });
              }}
              aria-label="update"
            >
              <DriveFileRenameOutlineOutlinedIcon />
            </IconButton>
            <MedorgModal
              open={open}
              handleClose={handleClose}
              handleSubmit={handleSubmit}
              medorgToUpdate={medorgToUpdate}
            />
          </div>
        ),
      }));

      setData({ columns, rows });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMedicalOrganizations();
  }, [accessToken, open, selectedRegion]);

  return data;
}
