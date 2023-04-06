import io from "socket.io-client";

const backend = "http://localhost:3001";
export const socket = io(backend + "/rooms");
