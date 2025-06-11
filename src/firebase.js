import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA34JedpoXjgOjT6PJgN06yQBIL8b4Gb24",
  authDomain: "smart-car-parking-f6231.firebaseapp.com",
  databaseURL:
    "https://smart-car-parking-f6231-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-car-parking-f6231",
  storageBucket: "smart-car-parking-f6231.firebasestorage.app",
  messagingSenderId: "164028134361",
  appId: "1:164028134361:web:37cbc0c374a3862916dfc8",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export auth and db
export const auth = firebase.auth();
export const db = firebase.firestore();
