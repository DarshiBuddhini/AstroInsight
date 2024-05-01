import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../actions/userActions";
import Logo from "./assets/logo.png";

export default function Navbar() {
  const userState = useSelector((state) => state.loginUserReducer);
  const { currentUser } = userState;
  const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-expand-lg shadow-lg p-3 mb-5 navbar-dark custom-bg-color fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src={Logo}
            alt=""
            width="150"
            height="45"
            className="d-inline-block align-text-top"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mt-1">
              <a className="nav-link " href="/">
                <h6>Home</h6>
              </a>
            </li>
            <li className="nav-item mt-1">
              <a className="nav-link " href="/">
                <h6>About Us</h6>
              </a>
            </li>
            <li className="nav-item mt-1">
              <a className="nav-link " href="/">
                <h6>News</h6>
              </a>
            </li>
            <li className="nav-item mt-1">
              <a className="nav-link " href="/">
                <h6>FAQ</h6>
              </a>
            </li>

            {currentUser ? (
              <div className="dropdown m-2">
                <a
                  style={{ color: "white" }}
                  className="dropdown-toggles"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <h6>Welcome {currentUser.email}</h6>{" "}
                </a>

                <ul
                  className="dropdown-menu text-center"
                  style={{ minWidth: "0rem" }}
                  aria-labelledby="dropdownMenuButton1"
                >
                  s
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        dispatch(logoutUser());
                      }}
                    >
                      <h6>Logout</h6>
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <li className="nav-item mt-1">
                <a className="nav-link" href="/login">
                  <h6>Login/Sign Up</h6>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
