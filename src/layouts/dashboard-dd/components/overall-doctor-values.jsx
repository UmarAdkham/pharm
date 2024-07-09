import React from "react";
import PropTypes from "prop-types";
import { Grid, Box, Typography } from "@mui/material";

const OverallValues = ({ overall }) => {
  return (
    <Box p={2} sx={{ overflowX: "auto", bgcolor: "#dff2f2" }}>
      <Grid container spacing={4} wrap="nowrap" sx={{ whiteSpace: "nowrap" }}>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            Кол-во врачей: {overall.numberOfDoctors}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            План общ: {overall.monthlyPlan?.toLocaleString("ru-RU")}{" "}
            <span style={{ textTransform: "lowercase" }}>сум</span>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            Факт общ: {overall.fact?.toLocaleString("ru-RU")}{" "}
            <span style={{ textTransform: "lowercase" }}>сум</span> (
            {overall.factPercent?.toFixed(2)}%)
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#f2cc45", p: 1 }}>
            Бонус общ: {overall.bonus?.toLocaleString("ru-RU")}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#81c784", p: 1 }}>
            Выплачено: {overall.bonusPaid?.toLocaleString("ru-RU")}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#f77c48", p: 1 }}>
            Остаток: {overall.bonusLeft?.toLocaleString("ru-RU")}
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
