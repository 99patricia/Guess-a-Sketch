import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import {
    friendRequest,
    market,
    userProfile,
    users,
    wordbank,
} from "./routes/index.js";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const PORT = process.env.PORT || 3001;

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
const db = getFirestore(firestoreApp);
const auth = getAuth(firestoreApp);

// Initialize app
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Socket functions
const rooms = io.of("/").adapter.rooms;

io.on("connection", async (socket) => {
    console.log("A user connected with id: " + socket.id);
    var currentRoom = "";
    var host = false;
    var username = ""; // This will be the username of the host
    var numberOfPlayers = 0;
    var drawTime = 0;
    var numberOfRounds = 0;

    // takes in room_id and tries to create that room
    // returns ("create-room-fail") if the room already exists
    // on success the socket will create/join the room and emit
    // ("create-room-success") back to the client
    socket.on("create-room", (room) => {
        if (rooms.has(room.roomId)) {
            // room already exists
            io.to(socket.id).emit("create-room-fail", {
                roomId: room.roomId,
                msg: "Room already exists",
            });
        } else {
            // create and join room
            socket.join(room.roomId);

            currentRoom = room.roomId;
            host = true;
            username = room.username;
            numberOfPlayers = room.numberOfPlayers;
            drawTime = room.drawTime;
            numberOfRounds = room.numberOfRounds;

            io.to(socket.id).emit("create-room-success", room);
        }
    });

    // takes in room_id as an argument and tries to join that room
    // - if the user already is in a room, the socket will disconnect the user from
    // said room.
    // - if the Room does not exist the user will not join the room (not implemented yet)
    // - on success the socket will emit ("join-room-success") back to the client to notify it that
    // it has successfully joined a room
    socket.on("join-room", (room) => {
        if (socket.rooms.size > 1) {
            // user is already in a room
            for (let room of socket.rooms) {
                if (!(room === socket.id)) {
                    socket.leave(room); // leave other rooms
                }
            }
        }
        if (rooms.has(room)) {
            // room exists
            socket.join(room);
            currentRoom = room;
            host = false;
            io.to(socket.id).emit("join-room-success", room);
        } else {
            console.log("Room does not exist");
            io.to(socket.id).emit("join-room-fail", {
                room,
                msg: "Room does not exist",
            });
        }
    });

    socket.on("leave-room", (room) => {
        socket.leave(room);
    });

    socket.on("chat-message", (msg) => {
        console.log(
            "Room " + currentRoom + " - " + msg.username + ": " + msg.message
        );
        io.to(currentRoom).emit("chat-message", msg);
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
    console.log(`Room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`Socket ${id} has joined room ${room}`);
});

io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`Socket ${id} has left room ${room}`);
});

server.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);

    friendRequest(app, db);
    market(app, db);
    userProfile(app, db);
    users(app, db, auth);
    wordbank(app, db);
});
