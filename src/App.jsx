import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root layout */}
          <Route path="/"  element={<Layout />}>
          
          <Route path="about" element={<p>about</p>} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
