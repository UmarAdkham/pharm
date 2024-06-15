// Inside region-data.js
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";

import IconButton from "@mui/material/IconButton";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

import MDTypography from "components/MDTypography";
import RegionModal from "../../components/modal/shared/region-modal";

export default function useRegionData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [open, setOpen] = useState(false);
  const [regionToUpdate, setRegionToUpdate] = useState({ id: null, name: "" });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRegionToUpdate({ id: null, name: "" }); // Clear update data on modal close
  };

  const handleSubmit = async (updatedRegion) => {
    try {
      const response = await axiosInstance.put(
        `https://it-club.uz/common/update-region/${updatedRegion.id}`,
        {
          name: updatedRegion.name,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Assuming response.data contains the updated region data
      const updatedRegionData = response.data;

      // Optionally update state or trigger a refresh of data
      fetchRegions(); // Example: Refresh data after update
    } catch (error) {
      console.error("Error updating region:", error);
    }
  };

  useEffect(() => {
    async function fetchRegions() {
      try {
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const regions = response.data;

        const columns = [
          { Header: "Название", accessor: "name", align: "left" },
          { Header: "ДЕЙСТВИЯ", accessor: "action", align: "right" },
        ];

        const rows = regions.map((region) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {region.name}
            </MDTypography>
          ),
          action: (
            <div>
              <IconButton
                onClick={() => {
                  handleOpen();
                  setRegionToUpdate({ id: region.id, name: region.name });
                }}
                aria-label="update"
              >
                <DriveFileRenameOutlineOutlinedIcon />
              </IconButton>
              <RegionModal
                open={open}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                regionToUpdate={regionToUpdate}
                setRegionToUpdate={setRegionToUpdate}
              />
            </div>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchRegions();
  }, [accessToken, apiPath, open]); // Include regionToUpdate in dependencies

  return data;
}
