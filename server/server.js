import express from "express";
import http from "http";
import cors from "cors";
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
app.use(express.json());
app.use(cors());

// Socket variables
const rooms = io.of("/").adapter.rooms;
const games = [];

function makeGame(roomId, host, socketId, numberOfPlayers, drawTime, numberOfRounds) {
    var game = {
        'roomId': roomId,
        'host': host, // username of host
        'maxNumPlayers': numberOfPlayers,
        'drawTime': drawTime,
        'numberOfRounds': numberOfRounds,
        'players': [{
            'username': host,
            socketId,
            'score': 0,
            'hasGuessed': false,
        }], // stores username of players
        'currentTurn': host,
        'currentRound': 0,
        'gameOver': false,
        'wordBank': ['banana', 'peach', 'orange'],
        'currentWord': '',
        'addPlayer': function(username, socketId) {
            let player = {
                'username': username,
                socketId,
                'score': 0,
                'hasGuessed': false,
            };
            this.players.push(player);
        },
        'removePlayer': function(username) {
            let player = this.players.find(player => player.username == username);
            let index = this.players.indexOf(player);
            if (index > -1) {
                this.players.splice(index,1);
                if (this.currentTurn == username) {
                    this.nextTurn();
                }
            }
        },
        'startGame': function() {
            this.currentTurn = this.players[0].username;
            this.currentRound = 1;
            this.currentWord = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
            this.startTurn();
        },
        'startTurn': async function () {
            console.log(this);
            console.log("it is "+this.currentTurn+"'s turn, and the word is "+this.currentWord);
            // send word to the current drawing player
            io.to(this.players.find(player => player.username == this.currentTurn).socketId).emit("turn-start", this.currentWord);

            // maybe create async function to manage the timer
            var game = this;
            var timeleft = this.drawTime;
            var gameTimer = setInterval(function() {
                if(timeleft <= 0){
                    clearInterval(gameTimer);
                    io.to(game.players.find(player => player.username == game.currentTurn).socketId).emit("turn-end");
                    game.nextTurn();
                }
                io.to(game.roomId).emit("timer", timeleft.toString());
                console.log(timeleft);
                timeleft -= 1;
            }, 1000);
        },
        'nextTurn': function() {
            io.to(this.roomId).emit("clear-canvas");
            let currentPlayer = this.players.find(player => player.username == this.currentTurn);
            let index = this.players.indexOf(currentPlayer) + 1;
            if (index >= this.players.length) { // next round or end of game
                this.currentRound += 1;
                if (this.currentRound > numberOfRounds) { // end of game
                    this.gameOver = true;
                    console.log("game over");
                    io.to(this.roomId).emit("game-over");
                    return;
                }
                // new round
                this.currentTurn = this.players[0].username;
            } else {
                this.currentTurn = this.players[index].username;
            }
            this.players.map(function(x) { // set all players hasGuessed to false so that they may earn points again
                x.hasGuessed = false;
            });
            // select new word
            this.currentWord = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
            this.startTurn();
        },
        'addPoints': function(username, points) {
            this.players.find(player => player.username == username).score += points;
        }
    };
    return game;
}

// Socket functions
io.on("connection", async (socket) => {
    console.log("A user connected with id: " + socket.id);
    var currentRoom = "";
    var host;
    var username = ""; // This will be the username of the host
    var player = {};
    // var numberOfPlayers = 0;
    // var drawTime = 0;
    // var numberOfRounds = 0;
    var game = {};

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
            // numberOfPlayers = room.numberOfPlayers;
            // drawTime = room.drawTime;
            // numberOfRounds = room.numberOfRounds;

            game = makeGame(room.roomId, room.username, socket.id, room.numberOfPlayers, room.drawTime, room.numberOfRounds);
            games.push(game);

            player = game.players.find(player => player.username == username);

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
        if (rooms.has(room.roomId)) {
            game = games.find(game => game.roomId == room.roomId);
            if (game.players.length >= game.maxNumPlayers) { // game is full
                io.to(socket.id).emit("join-room-fail", {
                    room,
                    msg: "Room is full",
                });
                return;
            }
            // room exists
            socket.join(room.roomId);

            currentRoom = room.roomId;
            host = false;
            username = room.username;
            game.addPlayer(room.username, socket.id);

            player = game.players.find(player => player.username == username);

            game.startGame(); // ---------------------- this is temporary for testing --------------------------

            io.to(room.roomId).emit("chat-message", {
                "message": "has joined the game.",
                username: username,
                id: `${socket.id}${Math.random()}`,
            });

            io.to(socket.id).emit("join-room-success", room.roomId);
        } else {
            // console.log("Room does not exist");
            io.to(socket.id).emit("join-room-fail", {
                room,
                msg: "Room does not exist",
            });
        }
    });

    socket.on("leave-room", (room) => {
        socket.leave(room);
        io.to(room).emit("chat-message", {
            "message": "has left the game.",
            username: username,
            id: `${socket.id}${Math.random()}`,
        });
        if (Object.keys(game).length > 0) {
            game.removePlayer(username);
            game = {};
            currentRoom = "";
            host = false;
        }
    });

    socket.on("start-game", data => {
        if (username == game.host) {
            game.startGame();
        }
    })

    socket.on("chat-message", (msg) => {
        // console.log("Room " + currentRoom + " - " + msg.username + ": " + msg.message);
        io.to(currentRoom).emit("chat-message", msg);
        let canGuess = ((!game.gameOver) && (game.currentRound > 0)) && ((player.hasGuessed == false) && !(game.currentTurn == username));
        if (canGuess) {
            if (msg.message.toLowerCase() == game.currentWord.toLowerCase()) { // current word is guessed
                game.addPoints(username, 50); // add 50 points as a placeholder
                player.hasGuessed = true;
            }
        }
    });

    socket.on("draw", (data) => {
        if (username == game.currentTurn) {
            io.to(currentRoom).emit("draw", data);
        }
    });

    socket.on("clear-canvas", (data) => {
        io.to(currentRoom).emit("clear-canvas", data);
    });

    socket.on("disconnect", () => {
        socket.leave(currentRoom);
        io.to(currentRoom).emit("chat-message", {
            "message": "has left the game.",
            username: username,
            id: `${socket.id}${Math.random()}`,
        });
        console.log(socket.id + " with username " + username + " disconnected");
        if (Object.keys(game).length > 0) {
            game.removePlayer(username);
        }
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
