import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// firestore dependencies
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, collection, query, where, addDoc, getDoc,getDocs, setDoc, updateDoc, deleteDoc, arrayUnion} from "firebase/firestore"; 
import { getAuth ,createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";



import { init as initUsersAPI } from "./utility/API_users.js";
import { init as initFriendReqAPI } from "./utility/API_friendReq.js";
import { init as initWordBankAPI } from "./utility/API_wordbank.js";
import { init as initProfileAPI } from "./utility/API_profile.js";
import { init as initMarketAPI } from "./utility/API_market.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());
app.use(cors());


const firebaseConfig = {
    apiKey: "AIzaSyCfdLDNlu0qvGBkPNfyow-YcbZqhavQbK4",
    authDomain: "ece493-capstone.firebaseapp.com",
    projectId: "ece493-capstone",
    storageBucket: "ece493-capstone.appspot.com",
    messagingSenderId: "388992282247",
    appId: "1:388992282247:web:637b6e6d917685772b5222",
    measurementId: "G-ESJEZ56XLP"
  };

const firestoreApp = initializeApp(firebaseConfig);
const db = getFirestore(firestoreApp);
const auth = getAuth(firestoreApp);


  // Start the Express server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);

    initUsersAPI(app, db, auth);
    initFriendReqAPI(app, db);
    initWordBankAPI(app, db);
    initProfileAPI(app, db);
    initMarketAPI(app, db);

});
