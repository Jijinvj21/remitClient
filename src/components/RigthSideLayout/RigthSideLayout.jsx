import { Outlet } from "react-router-dom";
// import "./RightSideLayout.scss"; 
import "./RigthSideLayout.scss"
import RightSideHeader from "./RightSideHeader/RightSideHeader";

function RightSideLayout() {
  return (
    <div className="right_side_layout_components">
      <RightSideHeader />
      <Outlet />
    </div>
  );
}

export default RightSideLayout;
