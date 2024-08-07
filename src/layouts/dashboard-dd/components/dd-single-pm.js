import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Avatar, Box, Typography, Button, Grid } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import UsersTable from "layouts/user-table";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import userRoles from "constants/userRoles";
import getFullStatusName, { getFullStatusTranslation } from "../../../constants/getFullStatusName";
import { useSelector } from "react-redux";

const DeputyDirectorSinglePM = () => {
  const [status, setStatus] = useState(userRoles.FIELD_FORCE_MANAGER);
  const location = useLocation();
  const navigate = useNavigate();

  const reduxUser = useSelector((state) => ({
    id: state.auth.userId,
    username: state.auth.username,
    region: {
      id: state.auth.regionId,
    },
  }));

  const user = location.state || reduxUser;

  const handleAddStatus = () => {
    let path;
    if (status === userRoles.FIELD_FORCE_MANAGER) {
      path = "/dd/add-ff";
    } else if (status === userRoles.REGIONAL_MANAGER) {
      path = "/dd/add-rm";
    } else if (status === userRoles.MEDICAL_REPRESENTATIVE) {
      path = "/dd/add-mr";
    }
    navigate(path, { state: user });
  };

  return (
    <DashboardLayout>
      <MDBox py={3}>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Card>
                <CardContent>
                  {/* User details section */}
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar src={""} sx={{ width: 56, height: 56, mr: 2 }} />
                    <Box>
                      <Typography variant="body2">
                        {getFullStatusTranslation(user.status)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.username}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="space-around" mb={3}>
                    <Button
                      variant={status === userRoles.FIELD_FORCE_MANAGER ? "contained" : "outlined"}
                      color="dark"
                      sx={{
                        color: status === userRoles.FIELD_FORCE_MANAGER ? "white" : "inherit",
                      }}
                      onClick={() => {
                        setStatus(userRoles.FIELD_FORCE_MANAGER);
                      }}
                    >
                      Менеджеры полевых персоналов
                    </Button>
                    <Button
                      variant={status === userRoles.REGIONAL_MANAGER ? "contained" : "outlined"}
                      color="dark"
                      sx={{
                        color: status === userRoles.REGIONAL_MANAGER ? "white" : "inherit",
                      }}
                      onClick={() => {
                        setStatus(userRoles.REGIONAL_MANAGER);
                      }}
                    >
                      Региональные менеджеры
                    </Button>
                    <Button
                      variant={
                        status === userRoles.MEDICAL_REPRESENTATIVE ? "contained" : "outlined"
                      }
                      color="dark"
                      sx={{
                        color: status === userRoles.MEDICAL_REPRESENTATIVE ? "white" : "inherit",
                      }}
                      onClick={() => {
                        setStatus(userRoles.MEDICAL_REPRESENTATIVE);
                      }}
                    >
                      Медицинские представители
                    </Button>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" mb={3}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ color: "white" }}
                      onClick={handleAddStatus}
                    >
                      Добавить
                    </Button>
                  </Box>

                  {/* Table section */}
                  <UsersTable
                    path={`common/get-users-by-username?username=${user.username}`}
                    status={status}
                    title={`${getFullStatusName(status)}s`}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Outlet />
    </DashboardLayout>
  );
};

export default DeputyDirectorSinglePM;
