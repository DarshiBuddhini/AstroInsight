import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Error from "../components/Error";
import Loading from "../components/Loading";
import backgroundImage from "../components/assets/space.jpg";

const Loginscreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginState = useSelector((state) => state.loginUserReducer);
  const { loading, error } = loginState;
  const dispatch = useDispatch();

  const loginUser = async (user) => {
    dispatch({ type: 'USER_LOGIN_REQUEST' });

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', user);
      dispatch({ type: 'USER_LOGIN_SUCCESS', payload: response.data });
      localStorage.setItem('currentUser', JSON.stringify(response.data));
      window.location.href = '/';
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        dispatch({ type: 'USER_LOGIN_FAILED', payload: error.response.data.message });
      } else {
        dispatch({ type: 'USER_LOGIN_FAILED', payload: 'An error occurred during login' });
      }
    }
  };

  const handleLogin = () => {
    const user = { email, password };
    loginUser(user);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        minHeight: "100vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="row justify-content-center">
        <div className="col-md-5 mt-5 text-start shadow p-4 mb-7 bg-white rounded">
          <h2 className="text-center m-4" style={{ fontSize: "35px" }}>
            Login
          </h2>
          <br />

          {loading && <Loading />}
          {error && <Error error="Invalid Credentials" />}

          <div className="d-flex">
            <div style={{ width: "50%" }}>
              <input
                required
                type="email"
                placeholder="Email"
                className="form-control mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                required
                type="password"
                placeholder="Password"
                className="form-control mb-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button onClick={handleLogin} className="btn mt-3 mb-3 ">
                LOGIN
              </button>
              <br />
              <h9 className="text-center m-4" style={{ fontSize: "15px" }}>
                Don't have an account?
              </h9>
              <br />
              <h9 className="text-center m-4">
                <a
                  style={{ color: "black" }}
                  className="text-start"
                  href="/register"
                >
                  Click Here To Register
                </a>
              </h9>
              <br />
              <br />
            </div>
            <div className="justify-content-end" style={{ width: "45%" }}>
              <img
                src="https://cdn.pixabay.com/photo/2024/04/09/17/28/ai-generated-8686459_1280.png"
                alt="Login"
                className="img-fluid mb-3"
                style={{ width: "100%", height: "auto",  marginLeft:"10%"}}
              />
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};

export default Loginscreen;
