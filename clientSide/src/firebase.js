// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1f5ba.firebaseapp.com",
  projectId: "mern-estate-1f5ba",
  storageBucket: "mern-estate-1f5ba.appspot.com",
  messagingSenderId: "221889479014",
  appId: "1:221889479014:web:5b8c1b9768c30cc05548a7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);