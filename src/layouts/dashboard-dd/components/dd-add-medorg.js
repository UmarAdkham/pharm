import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import SearchControl from "../../../services/geoSearchController"; // Import the custom SearchControl component

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import userRoles from "constants/userRoles";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

// Fix for Leaflet's default marker icon not being displayed
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function DeputyDirectorAddMedOrganization() {
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [medRepId, setMedRepId] = useState(0);
  const [regionId, setRegionId] = useState(0);
  const [medReps, setMedReps] = useState([]);
  const [regions, setRegions] = useState([]);

  const [message, setMessage] = useState({ color: "", content: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://heartly1.uz/common/get-users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const medReps = response.data.filter(
          (user) => user.status == userRoles.MEDICAL_REPRESENTATIVE
        );
        setMedReps(medReps);
      } catch (error) {
        console.error("Failed to fetch medical representatives:", error);
      }
    };

    fetchUsers();
  }, [accessToken]);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`https://heartly1.uz/common/get-regions`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const regions = response.data;
        setRegions(regions);
      } catch (error) {
        console.error("Failed to fetch regions:", error);
      }
    };

    fetchRegions();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://heartly1.uz/common/add-medical-organization",
        {
          address,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          med_rep_id: parseInt(medRepId, 10),
          region_id: parseInt(regionId, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage({ color: "success", content: "Medical organization added successfully" });
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      setMessage({
        color: "error",
        content:
          "Failed to add medical organization. " +
          (error.response?.data?.detail || "Please check your input and try again."),
      });
    }
  };

  return (
    <BasicLayout>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Add Medical Organization
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="medical-representatives-label">Medical Representatives</InputLabel>
                <Select
                  labelId="medical-representatives-label"
                  value={medRepId}
                  label="Medical Representatives"
                  onChange={(e) => setMedRepId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {medReps.map((mr) => (
                    <MenuItem key={mr.id} value={mr.id}>
                      {mr.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="regions-label">Regions</InputLabel>
                <Select
                  labelId="regions-label"
                  value={regionId}
                  label="Regions"
                  onChange={(e) => setRegionId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {regions.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      {region.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2} style={{ height: "200px" }}>
              <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <SearchControl
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                  setAddress={setAddress}
                />
                {latitude !== 0 && longitude !== 0 && <Marker position={[latitude, longitude]} />}
              </MapContainer>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Address"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Add
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default DeputyDirectorAddMedOrganization;
