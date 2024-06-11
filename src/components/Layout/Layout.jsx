import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


import "./Layout.scss";

function Layout() {
  // const user = useSelector((state) => state.login.token);
  // let location = useLocation();
  // console.log(user);

  // // Assuming user is an object and you want to check if user is authenticated
  // if (!user) {
  //     return <Navigate to="/sign-up" state={{ from: location }} replace />;
  // }

  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
      <Toaster />
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
