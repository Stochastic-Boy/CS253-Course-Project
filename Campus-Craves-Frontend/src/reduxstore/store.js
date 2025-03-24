// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reduxfeatures/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,  
  },
});
