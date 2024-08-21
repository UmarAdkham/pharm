import React, { useState, useEffect } from "react";
import { MenuItem, Select, FormControl, Box, Typography } from "@mui/material";
import axiosInstance from "services/axiosInstance";

const DebitorDropdown = () => {
  const [selectedValues, setSelectedValues] = useState({});
  const [totalDebitor, setTotalDebitor] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("head/get-all-reservations");
        const data = response.data;

        // Calculate total debt per manufactured company
        const companyDebts = data.reduce((acc, item) => {
          const company =
            item.pharmacy?.manufactured_company ||
            item.hospital?.manufactured_company ||
            item.wholesale?.manufactured_company;
          if (company && item.checked) {
            if (!acc[company]) {
              acc[company] = 0;
            }
            acc[company] += item.debt;
          }
          return acc;
        }, {});

        setSelectedValues(companyDebts);

        // Calculate the total debt
        const totalDebt = Object.values(companyDebts).reduce((acc, value) => acc + value, 0);
        setTotalDebitor(totalDebt);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <FormControl fullWidth>
        <Select
          value={`ДЕБИТОР: ${totalDebitor.toLocaleString("ru-RU")} сум`}
          displayEmpty
          sx={{
            bgcolor: "#f77c48",
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
          <MenuItem value={`ДЕБИТОР: ${totalDebitor.toLocaleString("ru-RU")} сум`} disabled>
            ДЕБИТОР: {totalDebitor.toLocaleString("ru-RU")} сум
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

export default DebitorDropdown;
