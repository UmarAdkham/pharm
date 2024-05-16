import { useState, useEffect } from "react";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { useSelector } from "react-redux";

export default function useUserData() {
  const [data, setData] = useState({ columns: [], rows: [] });

  // Replace this with actual token retrieval logic
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("http://heartly1.uz/common/get-users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const users = response.data;

        const columns = [
          { Header: "Username", accessor: "username", align: "left" },
          { Header: "Full Name", accessor: "full_name", align: "left" },
          { Header: "Status", accessor: "status", align: "center" },
        ];

        const rows = users.map((user) => ({
          username: (
            <MDTypography variant="caption" fontWeight="medium">
              {user.username}
            </MDTypography>
          ),
          full_name: (
            <MDTypography variant="caption" fontWeight="medium">
              {user.full_name}
            </MDTypography>
          ),
          status: (
            <MDTypography variant="caption" fontWeight="medium" color="text">
              {user.status}
            </MDTypography>
          ),
        }));

        const numOfUsers = users.length;

        setData({ columns, rows, numOfUsers });
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsers();
  }, [accessToken]);

  return data;
}
