// features/user/userSlice.js
import { createSlice } from '@reduxjs/toolkit';
 
// Helper function to load user data and tokens from localStorage
const loadUserFromLocalStorage = () => {
  const userData = localStorage.getItem('user');
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  return {
    user: userData && userData !== "undefined" ? JSON.parse(userData) : null, // Prevent JSON.parse error
    tokens: {
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
    },
  };
};

const initialState = {
  user: loadUserFromLocalStorage().user, // Load user data from localStorage
  tokens: loadUserFromLocalStorage().tokens, // Load tokens from localStorage
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;

      state.user = user;
      state.tokens = {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
      state.loading = false;
      state.error = null;

      // Save user data and tokens to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    },
    signUpFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;

      state.user = user;
      state.tokens = {
        accessToken: access_token,
        refreshToken: refresh_token,
      };
      state.loading = false;
      state.error = null;

      // Save user data and tokens to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.tokens = {
        accessToken: null,
        refreshToken: null,
      };
      state.error = null;
      state.loading = false;

      // Remove user data and tokens from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  },
});

export const {
  signUpStart,
  signUpSuccess,
  signUpFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
} = userSlice.actions;
export default userSlice.reducer;