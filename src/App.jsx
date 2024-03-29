import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";
import Contact from "./Contact/Contact";
import Proctected from "./Proctected/Proctected";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="*" element={<Signin />}></Route>
        <Route
          path="/contact"
          element={<Proctected Component={Contact} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
