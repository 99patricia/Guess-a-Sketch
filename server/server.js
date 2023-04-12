/**
 * Satisfies:
 * FR9 - Award.Guesser.Points
 * FR10 - Award.Drawer.Points
 * FR12 - Draw.Canvas
 * FR14 - Clean.Canvas
 * FR15 - Save.PlayerData
 * FR17 - Create.Lobby
 * FR18 - Chat.Lobby
 * FR19 - Permission.Host
 */
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";
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
const io = new Server(server, {
    cors: corsOptions,
    connectionStateRecovery: {
        // the backup duration of the sessions and the packets
        maxDisconnectionDuration: 60 * 1000,
        // whether to skip middlewares upon successful recovery
        skipMiddlewares: true,
    },
    // ping every 2 seconds
    pingInterval: 2000,
});
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Socket variables
const roomsNamespace = io.of("/rooms");
const rooms = roomsNamespace.adapter.rooms;
const games = [];

import { SessionStore } from "./sessionStore.js";
const sessionStore = new SessionStore();
const randomId = () => crypto.randomBytes(8).toString("hex");

function makeGame(
    roomId,
    host,
    hostID,
    hostAvatar,
    socketId,
    numberOfPlayers,
    drawTime,
    numberOfRounds,
    wordbankContent
) {
    let game = {
        roomId: roomId,
        host: hostID, // username of host
        maxNumPlayers: numberOfPlayers,
        drawTime: drawTime,
        numberOfRounds: numberOfRounds,
        players: [
            {
                username: host,
                userID: hostID,
                isHost: true,
                socketId,
                score: 0,
                turnScore: 0,
                hasGuessed: false,
                avatar: hostAvatar,
            },
        ], // stores username of players
        listGuessed: [],
        currentTurn: "",
        currentRound: 0,
        gameOver: false,
        gameStarted: false,
        wordBank: wordbankContent,
        currentWord: "",
        addPlayer: function (username, userID, avatar, socketId) {
            if (this.gameOver) return;
            let player = {
                username: username,
                userID: userID,
                isHost: false,
                socketId,
                score: 0,
                turnScore: 0,
                hasGuessed: false,
                avatar: avatar,
            };
            this.players.push(player);
            if (this.gameStarted) {
                this.sendGameData();
            }
        },
        removePlayer: function (userID) {
            if (this.gameOver) return;
            let player = this.players.find((player) => player.userID == userID);

            let i = this.listGuessed.indexOf(userID);
            if (i > -1) {
                this.listGuessed.splice(i, 1);
            }
            let index = this.players.indexOf(player);

            // Move host privileges to next user
            if (index > -1) {
                if (player.isHost) {
                    if (this.players.at(index + 1)) {
                        let nextPlayer = this.players.at(index + 1);

                        player.isHost = false;
                        nextPlayer.isHost = true;
                        this.host = nextPlayer.userID;
                    }
                }
                // if (this.players.length === 1 && this.currentTurn.length > 0) {
                //     this.endGame();
                //     return;
                // }
                this.players.splice(index, 1);
                if (this.currentTurn === userID) {
                    this.nextTurn(index);
                }
            }
            this.sendGameData();
        },
        startGame: function () {
            if (this.gameOver) return;
            this.gameStarted = true;
            const gameData = {
                players: this.players,
                host: this.host,
                maxNumPlayers: this.maxNumPlayers,
                drawTime: this.drawTime,
                numberOfRounds: this.numberOfRounds,
                currentRound: this.currentRound,
                currentTurn: this.currentTurn,
                gameOver: this.gameOver,
                gameStarted: this.gameStarted,
            };
            roomsNamespace.to(this.roomId).emit("game-start", gameData);

            this.currentTurn = this.players[0].userID;
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
                        (player) => player.userID == this.currentTurn
                    ).socketId
                )
                .emit("turn-start", this.currentWord);

            // Emit new turn to room for clearing score card
            roomsNamespace.to(this.roomId).emit("turn-start-all");

            // maybe create async function to manage the timer
            let disconnected = false;
            let game = this;
            let timeleft = this.drawTime;
            let currentPlayer = game.players.find(
                (player) => player.userID == game.currentTurn
            );
            this.sendGameData();
            roomsNamespace.to(this.roomId).emit("chat-message", {
                message:
                    "It is " + currentPlayer.username + "'s turn to draw...",
                username: "GAME",
                id: `${currentPlayer.socketId}${Math.random()}`,
            });
            let gameTimer = setInterval(function () {
                if (disconnected) {
                    return;
                }
                if (currentPlayer.userID !== game.currentTurn) {
                    timeleft = 0;
                    disconnected = true;
                    return;
                }
                let numberOfGuessers = game.players.length - 1;
                if (timeleft <= 0) {
                    // Award the drawer a percentage of max points based on how many players have not guessed
                    let playersNotGuessed =
                        numberOfGuessers - game.listGuessed.length;
                    let multiplyer = playersNotGuessed / numberOfGuessers;
                    let drawerScore =
                        multiplyer === 1 ? 0 : Math.round(multiplyer * 30) * 10;
                    currentPlayer.turnScore += drawerScore;
                    currentPlayer.score += drawerScore;

                    clearInterval(gameTimer);
                    if (currentPlayer) {
                        roomsNamespace
                            .to(currentPlayer.socketId)
                            .emit("turn-end");
                        game.sendGameData();
                    }

                    timeleft = 0;
                    let index = game.players.indexOf(currentPlayer);
                    game.nextTurn(index + 1);
                } else if (game.listGuessed) {
                    if (game.listGuessed.length == numberOfGuessers) {
                        // Award the drawer max points
                        currentPlayer.score += 300;
                        currentPlayer.turnScore += 300;
                        timeleft = 0;
                    }
                }
                roomsNamespace
                    .to(game.roomId)
                    .emit("timer", timeleft.toString());
                timeleft -= 1;
            }, 1000);
        },
        nextTurn: function (index) {
            // Emit to all players for displaying score card
            roomsNamespace.to(this.roomId).emit("turn-end-all", {
                prevWord: game.currentWord,
                players: game.players,
            });

            if (this.gameOver) return;
            roomsNamespace.to(this.roomId).emit("clear-canvas");
            if (index >= this.players.length) {
                // next round or end of game
                this.currentRound += 1;
                if (this.currentRound > numberOfRounds) {
                    // end of game
                    // delay for 5 seconds before ending game
                    setTimeout(() => {
                        this.endGame();
                    }, 5000);
                    return;
                }
                // new round
                if (this.players.length > 0) {
                    this.currentTurn = this.players[0].userID;
                } else {
                    return;
                }
            } else {
                this.currentTurn = this.players[index].userID;
            }
            this.players.map(function (x) {
                // set all players hasGuessed to false so that they may earn points again
                // set all players turnScore back to 0
                x.hasGuessed = false;
                x.turnScore = 0;
            });
            this.listGuessed = [];
            // select new word
            this.currentWord =
                this.wordBank[Math.floor(Math.random() * this.wordBank.length)];

            // delay for 5 seconds before starting next turn
            setTimeout(() => {
                this.startTurn();
            }, 5000);
        },
        addPoints: function (userID, timeLeft) {
            if (this.gameOver) return;
            // award guesser
            let guesserScore =
                Math.floor(10 * (timeLeft / this.drawTime)) * 100;
            let player = this.players.find((player) => player.userID == userID);
            player.turnScore += guesserScore;
            player.score += guesserScore;

            console.log(
                `Player ${player.username} awarded ${guesserScore} points.`
            );
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
                gameOver: this.gameOver,
                gameStarted: this.gameStarted,
            };
            roomsNamespace.to(this.roomId).emit("game-data", gameData);
        },
        endGame: async function () {
            this.gameOver = true;
            this.sendGameData();
            roomsNamespace.to(this.roomId).emit("game-over");
            // roomsNamespace.to(this.roomId).emit("chat-message", {
            //     message: "Game over.",
            //     username: "GAME",
            //     id: `${this.currentTurn.socketId}${Math.random()}`,
            // });

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

roomsNamespace.use((socket, next) => {
    const sessionId = socket.handshake.auth.sessionID;
    const username = socket.handshake.auth.username;
    console.log(sessionStore.findAllSessions());
    if (sessionId) {
        // finds an existing session if it exists
        const session = sessionStore.findSession(sessionId);
        if (session) {
            socket.sessionID = sessionId;
            socket.userID = session.userID;
            socket.username = username;
            socket.roomId = session.roomId;
            socket.game = games.find((game) => game.roomId == socket.roomId);
            if (socket.game) {
                socket.player = socket.game.players.find(
                    (player) => player.userID == socket.userID
                );
                socket.player.socketId = socket.id;
                socket.join(socket.roomId);
            } else {
                socket.players = {};
            }
            return next();
        }
    }
    socket.sessionID = randomId();
    socket.userID = randomId();
    socket.username = username;
    socket.roomId = "";
    socket.game = {};
    socket.player = {};
    next();
});

// Socket functions
roomsNamespace.on("connection", async (socket) => {
    // console.log("A user connected with id: " + socket.id);

    let currentRoom = socket.roomId;
    let host = false;
    let username = socket.username; // This will be the username of the host
    let player = socket.player;
    let game = socket.game;

    sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
        roomId: socket.roomId,
    });

    socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
    });

    if (game?.currentTurn === socket.userID) {
        setTimeout(() => {
            roomsNamespace.to(socket.id).emit("turn-start", game.currentWord);
        }, 200);
    }

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
            console.log(`Room ${room.roomId} was created by ${socket.id}`);

            currentRoom = room.roomId;
            host = true;
            username = socket.username;
            // numberOfPlayers = room.numberOfPlayers;
            // drawTime = room.drawTime;
            // numberOfRounds = room.numberOfRounds;

            game = makeGame(
                room.roomId,
                socket.username,
                socket.userID,
                room.avatar,
                socket.id,
                room.numberOfPlayers,
                room.drawTime,
                room.numberOfRounds,
                room.wordbankContent
            );
            games.push(game);

            player = game.players.find(
                (player) => player.userID == socket.userID
            );

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
        if (roomId === socket.roomId) {
            console.log(
                `reconnecting user ${socket.username} to room ${socket.roomId}...`
            );
            roomsNamespace.to(socket.id).emit("join-room-success", room.roomId);
            if (game?.currentTurn === socket.userID) {
                setTimeout(() => {
                    roomsNamespace
                        .to(socket.id)
                        .emit("turn-start", game.currentWord);
                }, 200);
            }
            return;
        }
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
            if (game === undefined) {
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
            game.addPlayer(
                socket.username,
                socket.userID,
                room.avatar,
                socket.id
            );

            player = game.players.find(
                (player) => player.userID == socket.userID
            );

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
        console.log(`Socket ${socket.id} has left room ${room}`);
        socket.leave(room);
        roomsNamespace.to(room).emit("chat-message", {
            message: username + " has left the game.",
            username: "GAME",
            id: `${socket.id}${Math.random()}`,
        });
        if (Object.keys(game).length > 0) {
            game.removePlayer(socket.userID);
            currentRoom = "";
            host = false;
        }
        roomsNamespace.to(room).emit("players-data", game.players);
        game = {};
    });

    socket.on("kick-player", async (userID) => {
        const socket_id = game.players.find(
            (player) => player.userID == userID
        ).socketId;
        roomsNamespace.to(socket_id).emit("kick-player", game.roomId);
    });

    socket.on("get-players-data", () => {
        roomsNamespace.to(socket.id).emit("players-data", game.players);
    });

    socket.on("get-game-data", () => {
        if (game.gameStarted) {
            game.sendGameData();
        }
    });

    socket.on("start-game", () => {
        if (socket.userID == game.host) {
            game.startGame();
        }
    });

    socket.on("chat-message", (msg) => {
        let canGuess =
            !game.gameOver &&
            game.currentRound > 0 &&
            player.hasGuessed == false &&
            !(game.currentTurn == socket.userID);
        if (canGuess) {
            if (msg.message.toLowerCase() == game.currentWord.toLowerCase()) {
                // current word is guessed
                // get the time left from message data
                let timeLeft = parseInt(msg.timeLeft);
                player.hasGuessed = true;
                game.addPoints(socket.userID, timeLeft);
                game.listGuessed.push(socket.userID);
                roomsNamespace.to(currentRoom).emit("chat-message", {
                    message: username + " has guessed the word!",
                    username: "GAME",
                    id: `${socket.id}${Math.random()}`,
                    guessed: true,
                });
                return;
            }
        }
        roomsNamespace.to(currentRoom).emit("chat-message", msg);
    });

    socket.on("draw", (data) => {
        if (socket.userID == game.currentTurn) {
            roomsNamespace.to(currentRoom).emit("draw", data);
        }
    });

    socket.on("clear-canvas", (data) => {
        if (socket.userID == game.currentTurn) {
            roomsNamespace.to(currentRoom).emit("clear-canvas", data);
        }
    });

    socket.on("connect", () => {
        console.log(`Socket ${socket.id} connected`);
    });

    socket.on("disconnect", () => {
        sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: false,
            roomId: currentRoom,
        });
        setTimeout(() => {
            const session = sessionStore.findSession(socket.sessionID);
            if (session?.connected == true) {
                // client has reconnected, do not leave game
                return;
            }
            console.log(
                `Socket ${socket.id} disconnected or has left room ${currentRoom}`
            );
            socket.leave(currentRoom);
            roomsNamespace.to(currentRoom).emit("chat-message", {
                message: username + " has left the game.",
                username: "GAME",
                id: `${socket.id}${Math.random()}`,
            });

            if (Object.keys(game).length > 0) {
                game.removePlayer(socket.userID);
            }
            sessionStore.removeSession(socket.sessionID);
            roomsNamespace.to(currentRoom).emit("players-data", game.players);
        }, 5000);
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
