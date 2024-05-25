import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "services/axiosInstance";
import MDTypography from "components/MDTypography";

export default function useCategoryData(apiPath) {
  const [data, setData] = useState({ columns: [], rows: [] });
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    async function fetchCategories() {
      try {
        console.log(apiPath);
        const response = await axiosInstance.get(apiPath, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const categories = response.data;

        const columns = [{ Header: "Category name", accessor: "category", align: "left" }];

        const rows = categories.map((category) => ({
          name: (
            <MDTypography variant="caption" fontWeight="medium">
              {category.name}
            </MDTypography>
          ),
        }));

        setData({ columns, rows });
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategories();
  }, [accessToken, apiPath]);

  return data;
}
