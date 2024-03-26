import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Signin from "./Signin";
import Signup from "./Signup";
import Contact from "./Contact";
import Proctected from "./Proctected";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/contact" element={<Proctected Component={Contact} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
