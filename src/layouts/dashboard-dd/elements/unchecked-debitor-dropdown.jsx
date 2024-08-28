import React, { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, Box } from "@mui/material";
import PropTypes from "prop-types";

const UncheckedDebitorDropdown = ({ filteredRows }) => {
  const [selectedValues, setSelectedValues] = useState({});
  const [totalDebitor, setTotalDebitor] = useState(0);

  useEffect(() => {
    const calculateDebt = () => {
      if (!filteredRows || filteredRows.length === 0) return;

      // Calculate total debt per manufactured company based on filteredRows
      const companyDebts = filteredRows.reduce((acc, item) => {
        const company =
          item.pharmacy?.manufactured_company ||
          item.hospital?.manufactured_company ||
          item.wholesale?.manufactured_company;

        const debt = parseFloat(item.debtValue || 0);

        if (company && !item.isChecked) {
          // Assuming "Проверено" means checked
          if (!acc[company]) {
            acc[company] = 0;
          }
          acc[company] += debt;
        }
        return acc;
      }, {});

      setSelectedValues(companyDebts);

      // Calculate the total debt
      const totalDebt = Object.values(companyDebts || {}).reduce((acc, value) => acc + value, 0);
      setTotalDebitor(totalDebt);
    };

    calculateDebt();
  }, [filteredRows]);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <FormControl fullWidth>
        <Select
          value={`СУММА БРОНИ: ${totalDebitor.toLocaleString("ru-RU")} сум`}
          displayEmpty
          sx={{
            bgcolor: "#a0d8eb",
            height: "35px",
            "& .MuiSelect-select": {
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              fontWeight: "medium",
              color: "black",
              height: "100%",
              textTransform: "uppercase",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          <MenuItem value={`СУММА БРОНИ: ${totalDebitor.toLocaleString("ru-RU")} сум`} disabled>
            СУММА БРОНИ: {totalDebitor.toLocaleString("ru-RU")} сум
          </MenuItem>
          {Object.entries(selectedValues).map(([company, debt]) => (
            <MenuItem key={company} value={company}>
              {company}: {debt.toLocaleString("ru-RU")} сум
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

UncheckedDebitorDropdown.propTypes = {
  filteredRows: PropTypes.array.isRequired,
};

export default UncheckedDebitorDropdown;
