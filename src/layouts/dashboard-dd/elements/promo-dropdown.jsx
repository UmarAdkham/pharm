import React, { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, Box } from "@mui/material";
import PropTypes from "prop-types";

const PromoDropdown = ({ filteredRows }) => {
  const [selectedValues, setSelectedValues] = useState({});
  const [totalPromo, setTotalPromo] = useState(0);

  useEffect(() => {
    const calculateDebt = () => {
      if (!filteredRows || filteredRows.length === 0) return;

      // Calculate total debt per manufactured company based on filteredRows
      const companyPromo = filteredRows.reduce((acc, item) => {
        const company =
          item.pharmacy?.manufactured_company ||
          item.hospital?.manufactured_company ||
          item.wholesale?.manufactured_company;

        const promo = parseFloat(item.promoValue || 0);

        if (company) {
          // Assuming "Проверено" means checked
          if (!acc[company]) {
            acc[company] = 0;
          }
          acc[company] += promo;
        }
        return acc;
      }, {});

      setSelectedValues(companyPromo);

      // Calculate the total debt
      const totalPromo = Object.values(companyPromo || {}).reduce((acc, value) => acc + value, 0);
      setTotalPromo(totalPromo);
    };

    calculateDebt();
  }, [filteredRows]);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <FormControl fullWidth>
        <Select
          value={`ПРОМО: ${totalPromo.toLocaleString("ru-RU")} сум`}
          displayEmpty
          sx={{
            bgcolor: "#f2cc45",
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
          <MenuItem value={`ПРОМО: ${totalPromo.toLocaleString("ru-RU")} сум`} disabled>
            ПРОМО: {totalPromo.toLocaleString("ru-RU")} сум
          </MenuItem>
          {Object.entries(selectedValues).map(([company, promo]) => (
            <MenuItem key={company} value={company}>
              {company}: {promo.toLocaleString("ru-RU")} сум
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

PromoDropdown.propTypes = {
  filteredRows: PropTypes.array.isRequired,
};

export default PromoDropdown;
