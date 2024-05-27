import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import RigthSideLayout from "./components/RigthSideLayout/RigthSideLayout";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root layout */}
          <Route path="/"  element={<Layout />}>
          <Route path="admin" element={<RigthSideLayout />}>

          
          <Route path="about" element={<p>about</p>} />
          </Route>


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
