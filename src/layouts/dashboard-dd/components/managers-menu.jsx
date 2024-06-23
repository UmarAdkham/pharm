import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useSelector } from "react-redux";
import userRoles from "constants/userRoles";

export default function ManagersMenu({ setRegion, setFf_manager, region, ff_manager }) {
  const { accessToken } = useSelector((state) => state.auth);

  const [regions, setRegions] = useState([{ username: "", full_name: "All" }]);
  const [ff_managers, setFf_managers] = useState([{ username: "", full_name: "All" }]);

  const handleChange = (e) => {
    setRegion("");
    setFf_manager(e.target.value);
  };
  const handleChangeRegion = (e) => {
    setFf_manager("");
    setRegion(e.target.value);
  };

  useEffect(() => {
    const fetchFieldForceManagers = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data);
        const fieldForceManagers = response.data.filter(
          (user) => user.status === userRoles.FIELD_FORCE_MANAGER
        );
        setFf_managers([{ username: "", full_name: "All" }, ...fieldForceManagers]);
        console.log(fieldForceManagers);
      } catch (error) {
        console.error("Не удалось получить пользователей:", error);
      }
    };

    const fetchRegionalManagers = async () => {
      try {
        const response = await axios.get(`https://it-club.uz/common/get-users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const regionalManagers = response.data.filter(
          (user) => user.status === userRoles.REGIONAL_MANAGER
        );
        console.log(regionalManagers);
        setRegions([{ username: "", full_name: "All" }, ...regionalManagers]);
      } catch (error) {
        console.error("Не удалось получить пользователей:", error);
      }
    };

    fetchFieldForceManagers();
    fetchRegionalManagers();
  }, [accessToken]);

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-label">{"Field Force Managers"}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={ff_manager}
          label="Birnimation"
          onChange={handleChange}
          sx={{ height: "45px" }}
        >
          {ff_managers.map((manager) => (
            <MenuItem key={manager.username} value={manager.username}>
              {manager.username ? manager.full_name : "All"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel id="demo-simple-select-label">{"Regional Managers"}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={region}
          label="Birnimation"
          onChange={handleChangeRegion}
          sx={{ height: "45px" }}
        >
          {regions.map((manager) => (
            <MenuItem key={manager.username} value={manager.username}>
              {manager.full_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

ManagersMenu.propTypes = {
  setRegion: PropTypes.func,
  setFf_manager: PropTypes.func,
  region: PropTypes.string,
  ff_manager: PropTypes.string,
};
