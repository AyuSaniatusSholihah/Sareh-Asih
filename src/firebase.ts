import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDmj-Y-i8RkKfeD5wlJrJPHvTEKWsiBivE",
  authDomain: "sareh-asih-db.firebaseapp.com",
  projectId: "sareh-asih-db",
  storageBucket: "sareh-asih-db.firebasestorage.app",
  messagingSenderId: "989606234723",
  appId: "1:989606234723:web:883d9073b486a984b34656",
  measurementId: "G-8QJJRTD51G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
