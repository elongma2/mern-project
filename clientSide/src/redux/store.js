import { configureStore } from '@reduxjs/toolkit';
import userSlice from './user/userSlice';
// Configure Redux store with custom middleware settings
export const store = configureStore({
  reducer: {user: userSlice}, // <-- Add your reducers here when you create them
  middleware: (getDefaultMiddleware) => {
    // Customize default middleware behavior
    return getDefaultMiddleware({
      serializableCheck: false, // Disable Redux Toolkit's default serializable check tells Redux not to enforce a rule that all data you store or send in actions must be easy to convert into a simple format (like a plain JavaScript object).
    });
  },
});
