import { useState } from "react";
import "./Sidebar.scss";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, NavLink } from "react-router-dom";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { HiOutlineUserGroup } from "react-icons/hi2";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProSidebar collapsed={collapsed} className="app">
      <Menu>
        <MenuItem
          className="menu1"
          icon={<MenuRoundedIcon />}
          onClick={() => setCollapsed(!collapsed)}
        >
          <h2> RemitBae</h2>
        </MenuItem>
        {/* Business */}
        <MenuItem className="sub_menus">Business </MenuItem>
        <NavLink className="navelink"  to="/admin/dashboaed">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Dashboard
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/stocks">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Stocks
          </MenuItem>
        </NavLink> 
      

        <NavLink className="navelink" to="/admin/sales">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Sales
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/purchase">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Purchase 
          </MenuItem>
        </NavLink>
        {/* <NavLink className="navelink" to="/admin/clients">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Clients
          </MenuItem>
        </NavLink> */}
        <NavLink className="navelink" to="/admin/quotation-generator">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Quotation
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/projects">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Projects
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/receipt">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Receipt
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/payment-out">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Payment
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/creadit-note">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            Credit Note
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/debit-note">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
        Debit Note
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/expense">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
        Expense
          </MenuItem>
        </NavLink>

        <NavLink className="navelink" to="/admin/delivery-challan">
          <MenuItem
            icon={<DashboardOutlinedIcon style={{ fontSize: "20px" }} />}
          >
Delivery Challan
          </MenuItem>
        </NavLink>
        
        {/* Accounts */}
        <MenuItem className="sub_menus">Accounts </MenuItem>
        <NavLink className="navelink" to="/admin/dash2">
          <MenuItem
            icon={<PeopleAltOutlinedIcon style={{ fontSize: "20px" }} />}
          >
            
            Dashboard
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/holidays">
          <MenuItem icon={<GridViewRoundedIcon style={{ fontSize: "20px" }} />}>
          Vouchers
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/leaderboard">
          <MenuItem icon={<GridViewRoundedIcon style={{ fontSize: "20px" }} />}>
          Reports
          </MenuItem>
        </NavLink>
        {/* Human resources */}
        <MenuItem className="sub_menus">Human resources </MenuItem>
        <NavLink className="navelink" to="/admin/dash3">
          <MenuItem icon={<GridViewRoundedIcon style={{ fontSize: "20px" }} />}>
            
          Dashboard
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/employees">
          <MenuItem icon={<GridViewRoundedIcon style={{ fontSize: "20px" }} />}>
          Employes
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/customers">
          <MenuItem icon={<HiOutlineUserGroup style={{ fontSize: "20px" }} />}>
          Attendance
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/forex">
          <MenuItem icon={<GridViewRoundedIcon style={{ fontSize: "20px" }} />}>
          Salary
          </MenuItem>
        </NavLink>
        <NavLink className="navelink" to="/admin/forex2">
          <MenuItem icon={<GridViewRoundedIcon style={{ fontSize: "20px" }} />}>
          Holidays
          </MenuItem>
        </NavLink>
        {/* Settings */}
        <MenuItem className="sub_menus">Settings </MenuItem>
        
        
       
      </Menu>
    </ProSidebar>
  );
}

export default Sidebar;
