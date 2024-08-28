import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import useProductData from "./product-data";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SelectCategory from "layouts/dashboard-dd/elements/category-menu";
// import SelectCategory from "../components/category-menu";
// import ManagersMenu from "../components/managers-menu";

function ProductManagerProductTable({
  path,
  status,
  title,
  tableType,
  navigatePath,
  onRowClick,
  showAddButton,
  rowPath,
  navigateState,
  showFilters,
  selectDatas,
}) {
  const { accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [region, setRegion] = useState("");
  const [ff_manager, setFf_manager] = useState("");

  let tableData = { columns: [], rows: [] };

  switch (tableType) {
    case "products":
      tableData =
        useProductData(path, selectDatas?.[0]?.categori, selectDatas?.[1]?.categori) || tableData;
      break;
    default:
      break;
  }
  const { columns, rows } = tableData;

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {title}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" alignItems="center">
          {showFilters && (
            <>
              {selectDatas?.[0] && <SelectCategory selectDatas={selectDatas[0]} />}
              {selectDatas?.[1] && <SelectCategory selectDatas={selectDatas[1]} />}

              {/* {!selectDatas?.[0] && !selectDatas?.[1] && (
                <ManagersMenu
                  setFf_manager={setFf_manager}
                  setRegion={setRegion}
                  ff_manager={ff_manager}
                  region={region}
                />
              )} */}
            </>
          )}

          {showAddButton && (
            <MDBox>
              <Button
                variant="contained"
                color="success"
                sx={{ color: "white" }}
                onClick={() => {
                  navigateState
                    ? navigate(navigatePath, { state: navigateState })
                    : navigate(navigatePath);
                }}
              >
                Добавить
              </Button>
            </MDBox>
          )}
        </MDBox>
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

ProductManagerProductTable.propTypes = {
  path: PropTypes.string,
  status: PropTypes.string,
  title: PropTypes.string,
  tableType: PropTypes.string,
  navigatePath: PropTypes.string,
  rowPath: PropTypes.string,
  onRowClick: PropTypes.func,
  showAddButton: PropTypes.bool,
  showFilters: PropTypes.bool,
  navigateState: PropTypes.object,
  selectDatas: PropTypes.arrayOf(PropTypes.object),
};

ProductManagerProductTable.defaultProps = {
  title: "",
  onRowClick: () => {},
  showAddButton: true,
  showFilters: false,
  selectDatas: [],
};

export default ProductManagerProductTable;
