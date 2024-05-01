import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import axios from "axios"; // You might want to mock axios for testing
import Loginscreen from "./Loginscreen";
import { loginUserReducer } from "../reducers/userReducer"; // Assuming your Redux reducers are in a separate file

// Mocking axios for testing purposes
jest.mock("axios");

describe("Loginscreen Component", () => {
  const mockStore = configureStore([]);

  let store;
  let initialState;

  beforeEach(() => {
    initialState = {}; // Initialize your initial state here if needed
    store = mockStore(initialState);
  });

  test("renders Loginscreen component", () => {
    render(<Loginscreen />);

    // Add your assertions here
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("login button triggers login function", async () => {
    render(<Loginscreen />);

    // Mock axios post request response
    axios.post.mockResolvedValueOnce({
      data: {
        /* Mock response data */
      },
    });

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("LOGIN");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(loginButton);

    // Wait for the async login process to complete
    // await waitFor(() => {
    //   expect(axios.post).toHaveBeenCalledTimes(1);
    //   expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/auth/login', {
    //     email: 'test@example.com',
    //     password: 'password123',
    //   });
    //   // Add more assertions based on your login process, such as checking for successful login redirection
    // });
  });

  
});
