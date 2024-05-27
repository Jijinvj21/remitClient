import { useState, useEffect } from "react";
import "./ProjectsPage.scss";
import { Link, useNavigate } from "react-router-dom";
import AddSquare from "../../assets/products/AddSquare.svg";
import { Box, CircularProgress } from "@mui/material";
import UserDataCard from "../../components/UserDataCard/UserDataCard";
import { projectGetAPI } from "../../service/api/admin";
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded';


function ProjectsPage() {

  // State to hold client data
  const [projectData, setProjectData] = useState([]);
  const [loader, setLoader]=useState(false)


  // Load client data from local storage when the component mounts
  useEffect(() => {
    
    setLoader(true)

    projectGetAPI().then((data)=>{
      setLoader(false)
      console.log("data.responseData",data.responseData)

      setProjectData(data.responseData)
    })
    .catch((err)=>{
      console.log(err)
      setLoader(false)

    })
    // const storedClientsData = JSON.parse(localStorage.getItem("clients")) || [];
    // setClientsData(storedClientsData);
  }, []);

  return (
    <div className="client-page-section">
      <div className="link-div">
        <Link to="/admin/projects/add-projects" className="link-to-manage-products">
          <img src={AddSquare} alt="AddSquare" />
          Add Project
        </Link>
      </div>
      <div className="client-inner-section">
        <h2> Project </h2>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "flex-start" }}>
          {/* Iterate over each client and render a UserDataCard component */}
          {
            loader ? <Box  sx={{ 
              my: 2, 
              mx: "auto", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center" 
            }}><CircularProgress color="inherit" /></Box> : 
            projectData===null? (
              // Show a message when no products are available
              <Box 
                sx={{ 
                  my: 2, 
                  mx: "auto", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center" 
                }}
              >
                <PlaylistAddRoundedIcon sx={{ mx: "auto" }} style={{ fontSize: "40px" }} />
                <p style={{ textAlign: "center" }}>No projects available</p>
              </Box>
            ) : (

              
              projectData?.map((project, index) => (
                <UserDataCard
                
                key={index}
                name={project.name}
                clientLocation={project.address1}
                product={project.product}
                id={project.id}
                
                // You can pass other client data as props to UserDataCard component as needed
                />
              )
              ))}
        </Box>
      </div>
    </div>
  );
}

export default ProjectsPage;
