import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDhJ6L_jbWs1ceYhEWpwBmr_gwCW1-qbTU",
  authDomain: "color-trading-app-d9f29.firebaseapp.com",
  projectId: "color-trading-app-d9f29",
  storageBucket: "color-trading-app-d9f29.firebasestorage.app",
  messagingSenderId: "117967827833",
  appId: "1:117967827833:web:09d5e11af6b84c0752b5a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
