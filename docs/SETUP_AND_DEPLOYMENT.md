# AstroInsight Setup and Deployment Guide

## Overview

This guide provides comprehensive instructions for setting up, developing, and deploying the AstroInsight application. The project consists of a Node.js/Express backend and a React frontend, both designed for modern web deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **MongoDB**: Version 5.0 or higher
- **Git**: Latest version
- **Operating System**: Windows 10+, macOS 10.15+, or Linux

### Recommended Tools

- **Code Editor**: Visual Studio Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
  - MongoDB for VS Code
- **API Testing**: Postman or Thunder Client
- **Database GUI**: MongoDB Compass
- **Version Control**: Git with GitHub account

### Accounts Required

- **NASA API**: Register at [https://api.nasa.gov/](https://api.nasa.gov/) for API key
- **MongoDB Atlas**: For cloud database (optional, recommended for production)
- **Deployment Platform**: Netlify (frontend) and Render/Heroku (backend)

## Local Development Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd astroinsight

# Verify project structure
ls -la
# Should show: backend/, frontend/, README.md, .gitignore
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected Dependencies:**
```
├── bcrypt@5.1.1
├── body-parser@1.20.2
├── cookie-parser@1.4.6
├── cors@2.8.5
├── dotenv@16.4.5
├── express@4.19.2
├── jsonwebtoken@9.0.2
├── mongoose@8.3.2
└── nodemon@3.1.0
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

**Expected Dependencies:**
```
├── @emotion/react@11.11.4
├── @emotion/styled@11.11.5
├── @mui/material@5.15.15
├── axios@1.2.1
├── bootstrap@5.2.3
├── react@18.2.0
├── react-dom@18.2.0
├── react-redux@8.0.5
├── react-router-dom@6.5.0
├── redux@4.2.0
├── redux-thunk@2.4.2
└── [other dependencies...]
```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# Navigate to backend directory
cd backend

# Create environment file
touch .env
```

**Backend `.env` Configuration:**
```env
# Database Configuration
MONGO=mongodb://localhost:27017/astroinsight
# For MongoDB Atlas:
# MONGO=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_minimum_32_characters

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
# Navigate to frontend directory
cd frontend

# Create environment file
touch .env
```

**Frontend `.env` Configuration:**
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_NASA_API_KEY=your_nasa_api_key_here

# Development Configuration
REACT_APP_ENVIRONMENT=development
GENERATE_SOURCEMAP=true

# Optional: Analytics or other services
# REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Environment Variables Security

**Important Security Notes:**
- Never commit `.env` files to version control
- Use strong, unique JWT secrets (minimum 32 characters)
- Rotate API keys regularly
- Use different values for development and production

**Generate Secure JWT Secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

## Database Setup

### Option 1: Local MongoDB Installation

#### Windows
```bash
# Download MongoDB Community Server from mongodb.com
# Install and start MongoDB service
net start MongoDB

# Verify installation
mongo --version
```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify installation
mongo --version
```

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongo --version
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**: Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**:
   ```bash
   # Choose free tier (M0)
   # Select region closest to your users
   # Create cluster (takes 3-5 minutes)
   ```

3. **Configure Access**:
   ```bash
   # Database Access: Create user with read/write permissions
   # Network Access: Add your IP address (0.0.0.0/0 for development)
   ```

4. **Get Connection String**:
   ```bash
   # Click "Connect" -> "Connect your application"
   # Copy connection string
   # Replace <password> with your database user password
   ```

### Database Initialization

The application will automatically create necessary collections on first run. No manual database setup required.

**Verify Database Connection:**
```javascript
// Test connection (run in backend directory)
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO)
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err));
"
```

## Running the Application

### Development Mode

#### Method 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# React app starts on http://localhost:3000
```

#### Method 2: Concurrent Execution (Optional)

Create a `package.json` in the project root:

```json
{
  "name": "astroinsight-fullstack",
  "version": "1.0.0",
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd backend && npm run dev",
    "client": "cd frontend && npm start",
    "install-all": "npm install && cd backend && npm install && cd ../frontend && npm install"
  },
  "devDependencies": {
    "concurrently": "^7.6.0"
  }
}
```

```bash
# Install concurrently
npm install

# Run both backend and frontend
npm run dev
```

### Production Mode

#### Backend Production Build
```bash
cd backend

# Install production dependencies only
npm ci --only=production

# Start production server
NODE_ENV=production npm start
```

#### Frontend Production Build
```bash
cd frontend

# Create production build
npm run build

# Serve build locally (for testing)
npx serve -s build -l 3000
```

## Development Workflow

### Code Structure Best Practices

```
astroinsight/
├── backend/
│   ├── controllers/         # Business logic
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   ├── .env               # Environment variables
│   ├── server.js          # Entry point
│   └── package.json
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── actions/       # Redux actions
│   │   ├── components/    # Reusable components
│   │   ├── reducers/      # Redux reducers
│   │   ├── screens/       # Page components
│   │   ├── utils/         # Helper functions
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # Entry point
│   │   └── store.js       # Redux store
│   ├── .env               # Environment variables
│   └── package.json
├── docs/                  # Documentation
├── README.md
└── .gitignore
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Code Quality Tools

#### ESLint Configuration (Frontend)
```json
// frontend/.eslintrc.js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  }
};
```

#### Prettier Configuration
```json
// .prettierrc (project root)
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Development Scripts

Add these scripts to your `package.json` files:

**Backend package.json:**
```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "test": "jest",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

**Frontend package.json:**
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/"
  }
}
```

## Testing

### Backend Testing Setup

```bash
cd backend

# Install testing dependencies
npm install --save-dev jest supertest
```

**Create test configuration:**
```javascript
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ]
};
```

**Example test file:**
```javascript
// backend/__tests__/auth.test.js
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  test('POST /api/auth/register should create new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.message).toBe('User registered successfully');
  });
});
```

### Frontend Testing Setup

```bash
cd frontend

# Testing libraries are included with Create React App
# Additional testing utilities
npm install --save-dev @testing-library/user-event
```

**Example component test:**
```javascript
// frontend/src/components/__tests__/Loading.test.js
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

test('renders loading spinner', () => {
  render(<Loading />);
  const spinnerElement = screen.getByRole('status');
  expect(spinnerElement).toBeInTheDocument();
});
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Run tests with coverage
npm test -- --coverage
```

## Production Deployment

### Backend Deployment (Render/Heroku)

#### Render Deployment

1. **Prepare for Deployment:**
```bash
cd backend

# Create start script in package.json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

2. **Deploy to Render:**
   - Connect GitHub repository
   - Choose "Web Service"
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

3. **Environment Variables on Render:**
```env
MONGO=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain.netlify.app
```

#### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend Deployment (Netlify)

#### Netlify Deployment

1. **Prepare Build:**
```bash
cd frontend

# Update API URLs for production
# In .env.production
REACT_APP_API_BASE_URL=https://your-backend-domain.onrender.com
REACT_APP_NASA_API_KEY=your_nasa_api_key
```

2. **Deploy to Netlify:**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables

3. **Netlify Configuration:**
```toml
# netlify.toml (in frontend directory)
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Alternative: Manual Deployment

```bash
cd frontend

# Build for production
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### Domain Configuration

#### Custom Domain Setup

1. **Netlify Custom Domain:**
   - Go to Site Settings > Domain management
   - Add custom domain
   - Configure DNS records

2. **SSL Certificate:**
   - Automatically provided by Netlify
   - Enable HTTPS redirect

#### CORS Configuration

Update backend CORS settings for production:

```javascript
// backend/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',  // Development
    'https://your-domain.com', // Production
    'https://your-app.netlify.app' // Netlify
  ],
  credentials: true,
}));
```

### Database Production Setup

#### MongoDB Atlas Production Configuration

1. **Security Settings:**
   - Enable authentication
   - Configure IP whitelist
   - Use strong passwords
   - Enable audit logging

2. **Performance Optimization:**
   - Choose appropriate cluster tier
   - Configure read/write concerns
   - Set up monitoring alerts

3. **Backup Strategy:**
   - Enable automatic backups
   - Test restore procedures
   - Configure backup retention

### Monitoring and Logging

#### Application Monitoring

```javascript
// backend/middleware/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### Health Check Endpoint

```javascript
// backend/routes/health.js
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

module.exports = router;
```

## Troubleshooting

### Common Issues and Solutions

#### Backend Issues

**Issue: MongoDB Connection Failed**
```bash
# Solution 1: Check connection string
echo $MONGO  # Verify environment variable

# Solution 2: Check MongoDB service
# Local MongoDB
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Solution 3: Check network access (Atlas)
# Verify IP whitelist in MongoDB Atlas
```

**Issue: Port Already in Use**
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

**Issue: JWT Token Errors**
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token format in requests
# Should be: Authorization: Bearer <token>
```

#### Frontend Issues

**Issue: API Requests Failing**
```bash
# Check CORS configuration
# Verify API base URL
echo $REACT_APP_API_BASE_URL

# Check network tab in browser dev tools
```

**Issue: Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for conflicting dependencies
npm audit
npm audit fix
```

**Issue: Environment Variables Not Loading**
```bash
# Verify .env file location (must be in frontend root)
# Restart development server after .env changes
# Check variable names start with REACT_APP_
```

#### Database Issues

**Issue: Database Connection Timeout**
```bash
# Check MongoDB Atlas IP whitelist
# Verify connection string format
# Test connection with MongoDB Compass
```

**Issue: Authentication Errors**
```bash
# Verify username/password in connection string
# Check user permissions in MongoDB Atlas
# Ensure database name is correct
```

### Performance Optimization

#### Backend Optimization

```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Set security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

#### Frontend Optimization

```javascript
// Lazy loading components
const LazyComponent = React.lazy(() => import('./LazyComponent'));

// Code splitting by route
const Home = React.lazy(() => import('./screens/Homescreen'));
const About = React.lazy(() => import('./screens/Aboutscreen'));
```

### Security Checklist

#### Backend Security
- [ ] Environment variables properly configured
- [ ] JWT secrets are strong and unique
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (using Mongoose)
- [ ] XSS protection headers set

#### Frontend Security
- [ ] API keys not exposed in client code
- [ ] Sensitive data not stored in localStorage
- [ ] HTTPS enforced in production
- [ ] Content Security Policy configured
- [ ] Dependencies regularly updated

#### Database Security
- [ ] Authentication enabled
- [ ] Strong passwords used
- [ ] Network access restricted
- [ ] Regular backups configured
- [ ] Audit logging enabled

### Deployment Checklist

#### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] API endpoints tested
- [ ] Frontend build successful
- [ ] CORS configuration updated
- [ ] Security headers configured

#### Post-deployment
- [ ] Application accessible
- [ ] All features working
- [ ] Database operations successful
- [ ] Error logging working
- [ ] Performance monitoring active
- [ ] SSL certificate valid
- [ ] Domain configuration correct

### Support and Resources

#### Documentation
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://reactjs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

#### Community Support
- [Stack Overflow](https://stackoverflow.com/)
- [Reddit r/webdev](https://reddit.com/r/webdev)
- [Discord/Slack communities](https://discord.gg/webdev)

#### Professional Support
- Consider professional support for production deployments
- Regular security audits recommended
- Performance monitoring and optimization services available