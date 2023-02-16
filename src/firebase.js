// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA40LRpp-BAwJqWo3FVNhCXcNVUuw10V18",
  authDomain: "react-chat-d8e63.firebaseapp.com",
  projectId: "react-chat-d8e63",
  storageBucket: "react-chat-d8e63.appspot.com",
  messagingSenderId: "97434322712",
  appId: "1:97434322712:web:a603878c06d3fc002c006d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)