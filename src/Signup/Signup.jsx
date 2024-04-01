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
  const [contactList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserRegister({ ...userRegister, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingUser = records.find(
      (record) => record.username === userRegister.username
    );

    if (existingUser) {
      alert("Email or username already exists!");
      return;
    }
    // Check
    if (userRegister.password !== userRegister.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Encode password before storing
    const encodedPassword = window.btoa(userRegister.password);

    const { confirmPassword, ...userWithoutConfirmPassword } = userRegister;
    const newRecord = {
      ...userWithoutConfirmPassword,
      id: new Date().getTime().toString(),
      // Store encoded password
      password: encodedPassword,
      contactList: contactList,
    };

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
      <section className="vh-100">
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
                              type={showPassword ? "text" : "password"}
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
                              type={showPassword ? "text" : "password"}
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
                            <span
                              onClick={togglePasswordVisibility}
                              className="eye-icon p-3"
                            >
                              {showPassword ? (
                                <i className="fas fa-eye-slash">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-eye-slash"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 1 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                  </svg>
                                </i>
                              ) : (
                                <i className="fas fa-eye">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-eye"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                  </svg>
                                </i>
                              )}
                            </span>
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
