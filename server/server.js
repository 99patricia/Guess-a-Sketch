import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rooms = io.of("/").adapter.rooms;
const sids = io.of("/").adapter.sids;

// Firebase init
import { initializeApp } from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfdLDNlu0qvGBkPNfyow-YcbZqhavQbK4",
  authDomain: "ece493-capstone.firebaseapp.com",
  projectId: "ece493-capstone",
  storageBucket: "ece493-capstone.appspot.com",
  messagingSenderId: "388992282247",
  appId: "1:388992282247:web:637b6e6d917685772b5222",
  measurementId: "G-ESJEZ56XLP"
};

const FirebaseApp = initializeApp(firebaseConfig);



app.get('/', (req, res) => {
  res.send('Home Page. Open /chat/chatId')
});

app.get('/chat/:chatId', (req, res) => {
  res.sendFile(__dirname + "/views/example_index.html");
});

io.on('connection', async (socket) => {

  console.log('a user connected with id: ' + socket.id);

  socket.on('join room', (room) => {
      // console.log(socket.id + ' joined room ' + room);
      socket.join(room);
      console.log(socket.id + "joined room: " + room);
  });

  socket.on('chat message', (msg) => {
      for (let room of socket.rooms) {
        if (! (room === socket.id)) {
          console.log('Room '+room+': '+msg);
          io.to(room).emit('chat message', msg);
        }
      }
  });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});