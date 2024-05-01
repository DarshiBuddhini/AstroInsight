import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import Success from "../components/Success";
import Error from "../components/Error";
import backgroundImage from "../components/assets/space.jpg";

const Registerscreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const registerState = useSelector((state) => state.registerUserReducer);
  const { error, loading, success } = registerState;

  const register = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          password,
          email,
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
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
            Register
          </h2>
          <br />
          {loading && <Loading />}
          {success && <Success success="You have Registered Successfully" />}
          {error && <Error error={error.message} />}{" "}
          {/* Updated to display error.message */}
          <div className="d-flex">
            <div style={{ width: "50%" }}>
              <input
                required
                type="text"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                required
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button onClick={register} className="btn mt-3 mb-3">
                REGISTER
              </button>{" "}
              <br />
              <h9 style={{ fontSize: "15px" }}>Already have an Account ?</h9>
              <br />
              <h9>
                <a
                  style={{ color: "black" }}
                  className="text-start"
                  href="/login"
                >
                  Click Here To Login
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

export default Registerscreen;
