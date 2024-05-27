import "./EmployeesPage.scss"
import { Link } from 'react-router-dom'
import AddSquare from "../../assets/products/AddSquare.svg";
import UserDataCard from "../../components/UserDataCard/UserDataCard";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";

function EmployeesPage() {
  const [employeesData, setEmloyeesData] = useState([]);

  useEffect(() => {
    const storedClientsData = JSON.parse(localStorage.getItem("employees")) || [];
    setEmloyeesData(storedClientsData);
  }, []);
  return (
    <div className="employes-page-section">
   <div className="link-div">

<Link to="/admin/employees/add-employes" className="link-to-manage-products">   <img src={AddSquare} alt="AddSquare"  />Add Employees</Link>
 </div>
    <div className="employes-inner-section">
       <h2> Employees </h2>
       <Box sx={{display:"flex", flexWrap:"wrap",gap:3, justifyContent:"flex-start"}}>

{
  employeesData.map((data,index)=>(
    <UserDataCard key={index}
    name={data.name}
    employeeDesigination={data.designation}
    employeeMobile={data.mobile}
    />
  ))
}
  </Box>
    </div>
  </div>
  )
}

export default EmployeesPage