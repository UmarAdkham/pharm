import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid, Box, Typography } from "@mui/material";
import axiosInstance from "services/axiosInstance";

const OverallValues = ({ overall }) => {
  const [planSum, setPlanSum] = useState(null);

  useEffect(() => {
    // Make the axios request to fetch the plan_sum
    if (overall.month) {
      axiosInstance
        .get(`common/get-all_plan_sum?month_number=${overall.month}`)
        .then((response) => {
          setPlanSum(response.data.plan_sum);
        })
        .catch((error) => {
          console.error("Error fetching plan sum:", error);
        });
    }
  }, [overall]);

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
            Кол-во: {overall.numberOfDoctors}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            План общ: {planSum?.toLocaleString("ru-RU")}{" "}
            <span style={{ textTransform: "lowercase" }}>сум</span>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            План прик: {overall.monthlyPlan?.toLocaleString("ru-RU")}{" "}
            <span style={{ textTransform: "lowercase" }}>сум</span>
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="button" fontWeight="medium">
            Факт общ: {overall.fact?.toLocaleString("ru-RU")}{" "}
            <span style={{ textTransform: "lowercase" }}>сум</span> ( ~
            {overall.factPercent?.toFixed(2)}%)
          </Typography>
        </Grid>
        {!overall.hasBonus ? (
          <>
            <Grid item>
              <Typography variant="button" fontWeight="medium">
                Горячая продажа общ: {overall.totalHotSale?.toLocaleString("ru-RU")}{" "}
                <span style={{ textTransform: "lowercase" }}>сум</span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="button" fontWeight="medium">
                Вакант общ: {overall.vacant?.toLocaleString("ru-RU")}{" "}
                <span style={{ textTransform: "lowercase" }}>сум</span>
              </Typography>
            </Grid>
          </>
        ) : (
          <>
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
            <Grid item>
              <Typography variant="button" fontWeight="medium" sx={{ bgcolor: "#abcbff", p: 1 }}>
                Прединвест: {overall.pre_investment?.toLocaleString("ru-RU")}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

OverallValues.propTypes = {
  overall: PropTypes.shape({
    numberOfDoctors: PropTypes.number,
    monthlyPlan: PropTypes.number,
    fact: PropTypes.number,
    factPercent: PropTypes.number,
    totalHotSale: PropTypes.number,
    bonus: PropTypes.number,
    bonusPaid: PropTypes.number,
    bonusLeft: PropTypes.number,
    vacant: PropTypes.number,
    pre_investment: PropTypes.number,
    hasBonus: PropTypes.bool,
    month: PropTypes.number,
  }).isRequired,
};

export default OverallValues;
