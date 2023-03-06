import React from "react";
import Header from "../components/Header.js";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io();

function Room() {
    const { chatId } = useParams();

    var room = chatId;
    socket.room = room;
    socket.emit("join room", room);

    window.addEventListener("load", () => {
        var messages = document.getElementById("messages");
        var form = document.getElementById("form");
        var input = document.getElementById("input");

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            if (input.value) {
                socket.emit("chat message", input.value);
                input.value = "";
            }
        });

        socket.on("chat message", function (msg) {
            var item = document.createElement("li");
            item.textContent = msg;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    });

    return (
        <div className="Room">
            <Header />
            <p>ID: {chatId}</p>
            <h2 id="header"></h2>
            <ul id="messages"></ul>
            <form id="form" action="">
                <input id="input" autoComplete="off" />
                <button>Send</button>
            </form>
        </div>
    );
}

export default Room;
