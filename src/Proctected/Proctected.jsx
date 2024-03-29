import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";

function Protected(props) {
  const { Component } = props;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      navigate("/signin"); // Redirect to signin if not logged in
    }
  }, [navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Warn user before navigating away
      event.preventDefault();
      event.returnValue = "";
      localStorage.removeItem("loggedInUser");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <Component />;
}

// props validation
Protected.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default Protected;
