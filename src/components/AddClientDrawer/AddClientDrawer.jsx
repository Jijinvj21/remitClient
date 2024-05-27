import { Autocomplete, Box, Button, Grid, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import InputComponent from "../InputComponent/InputComponent";
import "./AddClientDrawer.scss";
// import { FormControl } from "@mui/base/FormControl";
import bulkUpload from "../../assets/products/bulkUpload.svg";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import { useEffect, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { countryOptionsGetAPI, projectCreateAPI, workTypeOptionsGetAPI } from "../../service/api/admin";



function AddClientDrawer({
  arrOfInputs,
  toggleDrawer,
  projectFormData,
  handleImageChange,
  handleAdd,
  setToggle,
  toggle,
  state
}) {
  // draw
  const [workTypeOptions,setWorkTypeOptions]=useState([])
  const [workTypeSelected,setWorkTypeSelected]=useState(null)
  const [contryOptions,setContryOptions]=useState([])
  const [contrySelect,setContrySelect]=useState(null)
  const [buttonToggle, setButtonToggle] = useState(true);


  useEffect(() => {
    countryOptionsGetAPI().then((data) => {
      // console.log("country:", data);
  
      const countryData = data.map(entry => ({
        value: entry.id,
        label: entry.name,
  
      }));
      setContryOptions(countryData);
    }).catch((err) => {
      console.log(err);
    });
  
    workTypeOptionsGetAPI().then((data) => {
      console.log("work type:", data);
  
      const workTypeData = data.map(entry => ({
        value: entry.id,
        label: entry.name,
  
      }));
      console.log(workTypeData)
      setWorkTypeOptions(workTypeData);
    }).catch((err) => {
      console.log(err);
    });
  }, [])
  const handleAddClient = () => {
console.log("first")
const formData = new FormData();

formData.append('name', projectFormData.project);
  formData.append('client_name', projectFormData.name);
  formData.append('work_type', workTypeSelected);
  formData.append('phonenumber', projectFormData.mobile);
  formData.append('email', projectFormData.email);
  formData.append('address1', projectFormData.address1);
  formData.append('address2', projectFormData.address2);
  formData.append('country', contrySelect);
  formData.append('postal_code', projectFormData.pinCode);
  formData.append('has_plan_given', buttonToggle);
    projectCreateAPI(formData).then((data)=>{
console.log(data)
    })
    .catch((err)=>{
console.log(err)
    })


  
    // Reset form data and state variables

  
  };

  

  const list = (anchor) => (
    <Box
      sx={{ width: 700, mx: 5, my: 3 }}
      role="presentation"
      onClick={toggleDrawer(anchor, true)}
      onKeyDown={toggleDrawer(anchor, true)}
    >
      <Box sx={{ my: 3 }}>
        <h2> Create project </h2>
        {/* <h4> Manage Products to the inventory </h4> */}
      </Box>
        <Grid container spacing={2}>
          {arrOfInputs?.map((input, index) => {
            return (
              <Grid item key={index} xs={6} md={6}>
                <InputComponent
  handleChange={input.handleChange}
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
         <Grid xs={6} md={6} sx={{pt:"16px",pl:"16px",display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
            <p className="input-name">Work Type</p>

            <Autocomplete
              sx={{
                display: "inline-block",
                "& input": {
                  width: "100%",
                  
                  border: "none",
                  bgcolor: "var(--inputbg-color)",
                  color: (theme) =>
                    theme.palette.getContrastText(
                      theme.palette.background.paper
                    ),
                },
              }}
              id="custom-input-demo"
              options={workTypeOptions}
              // value={selectedProduct}
            onChange={(e,newValue)=>setWorkTypeSelected(newValue.value)}
            componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -20],
                      },
                    },
                  ],
                },
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <input
                    type="text"
                    {...params.inputProps}
                    style={{ height: "42px",borderRadius:10,width:"99%",paddingLeft:"10px"  }}
                  />
                </div>
              )}
            />
          </Grid>


          <Grid xs={6} md={6} sx={{pt:"16px",pl:"16px",display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
            <p className="input-name">Country</p>

            <Autocomplete
              sx={{
                display: "inline-block",
                "& input": {
                  width: "100%",
                  
                  border: "none",
                  bgcolor: "var(--inputbg-color)",
                  color: (theme) =>
                    theme.palette.getContrastText(
                      theme.palette.background.paper
                    ),
                },
              }}
              id="custom-input-demo"
              options={contryOptions}
            //   value={selectedProduct}
              onChange={(e,newValue)=>setContrySelect(newValue.value)}
              componentsProps={{
                popper: {
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, -20],
                      },
                    },
                  ],
                },
              }}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <input
                    type="text"
                    {...params.inputProps}
                    style={{ height: "42px",borderRadius:10,width:"99%",paddingLeft:"10px" }}
                  />
                </div>
              )}
            />
          </Grid>

            <Grid item xs={6} md={12}>
              <div style={{display:"flex", flexDirection:"column",alignItems:"start"}}>
                <div >
                  <h5> Has plan given?</h5>
                  <ToggleButtonGroup
                    value={toggle ? "true" : "false"} // Convert toggle state to string value
                    exclusive
                    onChange={(e, value) => setButtonToggle(value === "true")}
                    aria-label="text alignment"
                  >
                    <ToggleButton
                      value="true"
                      aria-label="left aligned"
                      sx={{
                        fontSize: "12px",
                        borderRadius: "35px",
                        width: "90px",
                        height: "35px",
                        textAlign: "center",
                        marginTop: "5px",
                        marginLeft: "10px",
                        "&.Mui-selected, &.Mui-selected:hover": {
                          color: "white",
                          backgroundColor: "#8cdb7e",
                        },
                      }}
                    >
                      <p>yes</p>
                    </ToggleButton>
                    <ToggleButton
                      value="false"
                      aria-label="centered"
                      sx={{
                        fontSize: "12px",
                        borderRadius: "35px",
                        width: "90px",
                        height: "35px",
                        textAlign: "center",
                        marginTop: "5px",
                        marginLeft: "10px",
                        "&.Mui-selected, &.Mui-selected:hover": {
                          color: "white",
                          backgroundColor: "#8cdb7e",
                        },
                      }}
                    >
                      <p>no</p>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>
                {toggle && (
                  <Button
                    disableRipple
                    sx={{
                      mt: 2,
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
                      Add Photo
                    </Typography>
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>
                )}
              </div>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 1,
                fontWeight: "bold",
                textTransform: "none",
                bgcolor: "var(--black-button)",
                "&:hover": {
                  background: "var(--button-hover)",
                },
              }}
              // onClick={handleOpen}
              onClick={handleAddClient}
            >
              Add project
            </Button>
        </Grid>
 




    </Box>
  );
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

export default AddClientDrawer;
