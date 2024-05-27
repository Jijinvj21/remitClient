import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root layout */}
          <Route path="/" >
          
          <Route path="about" element={<p>about</p>} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
