// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration from your Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyB1FF9rm-eHhqhdvZs_UAdufEz-g1g8tmc",
  authDomain: "taskmanagement-c1ed5.firebaseapp.com",
  projectId: "taskmanagement-c1ed5",
  storageBucket: "taskmanagement-c1ed5.appspot.com",
  messagingSenderId: "430450488276",
  appId: "1:430450488276:web:4a4b80c6777424250b1c41",
  measurementId: "G-YDW4C3Y6KZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword };
