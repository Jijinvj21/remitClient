import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Deleteicon from "../../assets/sideBar/RedDelete.svg";
import ImageAdd from "../../assets/sideBar/ImageAdd.svg";

function ProductInputCard({
  heading,
  qty,
  unit,
  rate,
  handleDelete,
  handleUpdate,
  image
}) {
  const userUpdate = {
    heading,
    qty,
    unit,
    rate,
  };
  return (
    <Box
      component="section"
      sx={{
        pl: 1,
        py: 2,
        display: "flex",
        flexDirection: "row",
        // alignItems: "center",
        // justifyContent:"between",
        bgcolor: "var(--product-card)",
        width: 250,
        borderRadius: "15px",
        cursor: "default",
      }}
      onClick={() => {
        handleUpdate(userUpdate);
      }}
    >
      <Box sx={{ display: "flex",justifyContent:"space-around", alignItems: "center",width:"20%" }}>
        {
          image?<img src={`https://drive.google.com/thumbnail?id=${image}&sz=w30`} alt="" />:<img src={ImageAdd} alt="add" />
        }

        


      </Box>
      <Box sx={{ height: "auto", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "between",
            gap: 5,
            alignItems: "center",
            px:2,
            pb:2

          }}
        >
          <Box sx={{width:"100%"}}>

          <p >{heading} </p>
          </Box>
          <img src={Deleteicon} alt="Delete" onClick={handleDelete} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Box
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "var(--text-muted)", fontSize: 14 }}>
              Qty
            </Typography>
            <Typography>{qty}</Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "var(--text-muted)", fontSize: 14 }}>
              Unit
            </Typography>
            <Typography>{unit}</Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography sx={{ color: "var(--text-muted)", fontSize: 14 }}>
              Rate
            </Typography>
            <Typography>{rate}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ProductInputCard;
