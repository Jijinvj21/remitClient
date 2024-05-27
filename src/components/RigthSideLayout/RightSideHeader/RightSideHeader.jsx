import "./RightSideHeader.scss";
import { IoMoonOutline } from "react-icons/io5";
import { LuBell } from "react-icons/lu";

function RightSideHeader({imgSrc="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}) {
  return (
    <div className="right_side_header_componet">
      <div className="name_with_desigination">
        <h1> Hello Muhammed !</h1>
        <p>Administrator</p>
      </div>
      <div className="functional_icons_with_name">
        <IoMoonOutline size={20} className="icon" />
        <LuBell size={20} className="icon" />
        <div className="user_data">
          {
            imgSrc?<img src={imgSrc} alt="user_img" width={25} height={25} />: <h1 className="user_img" >M</h1>
          }
       
        <div className="user_name_with_time">
            <p className="user_name"> Muhammed Riyas A </p>
            <p> Started at: 10:05AM 25 Oct ‘23</p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default RightSideHeader;
