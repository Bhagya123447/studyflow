import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBMZgJ0UKlQTO2Mn5WtRTZQHOdN5_rxm7s",
  authDomain: "studyflow-tracker.firebaseapp.com",
  projectId: "studyflow-tracker",
  storageBucket: "studyflow-tracker.firebasestorage.app",
  messagingSenderId: "632480408917",
  measurementId: "G-WK2J9DKH10",
  appId: "1:632480408917:web:4f68c188ebaee7bcd4bbdc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;