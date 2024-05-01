import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // Import Axios for mocking
import Registerscreen from '../screens/Registerscreen'; // Import the component to test

jest.mock('axios'); // Mock axios for testing

describe('Registerscreen component', () => {
  it('should render Registerscreen component correctly', () => {
    render(<Registerscreen/>);

    const registerHeading = screen.getByRole('heading', { name: /register/i });
    expect(registerHeading).toBeInTheDocument();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    expect(usernameInput).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeInTheDocument();

    const registerButton = screen.getByRole('button', { name: /register/i });
    expect(registerButton).toBeInTheDocument();
  });

  it('should display success message on successful registration', async () => {
    const mockSuccessResponse = { success: true };
    axios.post.mockResolvedValueOnce({ data: mockSuccessResponse });

    render(<Registerscreen />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      const successMessage = screen.getByText(/You have Registered Successfully/i);
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('should display error message on failed registration', async () => {
    const mockErrorResponse = { error: { message: 'Test Error Message' } };
    axios.post.mockRejectedValueOnce(new Error('Test Error'));

    render(<Registerscreen />);

    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      const errorMessage = screen.getByText(/Test Error Message/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
