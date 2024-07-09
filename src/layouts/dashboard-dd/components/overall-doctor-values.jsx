import React from "react";
import PropTypes from "prop-types";
import { Grid, Box, Typography } from "@mui/material";

const OverallValues = ({ overall }) => {
  return (
    <Box p={2} sx={{ overflowX: "auto", bgcolor: "#dff2f2" }}>
      <Grid container spacing={2} wrap="nowrap">
        <Grid item xs={12} sm={2}>
          <Typography variant="button" fontWeight="medium">
            Кол-во врачей: {overall.numberOfDoctors}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="button" fontWeight="medium">
            План общ: {overall.monthlyPlan}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="button" fontWeight="medium">
            Факт общ: {overall.fact} ({overall.factPercent?.toFixed(2)}%)
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#f2cc45" }}>
            Бонус общ: {overall.bonus}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#81c784" }}>
            Выплачено: {overall.bonusPaid}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#f77c48" }}>
            Остаток: {overall.bonusLeft}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

OverallValues.propTypes = {
  overall: PropTypes.shape({
    numberOfDoctors: PropTypes.number.isRequired,
    monthlyPlan: PropTypes.number.isRequired,
    fact: PropTypes.number.isRequired,
    factPercent: PropTypes.number.isRequired,
    bonus: PropTypes.number.isRequired,
    bonusPaid: PropTypes.number.isRequired,
    bonusLeft: PropTypes.number.isRequired,
  }).isRequired,
};

export default OverallValues;
