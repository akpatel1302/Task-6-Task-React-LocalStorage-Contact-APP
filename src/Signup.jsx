import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Signup = () => {
  const navigate = useNavigate();

  const [userRegister, setUserRegister] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [records, setRecords] = useState([]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserRegister({ ...userRegister, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check
    if (userRegister.password !== userRegister.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newRecord = { ...userRegister, id: new Date().getTime().toString() };
    const updatedRecords = [...records, newRecord];
    setRecords(updatedRecords);

    // Save to local storage
    localStorage.setItem("userRecords", JSON.stringify(updatedRecords));

    setUserRegister({
      username: "",
      password: "",
      confirmPassword: "",
    });
    navigate("/signin");
  };

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("userRecords"));
    if (storedRecords) {
      setRecords(storedRecords);
    }
  }, []);

  return (
    <>
      <section className="vh-100" style={{ backgroundColor: "#eee" }}>
        <h1>Contact App</h1>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: 25 }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Sign up
                      </p>
                      <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="email"
                              id="form3Example3c"
                              className="form-control"
                              name="username"
                              value={userRegister.username}
                              onChange={handleInput}
                              required
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example3c"
                            >
                              Your Email
                            </label>
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                              id="form3Example4c"
                              className="form-control"
                              name="password"
                              value={userRegister.password}
                              onChange={handleInput}
                              required
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example4c"
                            >
                              Password
                            </label>
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                              id="form3Example4cd"
                              className="form-control"
                              name="confirmPassword"
                              value={userRegister.confirmPassword}
                              onChange={handleInput}
                              required
                            />
                            <label
                              className="form-label"
                              htmlFor="form3Example4cd"
                            >
                              Confirm password
                            </label>
                          </div>
                        </div>
                        <div className="form-check d-flex justify-content-center mb-5">
                          <label
                            className="form-check-label"
                            htmlFor="form2Example3"
                          >
                            Already Register ?
                            <Link to={"/signin"}>Sign In</Link>
                          </label>
                        </div>
                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                          >
                            Register
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid"
                        alt="Sample image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
