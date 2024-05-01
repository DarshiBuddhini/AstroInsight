// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import axios from 'axios'; // Import Axios for mocking

// import Apodscreen from '../screens/Apodscreen';

// // Mock Axios for successful data fetching
// jest.mock('axios');

// test('renders loading message initially', () => {
//   render(<Apodscreen />);
//   const loadingElement = screen.getByText(/Loading.../i);
//   expect(loadingElement).toBeInTheDocument();
// });

// test('renders data after successful fetching', async () => {
//   const testData = {
//     title: 'Test Title',
//     url: 'https://example.com/test.jpg',
//     explanation: 'Test explanation',
//     hdurl: 'https://example.com/test_hd.jpg',
//   };

//   // Mock Axios response
//   axios.get.mockResolvedValue({ data: testData });

//   render(<Apodscreen />);
//   // Wait for data to be fetched and component to re-render
//   await screen.findByText(/Test Title/i);

//   // Check if data elements are rendered
//   expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
//   expect(screen.getByAltText(/Test Title/i)).toBeInTheDocument();
//   expect(screen.getByText(/Test explanation/i)).toBeInTheDocument();
// });

// test('handles error during data fetching', async () => {
//   // Mock Axios error response
//   axios.get.mockRejectedValue(new Error('Test Error'));

//   render(<Apodscreen />);
//   // Wait for error handling to be triggered and component to re-render
//   await screen.findByText(/Error: Test Error/i);

//   // Check if error message is rendered
//   expect(screen.getByText(/Error: Test Error/i)).toBeInTheDocument();
// });

// test('button click opens image', async () => {
//   const testData = {
//     title: 'Test Title',
//     url: 'https://example.com/test.jpg',
//     explanation: 'Test explanation',
//     hdurl: 'https://example.com/test_hd.jpg',
//   };

//   // Mock Axios response
//   axios.get.mockResolvedValue({ data: testData });

//   render(<Apodscreen />);
//   // Wait for data to be fetched and component to re-render
//   await screen.findByText(/Test Title/i);

//   // Simulate button click
//   fireEvent.click(screen.getByText(/View Image/i));
//   // Check if window.open is called with the correct URL
//   expect(window.open).toHaveBeenCalledWith('https://example.com/test_hd.jpg', '_blank', 'noopener,noreferrer');
// });
