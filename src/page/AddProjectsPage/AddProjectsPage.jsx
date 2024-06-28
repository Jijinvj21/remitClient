import { Autocomplete, Box, Button, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import "./AddProjectsPage.scss";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useEffect, useState } from "react";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { countryOptionsGetAPI, projectCreateAPI, workTypeOptionsGetAPI } from "../../service/api/admin";

function AddProjectsPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    pinCode: "",
    worktype: "",
    country: "",
    project: "",
  });
  const [img, setImg] = useState(null);
  const [csv, setCsv] = useState(null);

  const [toggle, setToggle] = useState(true);
  const [errors, setErrors] = useState({});
  const [contryOptions, setContryOptions] = useState([]);
  const [workTypeOptions, setWorkTypeOptions] = useState([]);
  const [workTypeSelected, setWorkTypeSelected] = useState(null);
  const [contrySelect, setContrySelect] = useState(null);

  useEffect(() => {
    countryOptionsGetAPI()
      .then((data) => {
        const countryData = data.map(entry => ({
          value: entry.id,
          label: entry.name,
        }));
        setContryOptions(countryData);
      })
      .catch((err) => {
        console.log(err);
      });

    workTypeOptionsGetAPI()
      .then((data) => {
        const workTypeData = data.map(entry => ({
          value: entry.id,
          label: entry.name,
        }));
        setWorkTypeOptions(workTypeData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const handleCSVChange = (e) => {
    const file = e.target.files[0];
    setCsv(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fieldDisplayNames = {
    name: "Name",
    email: "Email",
    mobile: "Mobile",
    address1: "Address 1",
    address2: "Address 2",
    pinCode: "Pin code",
    worktype: "Work type",
    country: "Country",
    project: "Project",
  };

  const arrOfInputs = [
    {
      handleChange: handleChange,
      intputName: "project",
      label: "Project Name",
      type: "text",
      value: formData.project
    },
    {
      handleChange: handleChange,
      intputName: "name",
      label: "Client Name",
      type: "text",
      value: formData.name
    },
    {
      handleChange: handleChange,
      intputName: "email",
      label: "Email",
      type: "email",
      value: formData.email
    },
    {
      handleChange: handleChange,
      intputName: "mobile",
      label: "Mobile",
      type: "tel",
      value: formData.mobile
    },
    {
      handleChange: handleChange,
      intputName: "address1",
      label: "Address 1",
      type: "text",
      value: formData.address1
    },
    {
      handleChange: handleChange,
      intputName: "address2",
      label: "Address 2",
      type: "text",
      value: formData.address2
    },
    {
      handleChange: handleChange,
      intputName: "pinCode",
      label: "Pin Code",
      type: "text",
      value: formData.pinCode
    },
  ];

  const handleAddClient = () => {
    const formDataObj = new FormData();
    formDataObj.append('name', formData.project);
    formDataObj.append('client_name', formData.name);
    formDataObj.append('work_type', workTypeSelected);
    formDataObj.append('phonenumber', formData.mobile);
    formDataObj.append('email', formData.email);
    formDataObj.append('address1', formData.address1);
    formDataObj.append('address2', formData.address2);
    formDataObj.append('country', contrySelect);
    formDataObj.append('postal_code', formData.pinCode);
    formDataObj.append('has_plan_given', toggle);
    if (img) {
      formDataObj.append('image', img);
    }
    // if (csv) {
    //   formDataObj.append('file', csv);
    // }

    projectCreateAPI(formDataObj).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });

    setFormData({
      name: "",
      email: "",
      mobile: "",
      address1: "",
      address2: "",
      pinCode: "",
      worktype: "",
      country: "",
      project: "",
    });
    setImg(null);
    setCsv(null);
    setToggle(true);
    setErrors({});
  };

  return (
    <div className="add-client-page-container">
      <Button
        disableRipple
        sx={{
          mb: 2,
          textTransform: "none",
          color: "var(--black-button)",
          "&:hover": {
            background: "transparent",
          },
        }}
        component="label"
        onClick={() => navigate(-1)}
      >
        <KeyboardBackspaceIcon />
        Back
      </Button>
      <div className="add-client-page">
        <h2>Add Project</h2>
        <Grid container spacing={2}>
          {arrOfInputs.map((input, index) => (
            <Grid item key={index} xs={6} md={4}>
              <InputComponent
                handleChange={handleChange}
                label={input.label}
                intputName={input.intputName}
                type={input.type}
                inputOrSelect={input.inputOrSelect}
                required={input.required}
                hidden={input.hidden}
                value={input.value}
              />
              {errors[input?.intputName] && (
                <span className="error-message-in-input-fiels">
                  {errors[input.intputName]}
                </span>
              )}
            </Grid>
          ))}
          <Grid xs={6} md={4} sx={{ pt: "16px", pl: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <p className="input-name">Work Type</p>
            <Autocomplete
              sx={{
                display: "inline-block",
                "& input": {
                  width: "100%",
                  border: "none",
                  bgcolor: "var(--inputbg-color)",
                  color: (theme) =>
                    theme.palette.getContrastText(theme.palette.background.paper),
                },
              }}
              id="custom-input-demo"
              options={workTypeOptions}
              onChange={(e, newValue) => setWorkTypeSelected(newValue.value)}
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
                    style={{ height: "42px", borderRadius: 10, width: "99%", paddingLeft: "10px" }}
                  />
                </div>
              )}
            />
          </Grid>
          <Grid xs={6} md={4} sx={{ pt: "16px", pl: "16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <p className="input-name">Country</p>
            <Autocomplete
              sx={{
                display: "inline-block",
                "& input": {
                  width: "100%",
                  border: "none",
                  bgcolor: "var(--inputbg-color)",
                  color: (theme) =>
                    theme.palette.getContrastText(theme.palette.background.paper),
                },
              }}
              id="custom-input-demo"
              options={contryOptions}
              onChange={(e, newValue) => setContrySelect(newValue.value)}
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
                    style={{ height: "42px", borderRadius: 10, width: "99%", paddingLeft: "10px" }}
                  />
                </div>
              )}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
              <div>
                <h5>Has plan given?</h5>
                <ToggleButtonGroup
                  value={toggle ? "true" : "false"}
                  exclusive
                  onChange={(e, value) => setToggle(value === "true")}
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
                  <img src={ImageAdd} alt="add img" />
                  <Typography variant="string" sx={{ pl: 1 }}>
                    Add Photo
                  </Typography>
                  <input type="file" hidden onChange={handleImageChange} />
                </Button>
              )}
              {/* <input type="file" onChange={handleCSVChange} /> */}
            </div>
          </Grid>
        </Grid>
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: "2rem",
            fontWeight: "bold",
            textTransform: "none",
            bgcolor: "var(--black-button)",
            "&:hover": {
              background: "var(--button-hover)",
            },
          }}
          onClick={handleAddClient}
        >
          Add Project
        </Button>
      </div>
    </div>
  );
}

export default AddProjectsPage;
