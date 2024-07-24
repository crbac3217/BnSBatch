// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDi39fm2HUuEwIAh3GQxl6vxtRWLSyOupM",
  authDomain: "bnsbatch-8e162.firebaseapp.com",
  projectId: "bnsbatch-8e162",
  storageBucket: "bnsbatch-8e162.appspot.com",
  messagingSenderId: "310898582926",
  appId: "1:310898582926:web:7f248b2291e67064e830df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
