import React, { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, Box } from "@mui/material";
import PropTypes from "prop-types";

const ExpiredDebitorDropdown = ({ filteredRows }) => {
  const [selectedValues, setSelectedValues] = useState({});
  const [totalExpiredDebitor, setTotalExpiredDebitor] = useState(0);

  useEffect(() => {
    const calculateDebt = () => {
      if (!filteredRows || filteredRows.length === 0) return;

      // Calculate total debt per manufactured company based on filteredRows
      const companyDebts = filteredRows.reduce((acc, item) => {
        const company =
          item.pharmacy?.manufactured_company ||
          item.hospital?.manufactured_company ||
          item.wholesale?.manufactured_company;

        console.log(item.invoice_number_value, item.expiredDebtValue);
        const expiredDebt = parseFloat(item.expiredDebtValue || 0);

        if (company) {
          // Assuming "Проверено" means checked
          if (!acc[company]) {
            acc[company] = 0;
          }
          acc[company] += expiredDebt;
        }
        return acc;
      }, {});

      setSelectedValues(companyDebts);

      // Calculate the total debt
      const totalDebt = Object.values(companyDebts || {}).reduce((acc, value) => acc + value, 0);
      setTotalExpiredDebitor(totalDebt);
    };

    calculateDebt();
  }, [filteredRows]);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <FormControl fullWidth>
        <Select
          value={`ПРОС ДЕБИТОРКА: ${totalExpiredDebitor.toLocaleString("ru-RU")} сум`}
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
          <MenuItem
            value={`ПРОС ДЕБИТОРКА: ${totalExpiredDebitor.toLocaleString("ru-RU")} сум`}
            disabled
          >
            ПРОС ДЕБИТОРКА: {totalExpiredDebitor.toLocaleString("ru-RU")} сум
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

ExpiredDebitorDropdown.propTypes = {
  filteredRows: PropTypes.array.isRequired,
};

export default ExpiredDebitorDropdown;
