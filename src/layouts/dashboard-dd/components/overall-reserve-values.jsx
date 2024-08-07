import React from "react";
import PropTypes from "prop-types";
import { Grid, Box, Typography } from "@mui/material";

const OverallReservationValues = ({ overall }) => {
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
          <Typography variant="button" fontWeight="medium">
            Обшая сумма с/ф: {overall.invoiceAmount?.toLocaleString("ru-RU")}{" "}
            <span style={{ textTransform: "lowercase" }}>сум</span>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#81c784", p: 1 }}>
            Поступление: {overall.profit?.toLocaleString("ru-RU")}{" "}
            <span style={{ textTransform: "lowercase" }}>сум</span>{" "}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#f77c48", p: 1 }}>
            Дебитор: {overall.debt?.toLocaleString("ru-RU")}
            <span style={{ textTransform: "lowercase" }}>сум</span>{" "}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#f2cc45", p: 1 }}>
            Промо: {overall.promo?.toLocaleString("ru-RU")}
            <span style={{ textTransform: "lowercase" }}>сум</span>{" "}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

OverallReservationValues.propTypes = {
  overall: PropTypes.shape({
    numberOfInvoices: PropTypes.number.isRequired,
    invoiceAmount: PropTypes.number.isRequired,
    profit: PropTypes.number.isRequired,
    debt: PropTypes.number.isRequired,
    promo: PropTypes.number,
  }).isRequired,
};

export default OverallReservationValues;
