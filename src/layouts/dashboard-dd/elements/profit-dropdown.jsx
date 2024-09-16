import React, { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, Box } from "@mui/material";
import PropTypes from "prop-types";

const ProfitDropdown = ({ filteredRows }) => {
  const [selectedValues, setSelectedValues] = useState({});
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    const calculateDebt = () => {
      if (!filteredRows || filteredRows.length === 0) return;

      // Calculate total debt per manufactured company based on filteredRows
      const companyProfits = filteredRows.reduce((acc, item) => {
        const company =
          item.pharmacy?.manufactured_company ||
          item.hospital?.manufactured_company ||
          item.wholesale?.manufactured_company;

        const profit = parseFloat(item.profit || 0);

        if (company) {
          // Assuming "Проверено" means checked
          if (!acc[company]) {
            acc[company] = 0;
          }
          acc[company] += profit;
        }
        return acc;
      }, {});

      setSelectedValues(companyProfits);

      // Calculate the total debt
      const totalProfit = Object.values(companyProfits || {}).reduce(
        (acc, value) => acc + value,
        0
      );
      setTotalProfit(totalProfit);
    };

    calculateDebt();
  }, [filteredRows]);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <FormControl fullWidth>
        <Select
          value={`ПОСТУПЛЕНИЕ: ${totalProfit.toLocaleString("ru-RU")} сум`}
          displayEmpty
          sx={{
            bgcolor: "#81c784",
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
          <MenuItem value={`ПОСТУПЛЕНИЕ: ${totalProfit.toLocaleString("ru-RU")} сум`} disabled>
            ПОСТУПЛЕНИЕ: {totalProfit.toLocaleString("ru-RU")} сум
          </MenuItem>
          {Object.entries(selectedValues).map(([company, profit]) => (
            <MenuItem key={company} value={company}>
              {company}: {profit.toLocaleString("ru-RU")} сум
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

ProfitDropdown.propTypes = {
  filteredRows: PropTypes.array.isRequired,
};

export default ProfitDropdown;
