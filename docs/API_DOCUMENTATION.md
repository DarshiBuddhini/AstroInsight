# AstroInsight API Documentation

## Overview

The AstroInsight backend API provides authentication services for the NASA space exploration application. Built with Node.js, Express, and MongoDB, it offers secure user registration and authentication functionality.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://astroinsight.onrender.com`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are returned upon successful login and should be included in subsequent requests.

## API Endpoints

### Authentication Routes

All authentication endpoints are prefixed with `/api/auth`

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "username": "string (required, unique)",
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
- **Success (201):**
```json
{
  "message": "User registered successfully"
}
```

- **Error (500):**
```json
{
  "message": "Internal Server Error"
}
```

**Example Usage:**
```javascript
const response = await axios.post('/api/auth/register', {
  username: 'johndoe',
  email: 'john@example.com',
  password: 'securepassword123'
});
```

#### POST /api/auth/login

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response:**
- **Success (200):**
```json
{
  "token": "jwt_token_string"
}
```

- **Error (404):**
```json
{
  "message": "User not found"
}
```

- **Error (401):**
```json
{
  "message": "Invalid credentials"
}
```

- **Error (500):**
```json
{
  "message": "Internal Server Error"
}
```

**Example Usage:**
```javascript
const response = await axios.post('/api/auth/login', {
  email: 'john@example.com',
  password: 'securepassword123'
});

// Token is also set as httpOnly cookie
const token = response.data.token;
```

#### GET /api/auth/users

Retrieve all users (Admin functionality).

**Response:**
- **Success (200):**
```json
[
  {
    "_id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "hashed_password"
  }
]
```

- **Error (500):**
```json
{
  "message": "Internal Server Error"
}
```

**Example Usage:**
```javascript
const response = await axios.get('/api/auth/users');
const users = response.data;
```

#### GET /api/auth/users/:id

Retrieve a specific user by ID.

**Parameters:**
- `id` (string): MongoDB ObjectId of the user

**Response:**
- **Success (200):**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "hashed_password"
}
```

- **Error (404):**
```json
{
  "message": "User not found"
}
```

- **Error (500):**
```json
{
  "message": "Internal Server Error"
}
```

**Example Usage:**
```javascript
const userId = "64a1b2c3d4e5f6789abcdef0";
const response = await axios.get(`/api/auth/users/${userId}`);
const user = response.data;
```

## Data Models

### User Model

```javascript
{
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}
```

## Middleware

### Authentication Middleware

The `authenticateToken` middleware validates JWT tokens from cookies.

**Usage:**
```javascript
const { authenticateToken } = require('./middleware/authMiddleware');

// Protect routes
app.get('/protected-route', authenticateToken, (req, res) => {
  // Access user data via req.user
  res.json({ user: req.user });
});
```

**Token Validation:**
- Expects token in `req.cookies.token`
- Returns 401 if no token provided
- Returns 403 if token is invalid
- Adds decoded user data to `req.user`

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds of 10
2. **JWT Authentication**: Secure token-based authentication
3. **HTTP-Only Cookies**: Tokens stored securely in cookies
4. **CORS Configuration**: Configured for production domain
5. **Environment Variables**: Sensitive data stored in .env

## Environment Variables

Required environment variables:

```env
MONGO=mongodb://connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Testing

Example test cases for API endpoints:

```javascript
// Test user registration
describe('POST /api/auth/register', () => {
  it('should register a new user', async () => {
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