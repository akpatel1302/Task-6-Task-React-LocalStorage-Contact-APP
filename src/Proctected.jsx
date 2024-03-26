import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

function Proctected(props) {
  const { Component } = props;
  // const navigate = useNavigate();

  useEffect(() => {
    // const storedUsers = JSON.parse(localStorage.getItem("userRecords"));
    // console.log('------------------------>', storedUsers)

    // if (!storedUsers) {
    //   navigate("/login");
    // }
  });

  return (
    <>
      <Component />
    </>
  );
}

export default Proctected;
