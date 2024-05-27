import { Avatar, Box, Button, Chip, Grid, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import InputComponent from "../InputComponent/InputComponent";
import "./AddProductDrawer.scss";
// import { FormControl } from "@mui/base/FormControl";
import bulkUpload from "../../assets/products/bulkUpload.svg";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";



function AddProductDrawer({
  handleSubmit,
  arrOfInputs,
  toggleDrawer,
  state,
  ProductFormData,
  updateData,
  handleImageChange,
  handleAdd,
  handleSelectChange,
  updatetrue,
  handleUpdateData,
  imagePreview,
  setImagePreview,
  setImg
  // setToggle,
  // toggle,
}) {
  // draw


  

  const list = (anchor) => (
    <Box
      sx={{ width: 700, mx: 5, my: 3 }}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, true)}
    >
      <Box sx={{ my: 3 }}>
        <h2> Product / Material </h2>
        <h4> Manage Products to the inventory </h4>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {arrOfInputs?.map((input, index) => {
            console.log("input.options",input.options)
            return (
              <Grid item key={index} xs={6} md={6}>
                <InputComponent
  handleChange={input.handleChange}
  handleSelectChange={handleSelectChange} // Pass handleSelectChange
  selectedValue={input.value} // Pass selectedValue if needed
  label={input.label}
  intputName={input.intputName}
  type={input.type}
  inputOrSelect={input.inputOrSelect}
  options={input.options}
  value={input.value}
  disabled={input.disabled}
/>

              </Grid>
            );
          })}
          


        {imagePreview? <Chip onDelete={()=>{setImagePreview(null);setImg(null);}} avatar={<img src={imagePreview}  width={100} height={100}  />} style={{marginTop:"15px",marginLeft:"10px"}} size="medium" />:

          <Button
            disableRipple
            sx={{
              mt: 5,
              ml: 2,
              color: "var(--black-button)",
              textTransform: "none",
              "&:hover": {
                background: "transparent",
              },
            }}
            component="label"
          >
            <img src={ImageAdd} alt="add ing" />
            <Typography variant="string" sx={{ pl: 1 }}>
              Upload product image
            </Typography>
            <input type="file" hidden onChange={handleImageChange} />
          </Button>}
        </Grid>
        { updatetrue ?<Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: "2rem",
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "var(--black-button)",
          }}
          onClick={handleUpdateData}
        >
          Update Product
        </Button>
:
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: "2rem",
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "var(--black-button)",
          }}
          onClick={handleAdd}
        >
          Add Product
        </Button>}



        <Button
          disableRipple
          sx={{
            mt: 4,
            mx: 2,
            textTransform: "none",
            color: "var(--black-button)",

            "&:hover": {
              background: "transparent",
            },
          }}
          component="label"
        >
          {/* <FileUploadOutlinedIcon /> */}
          <img src={bulkUpload} alt="bulkUpload" />
          <Typography
            variant="string"
            sx={{
              paddingLeft: 1,
            }}
          >
            {" "}
            Bulk Upload
          </Typography>
          <input type="file" hidden onChange={handleImageChange} />
        </Button>
      </form>
    </Box>
  );
  console.log(updateData);
  return (
    <Drawer
      // sx={{
      //   width: 700,
      //   flexShrink: 0,
      //   '& .MuiDrawer-paper': {
      //     width: 700,
      //     boxSizing: 'border-box',
      //   },
      // }}
      sx={{
        "& .MuiDrawer-root": {
          position: "absolute",
        },
        "& .MuiPaper-root": {
          position: "absolute",
        },
      }}
      anchor="right"
      open={state["right"]}
      onClose={toggleDrawer("right", false)}
      className="drawer-component"
    >
      {list("right")}
    </Drawer>
  );
}

export default AddProductDrawer;
