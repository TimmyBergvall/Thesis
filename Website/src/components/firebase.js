import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqRIOkwrFdibY0EHKiH3UCRXPHQCM5QuU",
  authDomain: "thesis-d3405.firebaseapp.com",
  projectId: "thesis-d3405",
  storageBucket: "thesis-d3405.appspot.com",
  messagingSenderId: "657550449245",
  appId: "1:657550449245:web:900cba698989da73674bb4",
  measurementId: "G-4TQE6PEGL6",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
