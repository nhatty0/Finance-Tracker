// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUzko11QXpk7YIqSgODfEBdB36X40pQU4",
  authDomain: "finance-tracker-82bc5.firebaseapp.com",
  projectId: "finance-tracker-82bc5",
  storageBucket: "finance-tracker-82bc5.firebasestorage.app",
  messagingSenderId: "26957599491",
  appId: "1:26957599491:web:a67515e569f5b1b5eb0f36",
  measurementId: "G-JEMC7EFTQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };