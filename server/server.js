import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

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

    socket.on("join room", (room) => {
        socket.join(room);
        console.log(socket.id + " joined room: " + room);
    });

    socket.on("chat message", (msg) => {
        for (let room of socket.rooms) {
            if (!(room === socket.id)) {
                console.log("Room " + room + ": " + msg.message);
                io.to(room).emit("chat message", msg);
            }
        }
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
        console.log("user disconnected");
    });
});

server.listen(3001, () => {
    console.log("listening on *:3001");
});
