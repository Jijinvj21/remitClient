import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root layout */}
        <Route>
          <Route path="/admin" element={<p>test</p>}>
          
        


          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
