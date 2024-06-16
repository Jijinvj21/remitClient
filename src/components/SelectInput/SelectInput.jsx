import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import "./SelectInput.scss";

const CustomOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
    input: {
      fontSize: "12px !important",
    },
  }));
  
  const CustomMenuItem = styled(MenuItem)(({ theme }) => ({
    fontSize: "12px !important",
  }));
  
  const SelectInput = ({ label, placeholder, name, setData, value,options,handleChange }) => {

  
    return (
      <div className="container">
        <label
          htmlFor={label}
          className="label"
        >
          {label}
        </label>
        <Select
          sx={{ borderRadius: "8px" }}
          labelId={label}
          id={label}
          value={value}
          onChange={handleChange}
          displayEmpty
          input={<CustomOutlinedInput />}
          renderValue={(selected) => {
            if (selected?.length === 0) {
              return (
                <em style={{ color: "#A0A0A0", fontSize: "12px" }}>
                  {placeholder}
                </em>
              );
            }
            return selected;
          }}
          className="select"
        >
          <CustomMenuItem disabled value="">
            <em style={{ fontSize: "12px" }}>{placeholder}</em>
          </CustomMenuItem>
          {options.map((option, index) => {
            console.log(option,"CustomMenuItem")
            return(
               
                   <CustomMenuItem  key={index} value={option.value} label={option.label}>{option.label}</CustomMenuItem>
                )})}
         
        </Select>
      </div>
    );
  };
  
  export default SelectInput;