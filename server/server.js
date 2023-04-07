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
    game,
    leaderboard,
} from "./routes/index.js";
import { db } from "./service/firebase.js";
import {
    doc,
    getDocs,
    setDoc,
    addDoc,
    collection,
    query,
    where,
} from "firebase/firestore";

const PORT = process.env.PORT || 3001;
const GAMEHISTORYLENGTH = 10;
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

// Initialize app
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Socket variables
const roomsNamespace = io.of("/rooms");
const rooms = roomsNamespace.adapter.rooms;
const games = [];

function makeGame(
    roomId,
    host,
    hostAvatar,
    socketId,
    numberOfPlayers,
    drawTime,
    numberOfRounds,
    wordbankContent
) {
    let game = {
        roomId: roomId,
        host: host, // username of host
        maxNumPlayers: numberOfPlayers,
        drawTime: drawTime,
        numberOfRounds: numberOfRounds,
        players: [
            {
                username: host,
                isHost: true,
                socketId,
                score: 0,
                hasGuessed: false,
                avatar: hostAvatar,
            },
        ], // stores username of players
        listGuessed: [],
        currentTurn: "",
        currentRound: 0,
        gameOver: false,
        wordBank: wordbankContent,
        currentWord: "",
        addPlayer: function (username, avatar, socketId) {
            if (this.gameOver) return;
            let player = {
                username: username,
                isHost: false,
                socketId,
                score: 0,
                hasGuessed: false,
                avatar: avatar,
            };
            this.players.push(player);
            if (this.currentTurn !== "") {
                this.sendGameData();
            }
        },
        removePlayer: function (username) {
            if (this.gameOver) return;
            let player = this.players.find(
                (player) => player.username == username
            );
            let index = this.players.indexOf(player);
            if (index > -1) {
                // if (this.players.length === 1 && this.currentTurn.length > 0) {
                //     this.endGame();
                //     return;
                // }
                this.players.splice(index, 1);
                if (this.currentTurn === username) {
                    this.nextTurn();
                }
            }
            this.sendGameData();
        },
        startGame: function () {
            if (this.gameOver) return;
            const gameData = {
                players: this.players,
                host: this.host,
                maxNumPlayers: this.maxNumPlayers,
                drawTime: this.drawTime,
                numberOfRounds: this.numberOfRounds,
                currentRound: this.currentRound,
                currentTurn: this.currentTurn,
            };
            roomsNamespace.to(this.roomId).emit("game-start", gameData);

            this.currentTurn = this.players[0].username;
            this.currentRound = 1;
            this.currentWord =
                this.wordBank[Math.floor(Math.random() * this.wordBank.length)];

            this.startTurn();
        },
        startTurn: async function () {
            if (this.gameOver) return;
            // console.log(this);
            // console.log("it is "+this.currentTurn+"'s turn, and the word is "+this.currentWord);
            // send word to the current drawing player
            roomsNamespace
                .to(
                    this.players.find(
                        (player) => player.username == this.currentTurn
                    ).socketId
                )
                .emit("turn-start", this.currentWord);

            // maybe create async function to manage the timer
            let game = this;
            let timeleft = this.drawTime;
            let currentPlayer = game.players.find(
                (player) => player.username == game.currentTurn
            );
            this.sendGameData();
            roomsNamespace.to(this.roomId).emit("chat-message", {
                message:
                    "It is " + currentPlayer.username + "'s turn to draw...",
                username: "GAME",
                id: `${currentPlayer.socketId}${Math.random()}`,
            });
            let gameTimer = setInterval(function () {
                let numberOfGuessers = game.players.length - 1;
                if (timeleft <= 0) {
                    // Award the drawer a percentage of max points based on how many players have not guessed
                    let playersNotGuessed =
                        numberOfGuessers - game.listGuessed.length;
                    let multiplyer = playersNotGuessed / numberOfGuessers;
                    let drawerScore =
                        multiplyer === 1 ? 0 : Math.round(multiplyer * 30) * 10;
                    currentPlayer.score += drawerScore;

                    clearInterval(gameTimer);
                    if (currentPlayer) {
                        roomsNamespace
                            .to(currentPlayer.socketId)
                            .emit("turn-end");
                        game.sendGameData();
                    }
                    timeleft = 0;
                    game.nextTurn();
                } else if (game.listGuessed) {
                    if (game.listGuessed.length == numberOfGuessers) {
                        // Award the drawer max points
                        currentPlayer.score += 300;
                        timeleft = 0;
                    }
                }
                roomsNamespace
                    .to(game.roomId)
                    .emit("timer", timeleft.toString());
                timeleft -= 1;
            }, 1000);
        },
        nextTurn: function () {
            if (this.gameOver) return;
            roomsNamespace.to(this.roomId).emit("clear-canvas");
            const currentPlayer = this.players.find(
                (player) => player.username == this.currentTurn
            );
            const index = this.players.indexOf(currentPlayer) + 1;
            if (index >= this.players.length) {
                // next round or end of game
                this.currentRound += 1;
                if (this.currentRound > numberOfRounds) {
                    // end of game
                    this.endGame();
                    return;
                }
                // new round
                if (this.players.length > 0) {
                    this.currentTurn = this.players[0].username;
                } else {
                    return;
                }
            } else {
                this.currentTurn = this.players[index].username;
            }
            this.players.map(function (x) {
                // set all players hasGuessed to false so that they may earn points again
                x.hasGuessed = false;
            });
            this.listGuessed = [];
            // select new word
            this.currentWord =
                this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
            this.startTurn();
        },
        addPoints: function (username, timeLeft) {
            if (this.gameOver) return;
            // award guesser
            let guesserScore = Math.floor(10 * (timeLeft / this.drawTime)) * 100;
            this.players.find((player) => player.username == username).score +=
                guesserScore;
            console.log(`Player ${username} awarded ${guesserScore} points.`);
            this.sendGameData();
        },
        sendGameData: function () {
            if (this.gameOver) return;
            const gameData = {
                players: this.players,
                host: this.host,
                maxNumPlayers: this.maxNumPlayers,
                drawTime: this.drawTime,
                numberOfRounds: this.numberOfRounds,
                currentRound: this.currentRound,
                currentTurn: this.currentTurn,
            };
            roomsNamespace.to(this.roomId).emit("game-data", gameData);
        },
        endGame: async function () {
            this.gameOver = true;
            this.sendGameData();
            roomsNamespace.to(this.roomId).emit("game-over");
            roomsNamespace.to(this.roomId).emit("chat-message", {
                message: "Game over.",
                username: "GAME",
                id: `${this.currentTurn.socketId}${Math.random()}`,
            });

            const index = games.indexOf(this);
            games.splice(index, 1);
            if (this.players.length < 2) {
                // if game only has 1 player then dont count it
                return;
            }
            const docRef = await addDoc(collection(db, "games"), {});
            // sort players by score
            const sortedPlayers = this.players.sort(
                (a, b) => b.score - a.score
            );
            var gamedocPlayers = []; // only registered players will show up in the game history
            for (const [i, player] of sortedPlayers.entries()) {
                // update player scores in the db
                const q = query(
                    collection(db, "profiles"),
                    where("username", "==", player.username)
                );
                const querySnapshot = await getDocs(q);
                if (querySnapshot.empty) {
                    // player is a guest
                    gamedocPlayers.push({
                        username: player.username + " (guest)",
                        score: player.score,
                    });
                } else {
                    gamedocPlayers.push({
                        username: player.username,
                        score: player.score,
                    });
                }

                querySnapshot.forEach((docSnapshot) => {
                    // get doc of each registered player
                    // doc.data() is never undefined for query doc snapshots
                    let profileData = docSnapshot.data();
                    profileData.currency += player.score;
                    if (i === 0) {
                        profileData.win += 1;
                    } else {
                        profileData.loss += 1;
                    }

                    profileData.gamehistory.unshift(docRef.id);
                    profileData.gamehistory = profileData.gamehistory.slice(
                        0,
                        GAMEHISTORYLENGTH
                    );

                    const id = profileData.id;
                    const profileDocRef = doc(db, "profiles", id);

                    setDoc(profileDocRef, profileData, { merge: true });
                });
            }
            // create game doc object to save in the db
            const gamedocObj = {
                winner: gamedocPlayers[0].username,
                players: gamedocPlayers,
                room: this.roomId,
            };
            // const res = await collection(db, "games").add(gamedocObj);
            // const docRef = await addDoc(collection(db, "games"), gamedocObj);
            await setDoc(doc(db, "games", docRef.id), gamedocObj);
            console.log("Added game to db with ID: ", docRef.id);
        },
    };
    return game;
}

// Socket functions
roomsNamespace.on("connection", async (socket) => {
    // console.log("A user connected with id: " + socket.id);
    let currentRoom = "";
    let host;
    let username = ""; // This will be the username of the host
    let player = {};
    let game = {};

    // takes in room_id and tries to create that room
    // returns ("create-room-fail") if the room already exists
    // on success the socket will create/join the room and emit
    // ("create-room-success") back to the client
    socket.on("create-room", (room) => {
        if (rooms.has(room.roomId)) {
            // room already exists
            roomsNamespace.to(socket.id).emit("create-room-fail", {
                roomId: room.roomId,
                msg: "Room already exists",
            });
        } else {
            // create and join room
            socket.join(room.roomId);
            console.log(`Room ${room.roomId} was created`);

            currentRoom = room.roomId;
            host = true;
            username = room.username;
            // numberOfPlayers = room.numberOfPlayers;
            // drawTime = room.drawTime;
            // numberOfRounds = room.numberOfRounds;

            game = makeGame(
                room.roomId,
                room.username,
                room.avatar,
                socket.id,
                room.numberOfPlayers,
                room.drawTime,
                room.numberOfRounds,
                room.wordbankContent
            );
            games.push(game);

            player = game.players.find((player) => player.username == username);

            roomsNamespace.to(socket.id).emit("create-room-success", room);
            roomsNamespace.to(socket.id).emit("players-data", game.players);
        }
    });

    // takes in room_id as an argument and tries to join that room
    // - if the user already is in a room, the socket will disconnect the user from
    // said room.
    // - if the Room does not exist the user will not join the room (not implemented yet)
    // - on success the socket will emit ("join-room-success") back to the client to notify it that
    // it has successfully joined a room
    socket.on("join-room", (room) => {
        let roomId = room.roomId.toLowerCase();
        if (socket.rooms.size > 1) {
            // user is already in a room
            for (let room of socket.rooms) {
                if (!(room === socket.id)) {
                    socket.leave(room); // leave other rooms
                }
            }
        }
        if (rooms.has(roomId)) {
            game = games.find((game) => game.roomId == roomId);
            if (game.gameOver) {
                roomsNamespace.to(socket.id).emit("join-room-fail", {
                    room,
                    msg: "Game is over",
                });
                return;
            } else if (game.players.length >= game.maxNumPlayers) {
                // game is full
                roomsNamespace.to(socket.id).emit("join-room-fail", {
                    room,
                    msg: "Room is full",
                });
                return;
            }
            // room exists
            socket.join(roomId);
            console.log(`Socket ${socket.id} has joined room ${room.roomId}`);

            currentRoom = roomId;
            host = false;
            username = room.username;
            game.addPlayer(room.username, room.avatar, socket.id);

            player = game.players.find((player) => player.username == username);

            roomsNamespace.to(roomId).emit("chat-message", {
                message: username + " has joined the game.",
                username: "GAME",
                id: `${socket.id}${Math.random()}`,
            });

            roomsNamespace.to(socket.id).emit("join-room-success", room.roomId);
            roomsNamespace.to(roomId).emit("players-data", game.players);
        } else {
            console.log("Room does not exist");
            roomsNamespace.to(socket.id).emit("join-room-fail", {
                room,
                msg: "Room does not exist",
            });
        }
    });

    socket.on("leave-room", (room) => {
        console.log(`Socket ${socket.id} has left room ${room.roomId}`);
        socket.leave(room);
        roomsNamespace.to(room).emit("chat-message", {
            message: username + " has left the game.",
            username: "GAME",
            id: `${socket.id}${Math.random()}`,
        });
        if (Object.keys(game).length > 0) {
            game.removePlayer(username);
            game = {};
            currentRoom = "";
            host = false;
        }
        roomsNamespace.to(room).emit("players-data", game.players);
    });

    socket.on("kick-player", async (username) => {
        const socket_id = game.players.find(
            (player) => player.username == username
        ).socketId;
        var sockets = await io.in(game.roomID).fetchSockets();
        roomsNamespace.to(socket_id).emit("kick-player", game.roomId);
    });

    socket.on("get-players-data", (data) => {
        roomsNamespace.to(socket.id).emit("players-data", game.players);
    });

    socket.on("start-game", (data) => {
        if (username == game.host) {
            game.startGame();
        }
    });

    socket.on("chat-message", (msg) => {
        let canGuess =
            !game.gameOver &&
            game.currentRound > 0 &&
            player.hasGuessed == false &&
            !(game.currentTurn == username);
        if (canGuess) {
            if (msg.message.toLowerCase() == game.currentWord.toLowerCase()) {
                // current word is guessed
                // get the time left from message data
                let timeLeft = parseInt(msg.timeLeft);
                game.addPoints(username, timeLeft);
                player.hasGuessed = true;
                game.listGuessed.push(username);
                roomsNamespace.to(currentRoom).emit("chat-message", {
                    message: username + " has guessed the word!",
                    username: "GAME",
                    id: `${socket.id}${Math.random()}`,
                });
                return;
            }
        }
        roomsNamespace.to(currentRoom).emit("chat-message", msg);
    });

    socket.on("draw", (data) => {
        if (username == game.currentTurn) {
            roomsNamespace.to(currentRoom).emit("draw", data);
        }
    });

    socket.on("clear-canvas", (data) => {
        if (username == game.currentTurn) {
            roomsNamespace.to(currentRoom).emit("clear-canvas", data);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} has left room ${currentRoom}`);
        socket.leave(currentRoom);
        roomsNamespace.to(currentRoom).emit("chat-message", {
            message: username + " has left the game.",
            username: "GAME",
            id: `${socket.id}${Math.random()}`,
        });
        // console.log(socket.id + " with username " + username + " disconnected");
        if (Object.keys(game).length > 0) {
            game.removePlayer(username);
        }
        roomsNamespace.to(currentRoom).emit("players-data", game.players);
    });
});

server.listen(PORT, () => {
    console.log(`Server started listening on port ${PORT}`);

    friendRequest(app);
    market(app);
    userProfile(app);
    users(app);
    wordbank(app);
    game(app);
    leaderboard(app);
});
