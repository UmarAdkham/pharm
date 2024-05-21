/* eslint-disable prettier/prettier */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import userRoles from "constants/userRoles";

function DeputyDirectorAddMedicalRepresentative() {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth);
  const [full_name, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ffm_id, setFieldForceManagerId] = useState("");
  const [region_manager_id, setRegionalManagerId] = useState("");
  const [fieldForceManagers, setFieldForceManagers] = useState([]);
  const [regionalManagers, setRegionalManagers] = useState([]);
  const [message, setMessage] = useState({ color: "", content: "" });
  const user = location.state || {};

  useEffect(() => {
    const fetchFieldForceManagers = async () => {
      console.log(user.username);
      try {
        const response = await axios.get(
          `https://heartly1.uz/common/get-users-by-username?username=${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const fieldForceManagers = response.data.filter(
          (user) => user.status === userRoles.FIELD_FORCE_MANAGER
        );
        const regionalManagers = response.data.filter(
          (user) => user.status === userRoles.REGIONAL_MANAGER
        );
        setFieldForceManagers(fieldForceManagers);
        setRegionalManagers(regionalManagers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchFieldForceManagers();
  }, [accessToken]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Define the request payload
    const userData = {
      full_name,
      username,
      password,
      ffm_id,
      product_manager_id: user.id,
      region_manager_id,
      region_id: user.region_id,
      status: userRoles.MEDICAL_REPRESENTATIVE,
    };

    try {
      // Call the API with authorization header
      const response = await axios.post("https://heartly1.uz/dd/register-for-dd", userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Handle a successful response
      setMessage({ color: "success", content: "User successfully registered!" });

      // Optional: Redirect after a delay
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.log(error);
      // Handle errors gracefully
      setMessage({
        color: "error",
        content:
          "Failed to register user. " +
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
            Add Medical Representative
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {message.content && <Alert severity={message.color}>{message.content}</Alert>}
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Fullname"
                fullWidth
                value={full_name}
                onChange={(e) => setFullname(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="field-force-manager-label">Field Force Manager</InputLabel>
                <Select
                  labelId="field-force-manager-label"
                  value={ffm_id}
                  label="Field Force Manager"
                  onChange={(e) => setFieldForceManagerId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {fieldForceManagers.map((ffm) => (
                    <MenuItem key={ffm.id} value={ffm.id}>
                      {ffm.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </MDBox>
            <MDBox mb={2}>
              <FormControl fullWidth>
                <InputLabel id="regional-manager-label">Regional Manager</InputLabel>
                <Select
                  labelId="regional-manager-label"
                  value={region_manager_id}
                  label="Regional Manager"
                  onChange={(e) => setRegionalManagerId(e.target.value)}
                  sx={{ height: "45px" }}
                >
                  {regionalManagers.map((rm) => (
                    <MenuItem key={rm.id} value={rm.id}>
                      {rm.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default DeputyDirectorAddMedicalRepresentative;
