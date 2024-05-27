import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

import "./Layout.scss";

function Layout() {
  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
