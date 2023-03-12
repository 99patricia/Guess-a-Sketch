import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// firestore dependencies
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCfdLDNlu0qvGBkPNfyow-YcbZqhavQbK4",
    authDomain: "ece493-capstone.firebaseapp.com",
    projectId: "ece493-capstone",
    storageBucket: "ece493-capstone.appspot.com",
    messagingSenderId: "388992282247",
    appId: "1:388992282247:web:637b6e6d917685772b5222",
    measurementId: "G-ESJEZ56XLP"
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

// app.get("/chat/:chatId", (req, res) => {
//     res.sendFile(__dirname + "/views/example_index.html");
// });

io.on("connection", async (socket) => {
    console.log("a user connected with id: " + socket.id);
    var auth = false;
    var currentRoom = socket.id;
    var username = "";

    socket.on('create-room', (room) => {
        if (io.sockets.adapter.rooms[room]) { // room already exists
            
        }
    });

    // takes in room_id as an argument and tries to join that room
    // - if the user already is in a room, the socket will disconnect the user from
    // said room.
    // - if the room does not exist the user will not join the room (not implemented yet)
    // - on success the socket will emit ("joined-room") back to the client to notify it that
    // it has successfully joined a room
    socket.on("join room", (room) => {
        if (socket.rooms.size>1) { // user is already in a room
            for (let room of socket.rooms) {
                if (!(room === socket.id)) {
                    socket.leave(room) // leave other rooms
                }
            }
        }
        if (io.sockets.adapter.rooms[room]) { // room exists
            currentRoom = room;
            socket.join(room);
            socket.to(socket.id).emit("joined-room", room)
        } else {
            console.log("room does not exist")
            currentRoom = room;
            socket.join(room);
            socket.to(socket.id).emit("joined-room", room)
        }
    });

    socket.on("leave-room", (room) => {
        socket.leave(room)
    });

    socket.on("chat message", (msg) => {
        // for (let room of socket.rooms) {
        //     if (!(room === socket.id)) {
        //         console.log("Room " + room + " - " + msg.username + ": " + msg.message);
        //         io.to(room).emit("chat message", msg);
        //     }
        // }
        console.log("Room " + currentRoom + " - " + msg.username + ": " + msg.message);
        io.to(currentRoom).emit("chat message", msg);
    });

    socket.on("draw", (data) => {
        for (let room of socket.rooms) {
            if (!(room === socket.id)) {
                io.to(room).emit("draw", data);
            }
        }
    });

    socket.on("clear-canvas", (data) => {
        for (let room of socket.rooms) {
            if (!(room === socket.id)) {
                io.to(room).emit("clear-canvas", data);
            }
        }
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
