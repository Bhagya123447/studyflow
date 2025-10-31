import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMZgJ0UKlQTO2Mn5WtRTZQHOdN5_rxm7s",
  authDomain: "studyflow-tracker.firebaseapp.com",
  projectId: "studyflow-tracker",
  storageBucket: "studyflow-tracker.firebasestorage.app",
  messagingSenderId: "632480408917",
  appId: "1:632480408917:web:4f68c188ebaee7bcd4bbdc",
  measurementId: "G-WK2J9DKH10"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
