import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SelectCategory({ selectDatas }) {
  const { categories, categori, handleChange, title } = selectDatas;
  return (
    <FormControl sx={{ m: 1, minWidth: 200 }}>
      <InputLabel id="demo-simple-select-label">{title}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={categori}
        label="Birnimation"
        onChange={handleChange}
        sx={{ height: "45px" }}
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

SelectCategory.propTypes = {
  selectDatas: PropTypes.object,
};
