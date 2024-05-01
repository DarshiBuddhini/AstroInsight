[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/V1F4A3D5)

#  React Frontend Application Using NASA APIs

This project utilizes the NASA API to provide users with information about various astronomical phenomena.

## Features

- Fetches data from the NASA API to display astronomy details.
- Backend built with Node.js.
- Frontend built with React and Chakra UI CSS framework.

## NASA APIs Used

### Astronomy Picture of the Day (APOD)

The Astronomy Picture of the Day (APOD) API provides a new astronomy-related image or photograph each day, along with a brief explanation written by a professional astronomer.

### Earth

The Earth API allows users to retrieve satellite imagery and other data related to Earth observation missions conducted by NASA.
### Mars Rover Photos

The Mars Rover Photos API provides access to photos taken by NASA's Mars rovers, including Curiosity, Opportunity, and Spirit. Users can browse photos by rover, sol (Martian day), and camera.

## Getting Started

To get started with this project, follow these steps:

### Backend Setup

1. Clone the repository:

    bash
    git clone

2. Navigate to the backend directory:

    bash
    cd backend
    

3. Install dependencies:

    bash
    npm install
    
4. Set up MongoDB:
   
    - Install MongoDB on your machine if you haven't already.
    - Start MongoDB server.

5. Configure MongoDB connection:
   
    - Create a .env file in the backend directory.
    - Add the MongoDB connection URI to the .env file. Example:
    
        
        MONGO="mongodb+srv://<username>:<password>@<cluster>/<database>"
        JWT_SECRET=<your_jwt_secret>
        
6. Run the development server:

    bash
    npm run dev
    

### Frontend Setup

1. Navigate to the frontend directory:

    bash
    cd frontend
    

2. Install dependencies:

    bash
    npm install
    

3. Start the development server:

    bash
    npm start
## Build Commands

### Backend

To build the backend for deployment:

bash
npm run build


### Frontend
To build the frontend for deployment:

bash
npm run build

