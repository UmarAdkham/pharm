import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Avatar, Box, Typography, Button, Grid } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import UsersTable from "layouts/user-table";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";

const DDProductManager = () => {
  const location = useLocation();
  const user = location.state || {};
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
                      <Typography variant="h6">{user.fullname}</Typography>
                      <Typography variant="body2">{user.username}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {user.status}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Buttons section */}
                  <Box display="flex" justifyContent="space-around" mb={3}>
                    <Button variant="contained" color="primary">
                      Field Force Managers
                    </Button>
                    <Button variant="contained" color="primary">
                      Regional Managers
                    </Button>
                    <Button variant="contained" color="primary">
                      Medical Representatives
                    </Button>
                  </Box>

                  {/* Table section */}
                  <UsersTable
                    path={`common/get-users-by-username?username=${user.username}`}
                    role={"Product Manager"}
                    onRowClick={() => alert("Hello")}
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

export default DDProductManager;
