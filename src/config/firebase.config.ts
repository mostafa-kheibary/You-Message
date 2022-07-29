import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyAjvkfumuB-24wnvlMTUz7gIMFfYn_a-S4',
  authDomain: 'chat-app-83d83.firebaseapp.com',
  projectId: 'chat-app-83d83',
  storageBucket: 'chat-app-83d83.appspot.com',
  messagingSenderId: '174693682223',
  appId: '1:174693682223:web:6d584560dcb9900af54ada',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db, app };
