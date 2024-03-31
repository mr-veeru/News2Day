// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";

// ENTER YOUR FIREBASE DETAILS 
const firebaseConfig = {
  apiKey: "YOUR API KEY",
  authDomain: "news-app-9b97a.firebaseapp.com",
  projectId: "news-app-9b97a",
  storageBucket: "news-app-9b97a.appspot.com",
  messagingSenderId: "767137240730",
  appId: "1:767137240730:web:0b72ff7395eb63a76df123",
  measurementId: "G-4RKCT3MC2P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app)
