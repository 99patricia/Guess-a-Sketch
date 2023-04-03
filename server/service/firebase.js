import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import admin from "firebase-admin";
import { default as serviceAccount } from "../secrets/serviceAccount.js";

// Initialize Firebase admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const adminFirestore = admin.firestore();
const adminAuth = admin.auth();

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCfdLDNlu0qvGBkPNfyow-YcbZqhavQbK4",
    authDomain: "ece493-capstone.firebaseapp.com",
    projectId: "ece493-capstone",
    storageBucket: "ece493-capstone.appspot.com",
    messagingSenderId: "388992282247",
    appId: "1:388992282247:web:637b6e6d917685772b5222",
    measurementId: "G-ESJEZ56XLP",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { adminAuth, adminFirestore, auth, db, firebaseApp };
