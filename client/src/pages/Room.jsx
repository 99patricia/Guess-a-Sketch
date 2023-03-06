import React from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

import { Canvas, Chat, FlexContainer, Header } from "components";

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
        <>
            <Header />
            <FlexContainer>
                <div className="flex row center">
                    <Canvas></Canvas>
                    <Chat>
                        <ul id="messages"></ul>
                        <form id="form" action="">
                            <input id="input" autoComplete="off" />
                            <button>Send</button>
                        </form>
                    </Chat>
                </div>
            </FlexContainer>
        </>
    );
}

export default Room;
