import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAbz5yuhJelJmIIdlS5-3hnt15tFN2ETSY",
    authDomain: "next-firebase-90774.firebaseapp.com",
    projectId: "next-firebase-90774",
    storageBucket: "next-firebase-90774.appspot.com",
    messagingSenderId: "909423628545",
    appId: "1:909423628545:web:203497461178b833e48b00"
  };

let firebaseApp

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
}

export const app = firebaseApp
export const auth = getAuth(app)
export const db = getFirestore(app);
