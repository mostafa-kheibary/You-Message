import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAI3j-iEgmF2_qIK2tW8kndgrNujziZpsk',
  authDomain: 'chat-app-19766.firebaseapp.com',
  projectId: 'chat-app-19766',
  storageBucket: 'chat-app-19766.appspot.com',
  messagingSenderId: '276689886665',
  appId: '1:276689886665:web:469af8ed23b97e05de1c18',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db, app };
