// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function Proctected(props) {
//   const { Component } = props;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUsers = JSON.parse(localStorage.getItem("userRecords"));
//     console.log('------------------------>', storedUsers)

//     if (!storedUsers.length) {

//       navigate("/signin");
//     }
//   });

//   return (
//     <>
//       <Component />
//     </>
//   );
// }

// export default Proctected;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Protected(props) {
  const { Component } = props;
  const navigate = useNavigate();

  // useEffect(() => {
  const storedUsers = JSON.parse(localStorage.getItem("userRecords"));

  // Check if storedUsers exist and if the user is authenticated
  console.log("-------", !storedUsers.isLoggedIn);
  if (!storedUsers || !storedUsers.isLoggedIn) {
    navigate("/signin");
  }
  // else
  // {
  //   navigate("/contact");
  // }
  // }, [navigate]);

  return <Component />;
}

Protected.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default Protected;
