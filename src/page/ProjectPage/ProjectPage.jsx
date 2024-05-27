import AddSquare from "../../assets/products/AddSquare.svg";
import "./ProjectPage.scss";
import Modal from "@mui/material/Modal";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useState } from "react";
import { Box } from "@mui/material";
import {  useNavigate } from "react-router-dom";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

function ProjectPage() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    projectName: "", // Changed to camelCase convention
    clientName: "", // Changed to camelCase convention
  });
  const inputsDatas = [
    {
      label: "Project Name",
      value: inputValue.projectName,
      intputName: "projectName",
    },
    {
      label: "Client Name",
      value: inputValue.clientName,
      intputName: "clientName",
    },
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      [name]: value,
    }));
  };

  return (
    <div className="client-page-section">
      <div className="add-product" onClick={handleOpen}>
        <div className="add-project-section">
          <img src={AddSquare} alt="AddSquare" />
          Add Project
        </div>
      </div>
      <div className="project-inner-section">
        {
            Array(5).fill().map((data,index)=>(
        <Box key={index} className="project-data-card" onClick={()=>navigate("/admin/project-data")}>
          <p>project name</p>
          <p>client name</p>
        </Box>

            ))
        }
      </div>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
              <h4> Add new project</h4>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                justifyContent: "space-between",
                alignItems: "center",
                my: 1,
              }}
            >
              {inputsDatas.map((data, index) => (
                <InputComponent
                  key={index}
                  label={data.label}
                  value={data.value}
                  handleChange={handleInputChange} // Pass the handler
                  name={data.intputName} // Pass name attribute
                />
              ))}
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default ProjectPage;
