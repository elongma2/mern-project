// Import necessary functions and modules from redux toolkit and redux-persist
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userSlice from './user/userSlice'; // Import the user slice reducer
import persistReducer from 'redux-persist/es/persistReducer'; // Import persistReducer to persist the state
import storage from 'redux-persist/lib/storage'; // Default storage engine for redux-persist (localStorage)
import persistStore from 'redux-persist/es/persistStore'; // Import persistStore to create the persistor

// Combine multiple reducers into a single reducer function
const rootReducer = combineReducers({ user: userSlice }); // Combine user slice reducer

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // Key for storing the persisted state in the storage
  storage, // Storage engine to use (localStorage in this case)
  version: 1, // Version of the persisted state
};

// Enhance the root reducer to automatically persist the state
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store with the persisted reducer and custom middleware settings
export const store = configureStore({
  reducer: persistedReducer, // Set the persisted reducer as the root reducer
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      // Customize default middleware behavior
      serializableCheck: false, // Disable Redux Toolkit's default serializable check
    });
  },
});

// Create a persistor which is responsible for persisting and rehydrating the store
export const persistor = persistStore(store);

//install redux persist in the client side