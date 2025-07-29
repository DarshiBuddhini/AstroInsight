# AstroInsight Usage Examples and Best Practices

## Overview

This document provides comprehensive usage examples and best practices for developers working with the AstroInsight codebase. It covers common patterns, code examples, and recommended approaches for maintaining and extending the application.

## Table of Contents

1. [Component Development Patterns](#component-development-patterns)
2. [State Management Best Practices](#state-management-best-practices)
3. [API Integration Patterns](#api-integration-patterns)
4. [Error Handling Strategies](#error-handling-strategies)
5. [Performance Optimization](#performance-optimization)
6. [Testing Strategies](#testing-strategies)
7. [Code Organization](#code-organization)
8. [Security Best Practices](#security-best-practices)

## Component Development Patterns

### 1. Functional Component with Hooks Pattern

```jsx
// ✅ Good: Modern functional component with hooks
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '../components/Loading';
import Error from '../components/Error';

const DataComponent = ({ initialData, onDataChange }) => {
  // State management
  const [localData, setLocalData] = useState(initialData || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Redux integration
  const dispatch = useDispatch();
  const globalState = useSelector(state => state.dataReducer);
  
  // Memoized callbacks to prevent unnecessary re-renders
  const handleDataUpdate = useCallback((newData) => {
    setLocalData(newData);
    onDataChange?.(newData);
  }, [onDataChange]);
  
  // Effect for data fetching
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        if (isMounted) {
          handleDataUpdate(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [handleDataUpdate]);
  
  // Conditional rendering
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  
  return (
    <div className="data-component">
      {localData.map(item => (
        <div key={item.id} className="data-item">
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default DataComponent;
```

### 2. Custom Hook Pattern

```jsx
// ✅ Good: Reusable custom hook for NASA API calls
import { useState, useEffect, useCallback } from 'react';

const useNASAData = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const {
    autoFetch = true,
    dependencies = [],
    onSuccess,
    onError
  } = options;
  
  const fetchData = useCallback(async (customEndpoint = endpoint) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(customEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      onSuccess?.(result);
      
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError]);
  
  useEffect(() => {
    if (autoFetch && endpoint) {
      fetchData();
    }
  }, [autoFetch, endpoint, fetchData, ...dependencies]);
  
  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setData,
    setError
  };
};

// Usage example
const APODComponent = () => {
  const { data, loading, error, refetch } = useNASAData(
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
    {
      onSuccess: (data) => console.log('APOD loaded:', data.title),
      onError: (error) => console.error('APOD failed:', error)
    }
  );
  
  return (
    <div>
      {loading && <Loading />}
      {error && <Error error={error} />}
      {data && (
        <div>
          <h2>{data.title}</h2>
          <img src={data.url} alt={data.title} />
          <button onClick={() => refetch()}>Refresh</button>
        </div>
      )}
    </div>
  );
};
```

### 3. Compound Component Pattern

```jsx
// ✅ Good: Compound component for flexible card layouts
const Card = ({ children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);

Card.Image = ({ src, alt, className = '' }) => (
  <img 
    src={src} 
    alt={alt} 
    className={`card-img-top ${className}`}
    loading="lazy"
  />
);

// Usage
const APODCard = ({ apodData }) => (
  <Card className="apod-card">
    <Card.Image src={apodData.url} alt={apodData.title} />
    <Card.Header>
      <h5>{apodData.title}</h5>
    </Card.Header>
    <Card.Body>
      <p>{apodData.explanation}</p>
    </Card.Body>
    <Card.Footer>
      <small className="text-muted">{apodData.date}</small>
    </Card.Footer>
  </Card>
);
```

### 4. Higher-Order Component (HOC) Pattern

```jsx
// ✅ Good: HOC for authentication checking
const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const { currentUser } = useSelector(state => state.loginUserReducer);
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!currentUser) {
        navigate('/login');
      }
    }, [currentUser, navigate]);
    
    if (!currentUser) {
      return <Loading />;
    }
    
    return <WrappedComponent {...props} />;
  };
  
  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return AuthenticatedComponent;
};

// Usage
const ProtectedScreen = withAuth(({ userData }) => (
  <div>
    <h1>Protected Content</h1>
    <p>Welcome, {userData.username}!</p>
  </div>
));
```

## State Management Best Practices

### 1. Redux Action Creators with Thunk

```javascript
// ✅ Good: Comprehensive async action creator
export const fetchMarsPhotos = (rover, sol, camera = null) => async (dispatch, getState) => {
  // Start loading state
  dispatch({ type: 'FETCH_MARS_PHOTOS_REQUEST' });
  
  try {
    // Build URL with parameters
    const baseUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`;
    const params = new URLSearchParams({
      sol: sol.toString(),
      api_key: NASA_API_KEY
    });
    
    if (camera) {
      params.append('camera', camera);
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    
    // Make API call
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate response
    if (!data.photos || !Array.isArray(data.photos)) {
      throw new Error('Invalid response format');
    }
    
    // Success action
    dispatch({
      type: 'FETCH_MARS_PHOTOS_SUCCESS',
      payload: {
        photos: data.photos,
        rover,
        sol,
        camera,
        timestamp: Date.now()
      }
    });
    
    // Optional: Cache in localStorage
    localStorage.setItem(
      `mars_photos_${rover}_${sol}_${camera || 'all'}`,
      JSON.stringify({
        data: data.photos,
        timestamp: Date.now()
      })
    );
    
  } catch (error) {
    // Error action
    dispatch({
      type: 'FETCH_MARS_PHOTOS_FAILURE',
      payload: {
        error: error.message,
        rover,
        sol,
        camera
      }
    });
    
    // Optional: Log error
    console.error('Mars photos fetch error:', error);
  }
};

// Action creator for clearing data
export const clearMarsPhotos = () => ({
  type: 'CLEAR_MARS_PHOTOS'
});

// Action creator for setting filters
export const setMarsPhotosFilters = (filters) => ({
  type: 'SET_MARS_PHOTOS_FILTERS',
  payload: filters
});
```

### 2. Reducer Best Practices

```javascript
// ✅ Good: Comprehensive reducer with proper state management
const initialState = {
  photos: [],
  loading: false,
  error: null,
  filters: {
    rover: 'curiosity',
    sol: 1000,
    camera: null
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0
  },
  cache: {},
  lastFetch: null
};

const marsPhotosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_MARS_PHOTOS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case 'FETCH_MARS_PHOTOS_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        photos: action.payload.photos,
        lastFetch: action.payload.timestamp,
        pagination: {
          ...state.pagination,
          totalItems: action.payload.photos.length
        },
        cache: {
          ...state.cache,
          [`${action.payload.rover}_${action.payload.sol}_${action.payload.camera || 'all'}`]: {
            data: action.payload.photos,
            timestamp: action.payload.timestamp
          }
        }
      };
      
    case 'FETCH_MARS_PHOTOS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        photos: []
      };
      
    case 'SET_MARS_PHOTOS_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        },
        pagination: {
          ...state.pagination,
          currentPage: 1 // Reset to first page when filters change
        }
      };
      
    case 'CLEAR_MARS_PHOTOS':
      return {
        ...state,
        photos: [],
        error: null
      };
      
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      };
      
    default:
      return state;
  }
};

export default marsPhotosReducer;
```

### 3. Selector Functions

```javascript
// ✅ Good: Memoized selectors for computed values
import { createSelector } from 'reselect';

// Basic selectors
const selectMarsPhotosState = state => state.marsPhotos;
const selectPhotos = state => state.marsPhotos.photos;
const selectFilters = state => state.marsPhotos.filters;
const selectPagination = state => state.marsPhotos.pagination;

// Memoized selectors
export const selectFilteredPhotos = createSelector(
  [selectPhotos, selectFilters],
  (photos, filters) => {
    let filtered = [...photos];
    
    if (filters.camera) {
      filtered = filtered.filter(photo => 
        photo.camera.name === filters.camera
      );
    }
    
    return filtered;
  }
);

export const selectPaginatedPhotos = createSelector(
  [selectFilteredPhotos, selectPagination],
  (photos, pagination) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return photos.slice(startIndex, endIndex);
  }
);

export const selectPhotosByCamera = createSelector(
  [selectPhotos],
  (photos) => {
    return photos.reduce((acc, photo) => {
      const cameraName = photo.camera.name;
      if (!acc[cameraName]) {
        acc[cameraName] = [];
      }
      acc[cameraName].push(photo);
      return acc;
    }, {});
  }
);

export const selectLoadingState = createSelector(
  [selectMarsPhotosState],
  (marsPhotosState) => ({
    loading: marsPhotosState.loading,
    error: marsPhotosState.error,
    hasData: marsPhotosState.photos.length > 0
  })
);
```

## API Integration Patterns

### 1. API Service Layer

```javascript
// ✅ Good: Centralized API service with error handling
class NASAAPIService {
  constructor() {
    this.baseURL = 'https://api.nasa.gov';
    this.apiKey = process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }
  
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          endpoint
        );
      }
      
      const data = await response.json();
      
      // Cache successful responses
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
      
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      
      // Network or other errors
      throw new APIError(
        `Network error: ${error.message}`,
        0,
        endpoint
      );
    }
  }
  
  // APOD API
  async getAPOD(date = null) {
    const params = new URLSearchParams({
      api_key: this.apiKey
    });
    
    if (date) {
      params.append('date', date);
    }
    
    return this.request(`/planetary/apod?${params.toString()}`);
  }
  
  // Mars Rover Photos API
  async getMarsPhotos(rover, sol, camera = null) {
    const params = new URLSearchParams({
      sol: sol.toString(),
      api_key: this.apiKey
    });
    
    if (camera) {
      params.append('camera', camera);
    }
    
    return this.request(`/mars-photos/api/v1/rovers/${rover}/photos?${params.toString()}`);
  }
  
  // Near Earth Objects API
  async getNearEarthObjects(startDate, endDate) {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      api_key: this.apiKey
    });
    
    return this.request(`/neo/rest/v1/feed?${params.toString()}`);
  }
  
  // Earth Imagery API
  async getEarthImagery(lat, lon, date) {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      date,
      api_key: this.apiKey
    });
    
    return this.request(`/planetary/earth/imagery?${params.toString()}`);
  }
  
  // Clear cache
  clearCache() {
    this.cache.clear();
  }
  
  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Custom error class
class APIError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.endpoint = endpoint;
  }
}

// Singleton instance
export const nasaAPI = new NASAAPIService();
export { APIError };
```

### 2. API Hook with Error Handling

```javascript
// ✅ Good: Comprehensive API hook with retry logic
import { useState, useEffect, useCallback } from 'react';
import { nasaAPI, APIError } from '../services/nasaAPI';

const useAPIWithRetry = (apiCall, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const {
    maxRetries = 3,
    retryDelay = 1000,
    autoFetch = true,
    onSuccess,
    onError
  } = options;
  
  const executeAPICall = useCallback(async (attempt = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      setRetryCount(0);
      onSuccess?.(result);
      
    } catch (err) {
      console.error(`API call failed (attempt ${attempt + 1}):`, err);
      
      if (attempt < maxRetries && shouldRetry(err)) {
        setRetryCount(attempt + 1);
        
        // Exponential backoff
        const delay = retryDelay * Math.pow(2, attempt);
        setTimeout(() => {
          executeAPICall(attempt + 1);
        }, delay);
        
        return;
      }
      
      // Max retries reached or non-retryable error
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setRetryCount(0);
      onError?.(err);
    } finally {
      if (attempt === 0 || !shouldRetry(error)) {
        setLoading(false);
      }
    }
  }, [apiCall, maxRetries, retryDelay, onSuccess, onError]);
  
  const shouldRetry = (error) => {
    if (error instanceof APIError) {
      // Don't retry on client errors (4xx)
      return error.status >= 500 || error.status === 0;
    }
    return true; // Retry on network errors
  };
  
  const getErrorMessage = (error) => {
    if (error instanceof APIError) {
      switch (error.status) {
        case 400:
          return 'Invalid request parameters';
        case 403:
          return 'API access denied. Please check your API key';
        case 429:
          return 'Too many requests. Please try again later';
        case 500:
          return 'NASA API server error. Please try again';
        default:
          return error.message;
      }
    }
    return 'Network error. Please check your connection';
  };
  
  const refetch = useCallback(() => {
    executeAPICall();
  }, [executeAPICall]);
  
  useEffect(() => {
    if (autoFetch) {
      executeAPICall();
    }
  }, [autoFetch, executeAPICall, ...dependencies]);
  
  return {
    data,
    loading,
    error,
    retryCount,
    refetch
  };
};

// Usage example
const APODScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  
  const { data, loading, error, retryCount, refetch } = useAPIWithRetry(
    () => nasaAPI.getAPOD(selectedDate),
    [selectedDate],
    {
      maxRetries: 3,
      onSuccess: (data) => {
        console.log('APOD loaded:', data.title);
      },
      onError: (error) => {
        console.error('APOD failed:', error);
      }
    }
  );
  
  return (
    <div>
      {loading && (
        <div>
          Loading... {retryCount > 0 && `(Retry ${retryCount}/3)`}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={refetch} className="btn btn-sm btn-outline-danger ms-2">
            Retry
          </button>
        </div>
      )}
      
      {data && (
        <div>
          <h1>{data.title}</h1>
          <img src={data.url} alt={data.title} />
          <p>{data.explanation}</p>
        </div>
      )}
    </div>
  );
};
```

## Error Handling Strategies

### 1. Error Boundary Component

```jsx
// ✅ Good: Comprehensive error boundary
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to service
    this.logErrorToService(error, errorInfo);
  }
  
  logErrorToService = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    // Send to logging service (e.g., Sentry, LogRocket)
    console.error('Error logged:', errorData);
    
    // In production, send to actual logging service
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/log-error', { method: 'POST', body: JSON.stringify(errorData) });
    }
  };
  
  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };
  
  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback) {
        return (
          <Fallback 
            error={this.state.error}
            onRetry={this.handleRetry}
          />
        );
      }
      
      return (
        <div className="error-boundary">
          <div className="alert alert-danger">
            <h4>Something went wrong</h4>
            <p>We're sorry, but something unexpected happened.</p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-3">
                <summary>Error Details (Development Only)</summary>
                <pre className="mt-2">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div className="mt-3">
              <button 
                className="btn btn-primary me-2"
                onClick={this.handleRetry}
              >
                Try Again
              </button>
              
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Custom fallback component
const ErrorFallback = ({ error, onRetry }) => (
  <div className="error-fallback">
    <h2>Oops! Something went wrong</h2>
    <p>Don't worry, this happens sometimes. Try refreshing the page.</p>
    
    <div className="error-actions">
      <button onClick={onRetry} className="btn btn-primary">
        Try Again
      </button>
      <button 
        onClick={() => window.location.href = '/'}
        className="btn btn-outline-secondary ms-2"
      >
        Go Home
      </button>
    </div>
    
    {process.env.NODE_ENV === 'development' && (
      <details className="error-details mt-3">
        <summary>Error Details</summary>
        <pre>{error.message}</pre>
      </details>
    )}
  </div>
);

// Usage
const App = () => (
  <ErrorBoundary fallback={ErrorFallback}>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/apod" element={<APODScreen />} />
        {/* Other routes */}
      </Routes>
      <Footer />
    </Router>
  </ErrorBoundary>
);
```

### 2. Form Validation Patterns

```jsx
// ✅ Good: Comprehensive form validation
import React, { useState, useCallback } from 'react';

const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return null;
    
    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    
    return null;
  }, [validationRules, values]);
  
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(validationRules).forEach(fieldName => {
      const error = validate(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  }, [validate, validationRules, values]);
  
  const handleChange = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    // Validate field if it's been touched
    if (touched[fieldName]) {
      const error = validate(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [validate, touched]);
  
  const handleBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    const error = validate(fieldName, values[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [validate, values]);
  
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    if (validateAll()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [validateAll, values, validationRules]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Validation rules
const validationRules = {
  email: [
    (value) => !value ? 'Email is required' : null,
    (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : null
  ],
  password: [
    (value) => !value ? 'Password is required' : null,
    (value) => value.length < 8 ? 'Password must be at least 8 characters' : null,
    (value) => !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value) ? 
      'Password must contain uppercase, lowercase, and number' : null
  ],
  confirmPassword: [
    (value) => !value ? 'Please confirm your password' : null,
    (value, allValues) => value !== allValues.password ? 'Passwords do not match' : null
  ]
};

// Usage in component
const RegistrationForm = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset
  } = useFormValidation(
    { email: '', password: '', confirmPassword: '' },
    validationRules
  );
  
  const onSubmit = async (formData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      // Success
      alert('Registration successful!');
      reset();
      
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(onSubmit);
    }}>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
        />
        {errors.email && touched.email && (
          <div className="invalid-feedback">{errors.email}</div>
        )}
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
        />
        {errors.password && touched.password && (
          <div className="invalid-feedback">{errors.password}</div>
        )}
      </div>
      
      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
          value={values.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <div className="invalid-feedback">{errors.confirmPassword}</div>
        )}
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
```

## Performance Optimization

### 1. Component Memoization

```jsx
// ✅ Good: Optimized component with memoization
import React, { memo, useMemo, useCallback } from 'react';

const PhotoCard = memo(({ photo, onImageClick, onFavorite, isFavorite }) => {
  // Memoize expensive calculations
  const formattedDate = useMemo(() => {
    return new Date(photo.earth_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [photo.earth_date]);
  
  const cameraInfo = useMemo(() => ({
    name: photo.camera.full_name,
    abbreviation: photo.camera.name
  }), [photo.camera]);
  
  // Memoize event handlers
  const handleImageClick = useCallback(() => {
    onImageClick(photo.img_src, photo);
  }, [onImageClick, photo.img_src, photo]);
  
  const handleFavoriteClick = useCallback(() => {
    onFavorite(photo.id);
  }, [onFavorite, photo.id]);
  
  return (
    <div className="photo-card">
      <div className="photo-container">
        <img
          src={photo.img_src}
          alt={`Mars photo from ${cameraInfo.name}`}
          onClick={handleImageClick}
          loading="lazy"
          className="photo-image"
        />
        
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          ❤️
        </button>
      </div>
      
      <div className="photo-info">
        <h6>{cameraInfo.name}</h6>
        <p className="text-muted">
          Sol: {photo.sol} | {formattedDate}
        </p>
      </div>
    </div>
  );
});

PhotoCard.displayName = 'PhotoCard';

// Custom comparison function for complex props
const PhotoGrid = memo(({ photos, favorites, onImageClick, onFavorite }) => {
  return (
    <div className="photo-grid">
      {photos.map(photo => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavorite={favorites.includes(photo.id)}
          onImageClick={onImageClick}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for performance
  return (
    prevProps.photos.length === nextProps.photos.length &&
    prevProps.photos.every((photo, index) => 
      photo.id === nextProps.photos[index].id
    ) &&
    prevProps.favorites.length === nextProps.favorites.length &&
    prevProps.favorites.every(id => nextProps.favorites.includes(id))
  );
});
```

### 2. Virtual Scrolling for Large Lists

```jsx
// ✅ Good: Virtual scrolling implementation
import React, { useState, useEffect, useMemo, useCallback } from 'react';

const VirtualizedList = ({ 
  items, 
  itemHeight, 
  containerHeight, 
  renderItem,
  overscan = 5 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);
  
  const visibleItems = useMemo(() => {
    const { startIndex, endIndex } = visibleRange;
    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }));
  }, [items, visibleRange]);
  
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  return (
    <div
      className="virtualized-list"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={item.id || index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Usage
const PhotoList = ({ photos }) => {
  const renderPhoto = useCallback((photo, index) => (
    <PhotoCard
      photo={photo}
      onImageClick={(src) => console.log('Image clicked:', src)}
    />
  ), []);
  
  return (
    <VirtualizedList
      items={photos}
      itemHeight={300}
      containerHeight={600}
      renderItem={renderPhoto}
      overscan={3}
    />
  );
};
```

### 3. Lazy Loading and Code Splitting

```jsx
// ✅ Good: Route-based code splitting with lazy loading
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load route components
const HomeScreen = lazy(() => import('./screens/Homescreen'));
const APODScreen = lazy(() => import('./screens/Apodscreen'));
const MarsRoverScreen = lazy(() => import('./screens/MarsRoverscreen'));
const AsteroidScreen = lazy(() => import('./screens/Asteroidscreen'));
const EarthScreen = lazy(() => import('./screens/Earthscreen'));

// Component-level lazy loading
const LazyModal = lazy(() => import('./components/Modal'));

const App = () => {
  return (
    <ErrorBoundary>
      <div className="app">
        <Navbar />
        
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/apod" element={<APODScreen />} />
            <Route path="/mars" element={<MarsRoverScreen />} />
            <Route path="/asteroids" element={<AsteroidScreen />} />
            <Route path="/earth" element={<EarthScreen />} />
          </Routes>
        </Suspense>
        
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

// Image lazy loading component
const LazyImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef} className={`lazy-image ${className}`} {...props}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      {!isLoaded && isInView && (
        <div className="image-placeholder">
          <Loading />
        </div>
      )}
    </div>
  );
};
```

## Testing Strategies

### 1. Component Testing

```jsx
// ✅ Good: Comprehensive component tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import APODScreen from '../screens/Apodscreen';

// Mock fetch
global.fetch = jest.fn();

// Mock store
const mockStore = createStore(() => ({
  loginUserReducer: {
    currentUser: { username: 'testuser' }
  }
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <Provider store={mockStore}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
);

describe('APODScreen', () => {
  beforeEach(() => {
    fetch.mockClear();
  });
  
  it('renders loading state initially', () => {
    fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(
      <TestWrapper>
        <APODScreen />
      </TestWrapper>
    );
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('displays APOD data when loaded successfully', async () => {
    const mockAPODData = {
      title: 'Test APOD Title',
      explanation: 'Test explanation',
      url: 'https://example.com/image.jpg',
      date: '2024-01-01'
    };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAPODData
    });
    
    render(
      <TestWrapper>
        <APODScreen />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText(mockAPODData.title)).toBeInTheDocument();
    });
    
    expect(screen.getByText(mockAPODData.explanation)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockAPODData.url);
  });
  
  it('displays error message when API call fails', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <TestWrapper>
        <APODScreen />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });
  
  it('allows date selection and refetches data', async () => {
    const user = userEvent.setup();
    
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ title: 'Today APOD', date: '2024-01-01' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ title: 'Yesterday APOD', date: '2023-12-31' })
      });
    
    render(
      <TestWrapper>
        <APODScreen />
      </TestWrapper>
    );
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Today APOD')).toBeInTheDocument();
    });
    
    // Change date
    const dateInput = screen.getByLabelText(/date/i);
    await user.clear(dateInput);
    await user.type(dateInput, '2023-12-31');
    
    // Wait for new data
    await waitFor(() => {
      expect(screen.getByText('Yesterday APOD')).toBeInTheDocument();
    });
    
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
```

### 2. Redux Testing

```javascript
// ✅ Good: Redux action and reducer tests
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchMarsPhotos } from '../actions/marsActions';
import marsPhotosReducer from '../reducers/marsPhotosReducer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Mock fetch
global.fetch = jest.fn();

describe('Mars Photos Actions', () => {
  afterEach(() => {
    fetch.mockClear();
  });
  
  it('creates FETCH_MARS_PHOTOS_SUCCESS when fetching photos has been done', async () => {
    const mockPhotos = [
      { id: 1, sol: 1000, camera: { name: 'FHAZ' } }
    ];
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ photos: mockPhotos })
    });
    
    const expectedActions = [
      { type: 'FETCH_MARS_PHOTOS_REQUEST' },
      {
        type: 'FETCH_MARS_PHOTOS_SUCCESS',
        payload: expect.objectContaining({
          photos: mockPhotos,
          rover: 'curiosity',
          sol: 1000
        })
      }
    ];
    
    const store = mockStore({});
    
    await store.dispatch(fetchMarsPhotos('curiosity', 1000));
    
    expect(store.getActions()).toEqual(expectedActions);
  });
  
  it('creates FETCH_MARS_PHOTOS_FAILURE when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    const expectedActions = [
      { type: 'FETCH_MARS_PHOTOS_REQUEST' },
      {
        type: 'FETCH_MARS_PHOTOS_FAILURE',
        payload: expect.objectContaining({
          error: 'Network error',
          rover: 'curiosity',
          sol: 1000
        })
      }
    ];
    
    const store = mockStore({});
    
    await store.dispatch(fetchMarsPhotos('curiosity', 1000));
    
    expect(store.getActions()).toEqual(expectedActions);
  });
});

describe('Mars Photos Reducer', () => {
  const initialState = {
    photos: [],
    loading: false,
    error: null,
    filters: {
      rover: 'curiosity',
      sol: 1000,
      camera: null
    }
  };
  
  it('should return the initial state', () => {
    expect(marsPhotosReducer(undefined, {})).toEqual(initialState);
  });
  
  it('should handle FETCH_MARS_PHOTOS_REQUEST', () => {
    const action = { type: 'FETCH_MARS_PHOTOS_REQUEST' };
    const expectedState = {
      ...initialState,
      loading: true,
      error: null
    };
    
    expect(marsPhotosReducer(initialState, action)).toEqual(expectedState);
  });
  
  it('should handle FETCH_MARS_PHOTOS_SUCCESS', () => {
    const mockPhotos = [{ id: 1, sol: 1000 }];
    const action = {
      type: 'FETCH_MARS_PHOTOS_SUCCESS',
      payload: {
        photos: mockPhotos,
        rover: 'curiosity',
        sol: 1000,
        timestamp: Date.now()
      }
    };
    
    const expectedState = {
      ...initialState,
      loading: false,
      error: null,
      photos: mockPhotos
    };
    
    expect(marsPhotosReducer(initialState, action)).toEqual(
      expect.objectContaining(expectedState)
    );
  });
});
```

### 3. Integration Testing

```javascript
// ✅ Good: Integration test example
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import App from '../App';

// Mock NASA API
jest.mock('../services/nasaAPI', () => ({
  nasaAPI: {
    getAPOD: jest.fn(),
    getMarsPhotos: jest.fn()
  }
}));

import { nasaAPI } from '../services/nasaAPI';

const createTestStore = (initialState = {}) => {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  );
};

const TestWrapper = ({ children, store }) => (
  <Provider store={store}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </Provider>
);

describe('App Integration Tests', () => {
  let store;
  
  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });
  
  it('navigates between screens and loads data', async () => {
    const user = userEvent.setup();
    
    // Mock API responses
    nasaAPI.getAPOD.mockResolvedValue({
      title: 'Test APOD',
      explanation: 'Test explanation',
      url: 'test-image.jpg',
      date: '2024-01-01'
    });
    
    nasaAPI.getMarsPhotos.mockResolvedValue({
      photos: [
        {
          id: 1,
          sol: 1000,
          camera: { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
          img_src: 'mars-photo.jpg',
          earth_date: '2024-01-01'
        }
      ]
    });
    
    render(
      <TestWrapper store={store}>
        <App />
      </TestWrapper>
    );
    
    // Start at home page
    expect(screen.getByText(/astroinsight/i)).toBeInTheDocument();
    
    // Navigate to APOD
    await user.click(screen.getByText(/astronomy picture/i));
    
    // Wait for APOD to load
    await waitFor(() => {
      expect(screen.getByText('Test APOD')).toBeInTheDocument();
    });
    
    // Navigate to Mars photos
    await user.click(screen.getByText(/mars rover/i));
    
    // Wait for Mars photos to load
    await waitFor(() => {
      expect(screen.getByText(/front hazard avoidance camera/i)).toBeInTheDocument();
    });
    
    // Verify API calls were made
    expect(nasaAPI.getAPOD).toHaveBeenCalled();
    expect(nasaAPI.getMarsPhotos).toHaveBeenCalled();
  });
  
  it('handles authentication flow', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper store={store}>
        <App />
      </TestWrapper>
    );
    
    // Click login link
    await user.click(screen.getByText(/login/i));
    
    // Fill out login form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    // Verify form submission (would need to mock the API call)
    // This is a simplified example
  });
});
```

## Code Organization

### 1. File Structure Best Practices

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.test.js
│   │   │   └── Button.module.css
│   │   ├── Modal/
│   │   └── Form/
│   ├── layout/          # Layout components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   └── ui/              # UI-specific components
│       ├── Loading/
│       ├── Error/
│       └── Success/
├── screens/             # Page components
│   ├── Home/
│   ├── APOD/
│   ├── MarsRover/
│   └── Earth/
├── hooks/               # Custom hooks
│   ├── useNASAAPI.js
│   ├── useLocalStorage.js
│   └── useDebounce.js
├── services/            # API and external services
│   ├── nasaAPI.js
│   ├── authService.js
│   └── storageService.js
├── store/               # Redux store configuration
│   ├── index.js
│   ├── rootReducer.js
│   ├── actions/
│   │   ├── authActions.js
│   │   └── nasaActions.js
│   ├── reducers/
│   │   ├── authReducer.js
│   │   └── nasaReducer.js
│   └── selectors/
│       ├── authSelectors.js
│       └── nasaSelectors.js
├── utils/               # Utility functions
│   ├── constants.js
│   ├── helpers.js
│   ├── formatters.js
│   └── validators.js
├── styles/              # Global styles
│   ├── globals.css
│   ├── variables.css
│   └── mixins.css
└── tests/               # Test utilities
    ├── setup.js
    ├── mocks/
    └── fixtures/
```

### 2. Import/Export Patterns

```javascript
// ✅ Good: Consistent import/export patterns

// Named exports for utilities
// utils/formatters.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatDistance = (kilometers) => {
  return kilometers > 1000000 
    ? `${(kilometers / 1000000).toFixed(2)} million km`
    : `${kilometers.toLocaleString()} km`;
};

export const formatVelocity = (kmh) => {
  return `${parseFloat(kmh).toLocaleString()} km/h`;
};

// Default exports for components
// components/common/Button/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './Button.module.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  ...props 
}) => {
  const className = `btn btn-${variant} btn-${size}`;
  
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

export default Button;

// Barrel exports for cleaner imports
// components/index.js
export { default as Button } from './common/Button/Button';
export { default as Modal } from './common/Modal/Modal';
export { default as Loading } from './ui/Loading/Loading';
export { default as Error } from './ui/Error/Error';
export { default as Navbar } from './layout/Navbar/Navbar';
export { default as Footer } from './layout/Footer/Footer';

// Usage in other files
import { Button, Modal, Loading } from '../components';
```

### 3. Configuration Management

```javascript
// ✅ Good: Centralized configuration
// config/index.js
const config = {
  // API Configuration
  nasa: {
    baseURL: 'https://api.nasa.gov',
    apiKey: process.env.REACT_APP_NASA_API_KEY || 'DEMO_KEY',
    endpoints: {
      apod: '/planetary/apod',
      marsPhotos: '/mars-photos/api/v1/rovers',
      nearEarthObjects: '/neo/rest/v1/feed',
      earthImagery: '/planetary/earth/imagery'
    },
    rateLimit: {
      requestsPerHour: 1000,
      requestsPerSecond: 10
    }
  },
  
  // Backend API Configuration
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
    timeout: 10000,
    retries: 3
  },
  
  // App Configuration
  app: {
    name: 'AstroInsight',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    enableAnalytics: process.env.NODE_ENV === 'production',
    enableServiceWorker: process.env.NODE_ENV === 'production'
  },
  
  // UI Configuration
  ui: {
    theme: {
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      successColor: '#28a745',
      errorColor: '#dc3545'
    },
    breakpoints: {
      mobile: '576px',
      tablet: '768px',
      desktop: '992px',
      large: '1200px'
    },
    animations: {
      duration: '0.3s',
      easing: 'ease-in-out'
    }
  },
  
  // Feature Flags
  features: {
    enableUserRegistration: true,
    enableFavorites: true,
    enableOfflineMode: false,
    enablePushNotifications: false
  },
  
  // Performance Configuration
  performance: {
    imageOptimization: true,
    lazyLoading: true,
    virtualScrolling: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    maxCacheSize: 100
  }
};

// Environment-specific overrides
if (config.app.environment === 'production') {
  config.api.baseURL = 'https://your-production-api.com';
  config.performance.cacheTimeout = 15 * 60 * 1000; // 15 minutes in production
}

export default config;

// Usage
import config from '../config';

const apiCall = async () => {
  const response = await fetch(`${config.nasa.baseURL}${config.nasa.endpoints.apod}?api_key=${config.nasa.apiKey}`);
  return response.json();
};
```

## Security Best Practices

### 1. Input Sanitization and Validation

```javascript
// ✅ Good: Input validation and sanitization
import DOMPurify from 'dompurify';

// Input validation utilities
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  password: (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  },
  
  url: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  coordinates: (lat, lon) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    return (
      !isNaN(latitude) && 
      !isNaN(longitude) &&
      latitude >= -90 && 
      latitude <= 90 &&
      longitude >= -180 && 
      longitude <= 180
    );
  }
};

// Input sanitization
export const sanitizers = {
  html: (input) => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  },
  
  text: (input) => {
    return String(input)
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .substring(0, 1000); // Limit length
  },
  
  filename: (filename) => {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .substring(0, 255);
  }
};

// Secure form component
const SecureForm = ({ onSubmit, children }) => {
  const handleSubmit = useCallback(async (formData) => {
    // Validate all inputs
    const errors = {};
    
    if (formData.email && !validators.email(formData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (formData.password && !validators.password(formData.password)) {
      errors.password = 'Password does not meet requirements';
    }
    
    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Form validation failed', errors);
    }
    
    // Sanitize inputs
    const sanitizedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = sanitizers.text(formData[key]);
      return acc;
    }, {});
    
    await onSubmit(sanitizedData);
  }, [onSubmit]);
  
  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  );
};
```

### 2. Secure API Communication

```javascript
// ✅ Good: Secure API service with authentication
class SecureAPIService {
  constructor() {
    this.baseURL = config.api.baseURL;
    this.timeout = config.api.timeout;
  }
  
  // Get auth token securely
  getAuthToken() {
    // Don't store sensitive data in localStorage in production
    // Consider using httpOnly cookies or secure session storage
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.token;
  }
  
  // Create secure request headers
  createHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      ...customHeaders
    };
    
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    return headers;
  }
  
  // Secure request method with timeout and validation
  async secureRequest(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      // Validate endpoint
      if (!endpoint || typeof endpoint !== 'string') {
        throw new Error('Invalid endpoint');
      }
      
      // Ensure HTTPS in production
      const url = `${this.baseURL}${endpoint}`;
      if (config.app.environment === 'production' && !url.startsWith('https://')) {
        throw new Error('HTTPS required in production');
      }
      
      const response = await fetch(url, {
        ...options,
        headers: this.createHeaders(options.headers),
        signal: controller.signal,
        credentials: 'include', // Include cookies for CSRF protection
      });
      
      clearTimeout(timeoutId);
      
      // Handle different response types
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          endpoint
        );
      }
      
      // Validate response content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response content type');
      }
      
      const data = await response.json();
      
      // Basic response validation
      if (typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }
  
  // Secure login method
  async login(credentials) {
    // Validate credentials before sending
    if (!validators.email(credentials.email)) {
      throw new ValidationError('Invalid email format');
    }
    
    if (!credentials.password || credentials.password.length < 8) {
      throw new ValidationError('Invalid password');
    }
    
    return this.secureRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: sanitizers.text(credentials.email),
        password: credentials.password // Don't sanitize passwords
      })
    });
  }
  
  // Secure logout method
  async logout() {
    try {
      await this.secureRequest('/api/auth/logout', {
        method: 'POST'
      });
    } finally {
      // Always clear local storage
      localStorage.removeItem('currentUser');
      sessionStorage.clear();
    }
  }
}

export const secureAPI = new SecureAPIService();
```

### 3. Content Security Policy (CSP) Implementation

```javascript
// ✅ Good: CSP configuration for enhanced security
// public/index.html
/*
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https://apod.nasa.gov https://mars.nasa.gov;
  connect-src 'self' https://api.nasa.gov https://your-api-domain.com;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
*/

// CSP violation reporting
window.addEventListener('securitypolicyviolation', (event) => {
  console.error('CSP Violation:', {
    blockedURI: event.blockedURI,
    violatedDirective: event.violatedDirective,
    originalPolicy: event.originalPolicy,
    disposition: event.disposition
  });
  
  // Report to monitoring service in production
  if (config.app.environment === 'production') {
    fetch('/api/csp-violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error);
  }
});
```

This comprehensive documentation provides developers with practical examples and best practices for working with the AstroInsight codebase. It covers all major aspects of development from component patterns to security considerations, ensuring maintainable and scalable code.