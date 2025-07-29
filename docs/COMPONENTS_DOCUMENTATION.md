# AstroInsight Frontend Components Documentation

## Overview

This document provides comprehensive documentation for all React components in the AstroInsight application. The frontend is built with React, Redux, Bootstrap, and Material-UI, providing a modern interface for exploring NASA's space data.

## Table of Contents

1. [Core Components](#core-components)
2. [Screen Components](#screen-components)
3. [Utility Components](#utility-components)
4. [Usage Examples](#usage-examples)

## Core Components

### Navbar Component

**Location**: `src/components/Navbar.js`

The main navigation component that provides site navigation and user authentication status.

**Props**: None (uses Redux state)

**Redux State Dependencies**:
- `loginUserReducer.currentUser`: Current authenticated user

**Features**:
- Responsive navigation with Bootstrap
- Conditional rendering based on authentication status
- User dropdown with logout functionality
- Logo integration

**Usage**:
```jsx
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      {/* Other content */}
    </div>
  );
}
```

**Styling**:
- Uses Bootstrap navbar classes
- Custom background color via `custom-bg-color` class
- Fixed positioning at top of page
- Shadow effects for depth

### Loading Component

**Location**: `src/components/Loading.js`

A reusable loading spinner component for indicating data fetching states.

**Props**:
- None

**Features**:
- Bootstrap spinner implementation
- Centered layout
- Large, visible spinner (100px x 100px)
- Screen reader accessibility

**Usage**:
```jsx
import Loading from './components/Loading';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <Loading />;
  }
  
  return <div>Content loaded!</div>;
}
```

**Accessibility**:
- Includes `role="status"` for screen readers
- Hidden text for assistive technologies

### Error Component

**Location**: `src/components/Error.js`

A reusable error display component for showing error messages to users.

**Props**:
```typescript
interface ErrorProps {
  error: string; // Error message to display
}
```

**Features**:
- Bootstrap alert styling
- Danger/error theme (red background)
- Responsive design

**Usage**:
```jsx
import Error from './components/Error';

function MyComponent() {
  const [error, setError] = useState(null);
  
  return (
    <div>
      {error && <Error error={error} />}
      {/* Other content */}
    </div>
  );
}
```

**Styling**:
- Uses Bootstrap `alert alert-danger` classes
- Inherits responsive behavior from Bootstrap

### Success Component

**Location**: `src/components/Success.js`

A reusable success message component for displaying positive feedback.

**Props**:
```typescript
interface SuccessProps {
  success: string; // Success message to display
}
```

**Usage**:
```jsx
import Success from './components/Success';

function MyComponent() {
  const [successMessage, setSuccessMessage] = useState('');
  
  return (
    <div>
      {successMessage && <Success success={successMessage} />}
      {/* Other content */}
    </div>
  );
}
```

### Footer Component

**Location**: `src/components/Footer.js`

The application footer component providing site information and links.

**Props**: None

**Features**:
- Site-wide footer
- Responsive design
- Consistent styling with overall theme

**Usage**:
```jsx
import Footer from './components/Footer';

function App() {
  return (
    <div>
      {/* Main content */}
      <Footer />
    </div>
  );
}
```

## Screen Components

### Homescreen Component

**Location**: `src/screens/Homescreen.js`

The main landing page component showcasing NASA API features.

**Props**: None

**Features**:
- Hero section with space background
- Feature cards for each NASA API
- Material-UI Grid layout
- Responsive design
- Navigation to different API sections

**Sections**:
1. **Astronomy Picture of the Day (APOD)**
2. **Mars Rover Photos**
3. **Asteroids - NeoWs**
4. **NASA Earth API**

**Usage**:
```jsx
import Homescreen from './screens/Homescreen';

// Used in App.js routing
<Route path="/" exact element={<Homescreen />} />
```

**Styling**:
- Background image overlay
- Material-UI Typography components
- Bootstrap card components
- Custom button styling with Font Awesome icons

### Loginscreen Component

**Location**: `src/screens/Loginscreen.js`

User authentication screen for logging into the application.

**Props**: None

**Redux Integration**:
- Dispatches login actions
- Reads login state from `loginUserReducer`

**Features**:
- Form validation
- Error handling
- Loading states
- Background image
- Redux state management

**Form Fields**:
- Email (required)
- Password (required)

**Usage**:
```jsx
import Loginscreen from './screens/Loginscreen';

// Used in App.js routing
<Route path="/login" exact element={<Loginscreen />} />
```

**State Management**:
```jsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const loginState = useSelector((state) => state.loginUserReducer);
const { loading, error } = loginState;
```

### Registerscreen Component

**Location**: `src/screens/Registerscreen.js`

User registration screen for creating new accounts.

**Props**: None

**Features**:
- User registration form
- Form validation
- Error handling
- Success feedback
- Background styling

**Expected Form Fields**:
- Username
- Email
- Password
- Password confirmation

### Apodscreen Component

**Location**: `src/screens/Apodscreen.js`

Displays NASA's Astronomy Picture of the Day with detailed information.

**Props**: None

**Features**:
- High-resolution image display
- Detailed description
- Metadata display (title, date, copyright)
- External link to full-size image

**API Integration**:
- Fetches data from NASA APOD API
- Displays image or video content
- Shows explanatory text

**Usage**:
```jsx
// Used in App.js routing
<Route path="/apod" exact element={<Apodscreen />} />
```

### MarsRoverscreen Component

**Location**: `src/screens/MarsRoverscreen.js`

Displays photos taken by NASA's Mars rovers with detailed metadata.

**Props**: None

**Features**:
- Grid layout of rover images
- Image modal/lightbox functionality
- Rover metadata (sol, earth date, camera info)
- Pagination/load more functionality

**Data Structure**:
```javascript
{
  id: "photo_id",
  sol: "martian_day",
  earth_date: "YYYY-MM-DD",
  camera: {
    full_name: "Camera Name"
  },
  rover: {
    name: "Rover Name",
    landing_date: "YYYY-MM-DD",
    launch_date: "YYYY-MM-DD",
    status: "active/complete",
    max_sol: "number",
    max_date: "YYYY-MM-DD"
  }
}
```

### Earthscreen Component

**Location**: `src/screens/Earthscreen.js`

Displays Earth imagery and data from NASA's Earth API.

**Props**: None

**Features**:
- Satellite imagery display
- Earth observation data
- Interactive elements
- Educational content

### Asteroidscreen Component

**Location**: `src/screens/Asteroidscreen.js`

Shows Near Earth Object (NEO) data from NASA's NeoWs API.

**Props**: None

**Features**:
- Asteroid tracking information
- Proximity data
- Size and trajectory information
- Safety classifications

### Errorscreen Component

**Location**: `src/screens/Errorscreen.js`

A dedicated error page for handling application-wide errors.

**Props**: None

**Features**:
- User-friendly error messaging
- Navigation back to home
- Error reporting capabilities

## Utility Components

### App Component

**Location**: `src/App.js`

The main application component that sets up routing and layout.

**Props**: None

**Features**:
- React Router setup
- Redux state management
- Global layout structure
- Route protection

**Routes**:
```jsx
<Routes>
  <Route path="/" exact element={<Homescreen />} />
  <Route path="/login" exact element={<Loginscreen />} />
  <Route path="/register" exact element={<Registerscreen />} />
  <Route path="/mars" exact element={<MarsRoverscreen />} />
  <Route path="/apod" exact element={<Apodscreen />} />
  <Route path="/epic" exact element={<Asteroidscreen />} />
  <Route path="/earth" exact element={<Earthscreen />} />
</Routes>
```

## Usage Examples

### Basic Component Usage

```jsx
import React, { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Success from '../components/Success';

function ExampleComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setSuccess('Data loaded successfully!');
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {error && <Error error={error} />}
      {success && <Success success={success} />}
      {data && (
        <div>
          {/* Render your data */}
        </div>
      )}
    </div>
  );
}
```

### Redux Integration Pattern

```jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { someAction } from '../actions/someActions';
import Loading from '../components/Loading';
import Error from '../components/Error';

function ReduxComponent() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.someReducer);
  const { loading, error, data } = state;

  const handleAction = () => {
    dispatch(someAction());
  };

  return (
    <div>
      {loading && <Loading />}
      {error && <Error error={error} />}
      <button onClick={handleAction}>
        Perform Action
      </button>
      {/* Render data */}
    </div>
  );
}
```

### Form Component Pattern

```jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Error from '../components/Error';
import Loading from '../components/Loading';

function FormComponent() {
  const [formData, setFormData] = useState({
    field1: '',
    field2: ''
  });
  
  const dispatch = useDispatch();
  const state = useSelector((state) => state.formReducer);
  const { loading, error } = state;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitFormAction(formData));
  };

  return (
    <div>
      {error && <Error error={error} />}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="field1"
          value={formData.field1}
          onChange={handleInputChange}
          className="form-control"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? <Loading /> : 'Submit'}
        </button>
      </form>
    </div>
  );
}
```

## Best Practices

### Component Organization

1. **Separation of Concerns**: Keep components focused on a single responsibility
2. **Reusability**: Create generic components that can be reused across the application
3. **Props Validation**: Use PropTypes or TypeScript for prop validation
4. **State Management**: Use Redux for global state, local state for component-specific data

### Styling Guidelines

1. **Bootstrap First**: Leverage Bootstrap classes for consistent styling
2. **Custom CSS**: Use CSS modules or styled-components for custom styles
3. **Responsive Design**: Ensure all components work on mobile and desktop
4. **Accessibility**: Include proper ARIA labels and semantic HTML

### Performance Optimization

1. **Lazy Loading**: Use React.lazy() for route-based code splitting
2. **Memoization**: Use React.memo() for expensive re-renders
3. **useCallback/useMemo**: Optimize expensive calculations and function references

### Error Handling

1. **Error Boundaries**: Implement error boundaries for graceful error handling
2. **User Feedback**: Always provide clear error messages to users
3. **Fallback UI**: Provide fallback content when components fail to load

### Testing

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **Accessibility Tests**: Ensure components meet accessibility standards

```jsx
// Example test
import { render, screen } from '@testing-library/react';
import Error from '../components/Error';

test('renders error message', () => {
  const errorMessage = 'Something went wrong';
  render(<Error error={errorMessage} />);
  
  const errorElement = screen.getByText(errorMessage);
  expect(errorElement).toBeInTheDocument();
});
```