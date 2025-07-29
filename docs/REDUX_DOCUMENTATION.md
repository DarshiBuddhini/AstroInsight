# AstroInsight Redux State Management Documentation

## Overview

This document provides comprehensive documentation for the Redux state management implementation in AstroInsight. The application uses Redux with Redux Thunk middleware for handling asynchronous actions and managing global application state.

## Table of Contents

1. [Store Configuration](#store-configuration)
2. [Actions](#actions)
3. [Reducers](#reducers)
4. [State Structure](#state-structure)
5. [Usage Patterns](#usage-patterns)
6. [Best Practices](#best-practices)

## Store Configuration

**Location**: `src/store.js`

The Redux store is configured with the following setup:

```javascript
import { combineReducers } from "redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  loginUserReducer,
  registerUserReducer,
} from "./reducers/userReducer";

const finalReducer = combineReducers({
  registerUserReducer: registerUserReducer,
  loginUserReducer: loginUserReducer,
});

const currentUser = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser"))
  : null;

const initialState = {
  loginUserReducer: {
    currentUser: currentUser,
  },
};

const composeEnhancers = composeWithDevTools({});
const store = createStore(
  finalReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
```

### Key Features:
- **Redux Thunk**: Enables async action creators
- **Redux DevTools**: Development debugging support
- **Local Storage Integration**: Persists user authentication state
- **Combined Reducers**: Modular state management

## Actions

### User Actions

**Location**: `src/actions/userActions.js`

#### loginUser(user)

Authenticates a user and manages login state.

**Parameters:**
```typescript
interface User {
  email: string;
  password: string;
}
```

**Action Types:**
- `USER_LOGIN_REQUEST`: Dispatched when login starts
- `USER_LOGIN_SUCCESS`: Dispatched on successful login
- `USER_LOGIN_FAILED`: Dispatched on login failure

**Implementation:**
```javascript
export const loginUser = (user) => async (dispatch) => {
  dispatch({ type: 'USER_LOGIN_REQUEST' });

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', user);
    dispatch({ type: 'USER_LOGIN_SUCCESS', payload: response.data });
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    window.location.href = '/';
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      dispatch({ type: 'USER_LOGIN_FAILED', payload: error.response.data.message });
    } else {
      dispatch({ type: 'USER_LOGIN_FAILED', payload: 'An error occurred during login' });
    }
  }
};
```

**Usage:**
```javascript
import { useDispatch } from 'react-redux';
import { loginUser } from '../actions/userActions';

function LoginComponent() {
  const dispatch = useDispatch();
  
  const handleLogin = (userData) => {
    dispatch(loginUser(userData));
  };
  
  // Component implementation
}
```

#### logoutUser()

Logs out the current user and clears authentication state.

**Implementation:**
```javascript
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
};
```

**Usage:**
```javascript
import { useDispatch } from 'react-redux';
import { logoutUser } from '../actions/userActions';

function NavbarComponent() {
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  // Component implementation
}
```

### Action Creator Patterns

#### Async Action Pattern
```javascript
export const asyncAction = (data) => async (dispatch, getState) => {
  // Start loading
  dispatch({ type: 'ACTION_REQUEST' });
  
  try {
    // API call
    const response = await api.call(data);
    
    // Success
    dispatch({ 
      type: 'ACTION_SUCCESS', 
      payload: response.data 
    });
    
    // Side effects
    localStorage.setItem('data', JSON.stringify(response.data));
    
  } catch (error) {
    // Error handling
    const errorMessage = error.response?.data?.message || 'An error occurred';
    dispatch({ 
      type: 'ACTION_FAILED', 
      payload: errorMessage 
    });
  }
};
```

#### Sync Action Pattern
```javascript
export const syncAction = (payload) => ({
  type: 'SYNC_ACTION',
  payload
});
```

## Reducers

### User Reducers

**Location**: `src/reducers/userReducer.js`

#### registerUserReducer

Manages user registration state.

**State Shape:**
```typescript
interface RegisterState {
  loading?: boolean;
  success?: boolean;
  message?: string;
  error?: string;
}
```

**Implementation:**
```javascript
export const registerUserReducer = (state = {}, action) => {
  switch (action.type) {
    case 'USER_REGISTER_REQUEST':
      return {
        loading: true
      };
    case 'USER_REGISTER_SUCCESS':
      return {
        loading: false,
        success: true,
        message: action.payload
      };
    case 'USER_REGISTER_FAILED':
      return {
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};
```

#### loginUserReducer

Manages user authentication state.

**State Shape:**
```typescript
interface LoginState {
  loading?: boolean;
  success?: boolean;
  currentUser?: {
    token: string;
    username: string;
    email: string;
  };
  error?: string;
}
```

**Implementation:**
```javascript
export const loginUserReducer = (state = {}, action) => {
  switch (action.type) {
    case 'USER_LOGIN_REQUEST': 
      return {
        loading: true
      };
    case 'USER_LOGIN_SUCCESS': 
      return {
        loading: false,
        success: true,
        currentUser: action.payload
      };
    case 'USER_LOGIN_FAILED': 
      return {
        loading: false,
        error: action.payload
      };
    default: 
      return state;
  }
};
```

### Reducer Patterns

#### Standard Async Reducer Pattern
```javascript
const asyncReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};
```

#### Entity Management Reducer Pattern
```javascript
const entityReducer = (state = { items: [], selectedItem: null }, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'SELECT_ITEM':
      return {
        ...state,
        selectedItem: action.payload
      };
    default:
      return state;
  }
};
```

## State Structure

### Global State Tree

```javascript
{
  // User authentication state
  loginUserReducer: {
    loading: boolean,
    success: boolean,
    currentUser: {
      token: string,
      username: string,
      email: string
    } | null,
    error: string | null
  },
  
  // User registration state
  registerUserReducer: {
    loading: boolean,
    success: boolean,
    message: string,
    error: string | null
  }
}
```

### State Access Patterns

#### Using useSelector Hook
```javascript
import { useSelector } from 'react-redux';

function MyComponent() {
  // Select specific state slice
  const loginState = useSelector(state => state.loginUserReducer);
  const { loading, error, currentUser } = loginState;
  
  // Select computed values
  const isAuthenticated = useSelector(state => 
    Boolean(state.loginUserReducer.currentUser)
  );
  
  // Select with custom selector
  const username = useSelector(state => 
    state.loginUserReducer.currentUser?.username || 'Guest'
  );
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <div>Welcome, {username}!</div>
    </div>
  );
}
```

#### Creating Selector Functions
```javascript
// selectors/userSelectors.js
export const selectCurrentUser = (state) => state.loginUserReducer.currentUser;
export const selectIsAuthenticated = (state) => Boolean(selectCurrentUser(state));
export const selectUserLoading = (state) => state.loginUserReducer.loading;
export const selectUserError = (state) => state.loginUserReducer.error;

// Usage in component
import { selectCurrentUser, selectIsAuthenticated } from '../selectors/userSelectors';

function MyComponent() {
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Component implementation
}
```

## Usage Patterns

### Component Integration

#### Complete Redux Integration Example
```javascript
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../actions/userActions';
import Loading from '../components/Loading';
import Error from '../components/Error';

function AuthComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const loginState = useSelector(state => state.loginUserReducer);
  const { loading, error, currentUser } = loginState;
  
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  
  if (currentUser) {
    return (
      <div>
        <h2>Welcome, {currentUser.username}!</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }
  
  return (
    <div>
      {loading && <Loading />}
      {error && <Error error={error} />}
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

### Middleware Usage

#### Redux Thunk for Async Actions
```javascript
// Action creator with thunk
export const fetchUserData = (userId) => async (dispatch, getState) => {
  const { currentUser } = getState().loginUserReducer;
  
  if (!currentUser) {
    dispatch({ type: 'FETCH_USER_FAILED', payload: 'Not authenticated' });
    return;
  }
  
  dispatch({ type: 'FETCH_USER_REQUEST' });
  
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${currentUser.token}` }
    });
    
    dispatch({ type: 'FETCH_USER_SUCCESS', payload: response.data });
  } catch (error) {
    dispatch({ type: 'FETCH_USER_FAILED', payload: error.message });
  }
};
```

### Local Storage Integration

#### Persisting State
```javascript
// Save to localStorage
const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('appState', serializedState);
  } catch (error) {
    console.warn('Could not save state to localStorage:', error);
  }
};

// Load from localStorage
const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('appState');
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.warn('Could not load state from localStorage:', error);
    return undefined;
  }
};

// Store configuration with persistence
const persistedState = loadFromLocalStorage();
const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(thunk))
);

// Save state on changes
store.subscribe(() => {
  saveToLocalStorage({
    loginUserReducer: store.getState().loginUserReducer
  });
});
```

## Best Practices

### Action Creators

1. **Consistent Naming**: Use descriptive, consistent naming conventions
   ```javascript
   // Good
   export const loginUser = (userData) => { /* ... */ };
   export const logoutUser = () => { /* ... */ };
   
   // Avoid
   export const login = (data) => { /* ... */ };
   export const doLogout = () => { /* ... */ };
   ```

2. **Error Handling**: Always handle errors gracefully
   ```javascript
   try {
     const response = await api.call();
     dispatch({ type: 'SUCCESS', payload: response.data });
   } catch (error) {
     const message = error.response?.data?.message || 'An error occurred';
     dispatch({ type: 'FAILED', payload: message });
   }
   ```

3. **Action Types**: Use constants for action types
   ```javascript
   // constants/actionTypes.js
   export const USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
   export const USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
   export const USER_LOGIN_FAILED = 'USER_LOGIN_FAILED';
   
   // actions/userActions.js
   import { USER_LOGIN_REQUEST } from '../constants/actionTypes';
   
   dispatch({ type: USER_LOGIN_REQUEST });
   ```

### Reducers

1. **Immutability**: Always return new state objects
   ```javascript
   // Good
   return {
     ...state,
     loading: false,
     data: action.payload
   };
   
   // Avoid
   state.loading = false;
   return state;
   ```

2. **Default Cases**: Always include default case
   ```javascript
   switch (action.type) {
     case 'ACTION_TYPE':
       return newState;
     default:
       return state; // Always return current state
   }
   ```

3. **State Shape Consistency**: Maintain consistent state structure
   ```javascript
   const initialState = {
     loading: false,
     data: null,
     error: null
   };
   ```

### Component Integration

1. **Selective State Access**: Only select needed state
   ```javascript
   // Good
   const { loading, error } = useSelector(state => state.userReducer);
   
   // Avoid selecting entire state
   const state = useSelector(state => state);
   ```

2. **Memoized Selectors**: Use memoization for expensive selectors
   ```javascript
   import { createSelector } from 'reselect';
   
   const selectUsers = state => state.users;
   const selectActiveUsers = createSelector(
     selectUsers,
     users => users.filter(user => user.active)
   );
   ```

3. **Dispatch Actions in Event Handlers**: Don't dispatch in render
   ```javascript
   // Good
   const handleClick = () => {
     dispatch(someAction());
   };
   
   // Avoid
   const MyComponent = () => {
     dispatch(someAction()); // Don't dispatch in render
     return <div>...</div>;
   };
   ```

### Performance Optimization

1. **Use React.memo() for Pure Components**
   ```javascript
   import React, { memo } from 'react';
   
   const MyComponent = memo(({ data }) => {
     return <div>{data}</div>;
   });
   ```

2. **Optimize useSelector Usage**
   ```javascript
   // Good - separate selectors
   const loading = useSelector(state => state.user.loading);
   const error = useSelector(state => state.user.error);
   
   // Less optimal - single object selector
   const { loading, error } = useSelector(state => ({
     loading: state.user.loading,
     error: state.user.error
   }));
   ```

### Testing

1. **Test Action Creators**
   ```javascript
   import { loginUser } from '../actions/userActions';
   
   test('loginUser creates correct actions', async () => {
     const mockDispatch = jest.fn();
     const userData = { email: 'test@test.com', password: 'password' };
     
     await loginUser(userData)(mockDispatch);
     
     expect(mockDispatch).toHaveBeenCalledWith({
       type: 'USER_LOGIN_REQUEST'
     });
   });
   ```

2. **Test Reducers**
   ```javascript
   import { loginUserReducer } from '../reducers/userReducer';
   
   test('loginUserReducer handles USER_LOGIN_SUCCESS', () => {
     const initialState = {};
     const action = {
       type: 'USER_LOGIN_SUCCESS',
       payload: { token: 'abc123' }
     };
     
     const newState = loginUserReducer(initialState, action);
     
     expect(newState).toEqual({
       loading: false,
       success: true,
       currentUser: { token: 'abc123' }
     });
   });
   ```