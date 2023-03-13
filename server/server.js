import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// firestore dependencies
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { addDoc, getDocs, collection } from "firebase/firestore";

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
const firestoreApp = initializeApp(firebaseConfig);
// const firestoreAnalytics = getAnalytics(firestoreApp);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firestoreApp);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rooms = io.of("/").adapter.rooms;
const sids = io.of("/").adapter.sids;

app.use(cors());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

async function addRoomToDB(room, socket_id) {
    try {
        const docRef = await addDoc(collection(db, "rooms"), {
            room_id: room,
            text: "this is a game room created by " + socket_id,
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function readRoomsFromDB() {
    const querySnapshot = await getDocs(collection(db, "rooms"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().text}`);
    });
}

io.on("connection", async (socket) => {
    console.log("a user connected with id: " + socket.id);
    var auth = false;
    var currentRoom = "";
    var username = "";
    var host = false;

    // takes in room_id and tries to create that room
    // returns ("create-room-fail") if the room already exists
    // on success the socket will create/join the room and emit
    // ("create-room-success") back to the client
    socket.on("create-room", (room) => {
        if (rooms.has(room)) {
            // room already exists
            socket.to(socket.id).emit("create-room-fail", {
                room,
                msg: "room already exists",
            });
        } else {
            // create and join room
            socket.join(room);
            currentRoom = room;
            host = true;
            socket.to(socket.id).emit("create-room-success", room);
        }
    });

    // takes in room_id as an argument and tries to join that room
    // - if the user already is in a room, the socket will disconnect the user from
    // said room.
    // - if the room does not exist the user will not join the room (not implemented yet)
    // - on success the socket will emit ("join-room-success") back to the client to notify it that
    // it has successfully joined a room
    socket.on("join-room", (room) => {
        // if (socket.rooms.size > 1) {
        //     // user is already in a room
        //     for (let room of socket.rooms) {
        //         if (!(room === socket.id)) {
        //             socket.leave(room); // leave other rooms
        //         }
        //     }
        // }
        if (rooms.has(room)) {
            // room exists
            socket.join(room);
            currentRoom = room;
            host = false;
            console.log(socket.id);
            io.to(socket.id).emit("join-room-success", room);
        } else {
            console.log("room does not exist");
            io.to(socket.id).emit("join-room-fail", {
                room,
                msg: "room does not exist",
            });
        }
    });

    socket.on("leave-room", (room) => {
        socket.leave(room);
    });

    socket.on("chat message", (msg) => {
        console.log(
            "Room " + currentRoom + " - " + msg.username + ": " + msg.message
        );
        io.to(currentRoom).emit("chat message", msg);
    });

    socket.on("draw", (data) => {
        io.to(currentRoom).emit("draw", data);
    });

    socket.on("clear-canvas", (data) => {
        io.to(currentRoom).emit("clear-canvas", data);
    });

    socket.on("disconnect", () => {
        console.log(socket.id + " with username " + username + " disconnected");
    });
});

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});

io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
});

server.listen(3001, () => {
    console.log("listening on *:3001");
});
