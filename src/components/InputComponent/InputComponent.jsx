import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import "./InputComponent.scss";

const Input = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    position: "relative",
    backgroundColor: theme.palette.mode === "light" ? "#F3F6F9" : "#1A2027",
    border: "none",
    borderRadius: "10px",
    borderColor: theme.palette.mode === "light" ? "#42c2f5" : "#2D3843",
    fontSize: 16,
    width: "100%",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
  },
}));

function InputComponent({
  handleChange,
  handleSelectChange,
  selectedValue,
  state,
  label,
  type,
  required = true,
  intputName,
  inputOrSelect,
  options,
  value,
  disabled

}) {
  return (
    <>
      {/* Text Input */}
      <Box
        className="InputComponent-container"
        component="form"
        noValidate
        sx={{
          width: "100%", // Set width to 100%
          display: "grid",
          gridTemplateColumns: { sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        {inputOrSelect !== "select" && (
          <FormControl variant="standard" fullWidth sx={{ display: "inline" }}>
            {label && (
              <InputLabel shrink htmlFor={label}>
                {label}
              </InputLabel>
            )}
            <Input
              id={label}
              name={intputName}
              type={type}
              required
              value={value}
              onChange={handleChange}
              disabled={disabled}
            />
          </FormControl>
        )}
        {/* Select Input */}
        {inputOrSelect === "select" && (
          <div className="select-label">
            <label htmlFor="dropdown">{label}</label>

            <select value={value} onChange={handleChange}>
  {options?.map((option, index) => {
    return (
      <option
        key={index}
        value={option.value}
        label={option.label}
      />
    );
  })}
</select>

          </div>
        )}
      </Box>
    </>
  );
}

export default InputComponent;
