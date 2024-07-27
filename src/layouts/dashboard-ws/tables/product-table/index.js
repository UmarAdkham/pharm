import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useWholesaleProductData from "./data/product-data";
import { useState } from "react";
import userRoles from "constants/userRoles";
import { useSelector } from "react-redux";

function WholesaleProductTable({ path, navigatePath }) {
  const navigate = useNavigate();
  const [totalProducts, setTotalProducts] = useState(null);
  const { columns, rows } = useWholesaleProductData(path, setTotalProducts);
  const { userRole } = useSelector((state) => state.auth);

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h5" gutterBottom>
            Продукты <br />
            <MDTypography variant="subtitle2" gutterBottom>
              Всего {totalProducts} штук{" "}
            </MDTypography>
          </MDTypography>
        </MDBox>
        {userRole == userRoles.WHOLESALE_MANAGER && (
          <MDBox>
            <Button
              variant="contained"
              color="success"
              sx={{ color: "white" }}
              onClick={() => {
                navigate(navigatePath);
              }}
            >
              Создать бронь
            </Button>
          </MDBox>
        )}
      </MDBox>
      <MDBox>
        <DataTable
          table={{
            columns,
            rows,
          }}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

WholesaleProductTable.propTypes = {
  path: PropTypes.string.isRequired,
  navigatePath: PropTypes.string,
};

export default WholesaleProductTable;
