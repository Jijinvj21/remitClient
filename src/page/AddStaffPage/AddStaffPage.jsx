import { Button, Grid } from "@mui/material";
import "./AddStaffPage.scss";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useState } from "react";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg"
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";


function AddStaffPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    pinCode: "",
    designation: "",
    department: "",
    reportingTo: "",
    dateOfBirth: "",
    dateOfJoin: "",
    qualification: "",
    gender: "",
    salary: "",
    password: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });
  const [img, setImg] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Retrieve existing employee data from local storage or initialize an empty array
    const existingEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    
    // Create a new employee object with form data
    const newEmployee = {
      ...formData,
      image: img, // Assuming you want to store the image as well
    };
    
    // Append the new employee to the existing data
    const updatedEmployees = [...existingEmployees, newEmployee];
    
    // Update local storage with the updated array of employees
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    
    // Reset form data and state variables
    window.location.reload()

    setFormData({
      name: "",
      email: "",
      mobile: "",
      address1: "",
      address2: "",
      pinCode: "",
      designation: "",
      department: "",
      reportingTo: "",
      dateOfBirth: "",
      dateOfJoin: "",
      qualification: "",
      gender: "",
      salary: "",
      password: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
    });
    setImg(null);
  
    // Log to console for verification
    console.log("Employee added:", newEmployee);
    console.log("All employees:", updatedEmployees);
  };
  
  
  const arrOfInputs = [
    {
      handleChange: handleChange,
      intputName: "name",
      label: "Staff Name",
      type: "text",
      value:formData.name
      
    },
    {
      handleChange: handleChange,
      intputName: "email",
      label: "Email",
      type: "email",
      value:formData.email
      
    },
    {
      handleChange: handleChange,
      intputName: "mobile",
      label: "Mobile",
      type: "tel",
      value:formData.mobile
      
    },
    {
      handleChange: handleChange,
      intputName: "address1",
      label: "Address 1",
      type: "text",
      value:formData.address1
      
    },
    {
      handleChange: handleChange,
      intputName: "address2",
      label: "Address 2",
      type: "text",
      value:formData.address2
      
    },
    {
      handleChange: handleChange,
      intputName: "pinCode",
      label: "Pin Code",
      type: "text",
      value:formData.pinCode
      
    },
    {
      handleChange: handleChange,
      intputName: "designation",
      label: "Designation",
      type: "text",
      value:formData.designation
      
    },
    {
      handleChange: handleChange,
      intputName: "department",
      label: "Department",
      type: "text",
      value:formData.department
      
    },
    {
      handleChange: handleChange,
      intputName: "reportingTo",
      label: "Reporting To",
      // type: "text",
      inputOrSelect:"select",
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
      ],      
    },
    {
      handleChange: handleChange,
      intputName: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
      value:formData.dateOfBirth
      
    },
    {
      handleChange: handleChange,
      intputName: "dateOfJoin",
      label: "Date of Join",
      type: "date",
      value:formData.dateOfJoin
      
    },
    {
      handleChange: handleChange,
      intputName: "qualification",
      label: "Qualification",
      type: "text",
      value:formData.qualification
      
    },
    {
      handleChange: handleChange,
      intputName: "gender",
      label: "Gender",
      type: "text",
      value:formData.gender
      
    },
    {
      handleChange: handleChange,
      intputName: "salary",
      label: "Salary",
      type: "number",
      value:formData.salary
      
    },
    {
      handleChange: handleChange,
      intputName: "password",
      label: "Password",
      type: "password",
      value:formData.password
      
    },
    {
      handleChange: handleChange,
      intputName: "bankName",
      label: "Bank Name",
      type: "text",
      value:formData.bankName
      
    },
    {
      handleChange: handleChange,
      intputName: "accountNumber",
      label: "Account Number",
      type: "text",
      value:formData.accountNumber
      
    },
    {
      handleChange: handleChange,
      intputName: "ifsc",
      label: "IFSC",
      type: "text",
      value:formData.ifsc
      
    },
  ];

  return (
    <div className="add-staff-page-container">
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
        onClick={()=>navigate(-1)}
        >
        <KeyboardBackspaceIcon />
        Back
      </Button>

    <div className="add-staff-page">
      <form onSubmit={handleSubmit}>
        <div className="header">
          <div>
            <h2> Add Employees</h2>
            <h4> Enter the employees details to create a new employees </h4>
          </div>
          <Button
            disableRipple
            sx={{
              textTransform:"none",
              color:"var(--black-button)",
              "&:hover": {
                background: "transparent",
              },
            }}
            component="label"
            >
            
             <img src={ImageAdd} alt="add img"  />
            <Typography variant="string" sx={{
              pl:1
            }}>Add Photo</Typography>
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
        </div>
        <Grid container spacing={2}>
          {arrOfInputs.map((input, index) => {
            return (
              <Grid item key={index} xs={6} md={4}>
                <InputComponent
                  handleChange={input.handleChange}
                  state={input.state}
                  label={input.label}
                  type={input.type}
                  intputName={input.intputName}
                  inputOrSelect={input.inputOrSelect}
                  options={input.options}
                  
                  />
              </Grid>
            );
          })}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: "2rem", fontWeight: "bold",textTransform:"none", bgcolor:"var(--black-button)","&:hover": {
            background: "var(--button-hover)",}}}
            >
          Add Employees
        </Button>
      </form>
    </div>
          </div>
  );
}

export default AddStaffPage;
