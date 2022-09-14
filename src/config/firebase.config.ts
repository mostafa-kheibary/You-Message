import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { CACHE_SIZE_UNLIMITED, initializeFirestore } from 'firebase/firestore';
// Initialize Firebase

// you must have this info to run the backend service localy
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });
const rDb = getDatabase();
export { db, rDb, app };
