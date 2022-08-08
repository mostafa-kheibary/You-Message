import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDIx7YPBHaqcQILlX5Vam1E6mzw1naz1cM",
  authDomain: "chat-app-4e51c.firebaseapp.com",
  projectId: "chat-app-4e51c",
  storageBucket: "chat-app-4e51c.appspot.com",
  messagingSenderId: "866510229354",
  appId: "1:866510229354:web:8da5251267c7bba9f75f13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db, app };
