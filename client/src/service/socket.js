import io from "socket.io-client";

const backend = "http://localhost:3001";
export const socket = io(backend + "/rooms", {
    autoConnect: false,
});

socket.on("connect", () => {
    console.log(`${socket.id} connected`);
});

socket.on("disconnect", () => {
    window.alert(`${socket.id} disconnected`);
});
