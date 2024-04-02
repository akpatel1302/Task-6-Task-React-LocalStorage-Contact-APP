// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./App.css";
// import Signin from "./Signin/Signin";
// import Signup from "./Signup/Signup";
// import Contact from "./Contact/Contact";
// import Proctected from "./Proctected/Proctected";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Signup />}></Route>
//         <Route path="/signin" element={<Signin />}></Route>
//         <Route path="*" element={<Signin />}></Route>
//         <Route
//           path="/contact"
//           element={<Proctected Component={Contact} />}
//         ></Route>
//          <Route element={<PrivateRoute/>}>
//               <Route path='/' element={<Signup/>} />
//               <Route path='/c' element={<Contact/>} />
//           </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { createBrowserRouter } from "react-router-dom";
import "./App.css";
import Signin from "./pages/signin/Signin";
import Signup from "./pages/signup/Signup";
import Contact from "./pages/contact/Contact";
import { RouterProvider } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoutes from "./routes/PublicRoute";

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/",
        index: true,
        element: <Signup />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "*",
        element: <Signin />,
      },
    ],
  },
  {
    // path: "/contact",
    element: <PrivateRoute />,
    children: [
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <Contact />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
