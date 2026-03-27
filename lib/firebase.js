// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7G0v6-DWGuAJWyd5Vamc1A426Jf7Z6Pw",
  authDomain: "pickleball-906f7.firebaseapp.com",
  databaseURL: "https://pickleball-906f7-default-rtdb.firebaseio.com",
  projectId: "pickleball-906f7",
  storageBucket: "pickleball-906f7.firebasestorage.app",
  messagingSenderId: "709026792895",
  appId: "1:709026792895:web:fad4f5ab215db45c9c4d0a",
  measurementId: "G-BS4YJHTZTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, set, push };
