import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // Add more reducers here in later phases:
  // skills: skillsReducer,
  // rentals: rentalsReducer,
  // notifications: notificationsReducer,
  // messages: messagesReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
