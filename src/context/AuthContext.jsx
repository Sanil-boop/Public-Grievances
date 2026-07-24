import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  apiLogin, apiSignup, apiGetMe, apiUpdateProfile, apiAddKarma,
  getToken, clearToken,
} from '../utils/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'nagarseva-auth';

// localStorage fallback for when backend is offline
function loadAuthFallback() {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveAuthFallback(user) {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Auth storage error:', e);
  }
}

const initialState = {
  user: null,
  isAuthenticated: false,
  backendOnline: true,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
    case 'SIGNUP': {
      const user = action.payload;
      saveAuthFallback(user);
      return { ...state, user, isAuthenticated: true };
    }
    case 'LOGOUT': {
      saveAuthFallback(null);
      clearToken();
      return { ...state, user: null, isAuthenticated: false };
    }
    case 'UPDATE_USER': {
      const updatedUser = { ...state.user, ...action.payload };
      saveAuthFallback(updatedUser);
      return { ...state, user: updatedUser };
    }
    case 'LOAD_SESSION': {
      const user = action.payload;
      if (user) {
        saveAuthFallback(user);
      }
      return user
        ? { ...state, user, isAuthenticated: true, isLoading: false }
        : { ...state, user: null, isAuthenticated: false, isLoading: false };
    }
    case 'SET_BACKEND_STATUS': {
      return { ...state, backendOnline: action.payload };
    }
    case 'ADD_KARMA': {
      if (!state.user) return state;
      const newPoints = (state.user.karmaPoints || 0) + action.payload;
      let newBadges = [...(state.user.badges || [])];

      if (newPoints >= 50 && !newBadges.includes('Civic Starter')) newBadges.push('Civic Starter');
      if (newPoints >= 150 && !newBadges.includes('Active Citizen')) newBadges.push('Active Citizen');
      if (newPoints >= 500 && !newBadges.includes('City Guardian')) newBadges.push('City Guardian');

      const updatedUser = { ...state.user, karmaPoints: newPoints, badges: newBadges };
      saveAuthFallback(updatedUser);
      return { ...state, user: updatedUser };
    }
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // On mount — try to load session from API, fallback to localStorage
  useEffect(() => {
    const loadSession = async () => {
      const token = getToken();
      if (token) {
        try {
          const data = await apiGetMe();
          dispatch({ type: 'LOAD_SESSION', payload: data.user });
          dispatch({ type: 'SET_BACKEND_STATUS', payload: true });
          return;
        } catch (err) {
          if (err.message === 'BACKEND_OFFLINE') {
            dispatch({ type: 'SET_BACKEND_STATUS', payload: false });
          }
          // Token might be invalid — fall through to localStorage
        }
      }
      // Fallback to localStorage
      const stored = loadAuthFallback();
      if (stored) {
        dispatch({ type: 'LOAD_SESSION', payload: stored });
      } else {
        dispatch({ type: 'LOAD_SESSION', payload: null });
      }
    };
    loadSession();
  }, []);

  const login = async (email, password, role) => {
    try {
      const data = await apiLogin(email, password, role);
      dispatch({ type: 'LOGIN', payload: data.user });
      dispatch({ type: 'SET_BACKEND_STATUS', payload: true });
      return { success: true };
    } catch (err) {
      if (err.message === 'BACKEND_OFFLINE') {
        dispatch({ type: 'SET_BACKEND_STATUS', payload: false });
        // Fallback to localStorage login
        const users = JSON.parse(localStorage.getItem('nagarseva-users') || '[]');
        const found = users.find(u => u.email === email && u.password === password && u.role === role);
        if (found) {
          dispatch({ type: 'LOGIN', payload: { name: found.name, email: found.email, role: found.role } });
          return { success: true };
        }
        return { success: false, error: 'Invalid email, password, or role' };
      }
      return { success: false, error: err.message };
    }
  };

  const signup = async (name, email, phone, password, role) => {
    try {
      const data = await apiSignup(name, email, phone, password, role);
      dispatch({ type: 'SIGNUP', payload: data.user });
      dispatch({ type: 'SET_BACKEND_STATUS', payload: true });
      return { success: true };
    } catch (err) {
      if (err.message === 'BACKEND_OFFLINE') {
        dispatch({ type: 'SET_BACKEND_STATUS', payload: false });
        // Fallback to localStorage signup
        const users = JSON.parse(localStorage.getItem('nagarseva-users') || '[]');
        if (users.find(u => u.email === email)) {
          return { success: false, error: 'An account with this email already exists' };
        }
        const newUser = { name, email, phone, password, role, createdAt: new Date().toISOString() };
        users.push(newUser);
        localStorage.setItem('nagarseva-users', JSON.stringify(users));
        dispatch({ type: 'SIGNUP', payload: { name, email, role } });
        return { success: true };
      }
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = async (profileData) => {
    if (!state.user) return { success: false, error: 'No active session' };

    try {
      const data = await apiUpdateProfile(profileData);
      dispatch({ type: 'UPDATE_USER', payload: data.user || profileData });
      return { success: true };
    } catch (err) {
      if (err.message === 'BACKEND_OFFLINE') {
        // Fallback
        const users = JSON.parse(localStorage.getItem('nagarseva-users') || '[]');
        const userIndex = users.findIndex(u => u.email === state.user.email);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...profileData };
          localStorage.setItem('nagarseva-users', JSON.stringify(users));
        }
        dispatch({ type: 'UPDATE_USER', payload: profileData });
        return { success: true };
      }
      return { success: false, error: err.message };
    }
  };

  const addKarma = async (points) => {
    dispatch({ type: 'ADD_KARMA', payload: points });

    try {
      await apiAddKarma(points);
    } catch {
      // Already updated locally via dispatch, just log if backend fails
      console.warn('Karma sync to backend failed, saved locally.');
    }

    // Also persist to localStorage users array as fallback
    if (state.user) {
      const users = JSON.parse(localStorage.getItem('nagarseva-users') || '[]');
      const userIndex = users.findIndex(u => u.email === state.user.email);
      if (userIndex !== -1) {
        const newPoints = (users[userIndex].karmaPoints || 0) + points;
        users[userIndex].karmaPoints = newPoints;
        let newBadges = [...(users[userIndex].badges || [])];
        if (newPoints >= 50 && !newBadges.includes('Civic Starter')) newBadges.push('Civic Starter');
        if (newPoints >= 150 && !newBadges.includes('Active Citizen')) newBadges.push('Active Citizen');
        if (newPoints >= 500 && !newBadges.includes('City Guardian')) newBadges.push('City Guardian');
        users[userIndex].badges = newBadges;
        localStorage.setItem('nagarseva-users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateUser, addKarma }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
