import React from "react";
import PropTypes from "prop-types";
import { Grid, Box, Typography } from "@mui/material";
import DebitorDropdown from "./debitor-dropdown";
import ProfitDropdown from "./profit-dropdown";
import PromoDropdown from "./promo-dropdown";
import UncheckedDebitorDropdown from "./unchecked-debitor-dropdown";
import ExpiredDebitorDropdown from "./expired-debitor-dropdown";

const OverallDebtValues = ({ overall, filteredRows }) => {
  return (
    <Box
      p={2}
      sx={{
        overflowX: "auto",
        bgcolor: "#dff2f2",
        "&::-webkit-scrollbar": {
          height: "5px",
        },
        "&::-webkit-scrollbar-track": {
          bgcolor: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          bgcolor: "#888",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          bgcolor: "#555",
        },
      }}
    >
      <Grid container spacing={4} wrap="nowrap" sx={{ whiteSpace: "nowrap" }}>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            Кол-во с/ф: {overall.numberOfInvoices}
          </Typography>
        </Grid>
        <Grid item>
          <DebitorDropdown filteredRows={filteredRows} />
        </Grid>
        <Grid item>
          <UncheckedDebitorDropdown filteredRows={filteredRows} />
        </Grid>
        <Grid item>
          <ExpiredDebitorDropdown filteredRows={filteredRows} />
        </Grid>
      </Grid>
    </Box>
  );
};

OverallDebtValues.propTypes = {
  overall: PropTypes.shape({
    numberOfInvoices: PropTypes.number.isRequired,
    invoiceAmount: PropTypes.number.isRequired,
    profit: PropTypes.number.isRequired,
    debt: PropTypes.number.isRequired,
    promo: PropTypes.number,
    expired_debt: PropTypes.number,
  }).isRequired,
  filteredRows: PropTypes.array,
};

export default OverallDebtValues;
