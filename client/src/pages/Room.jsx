import React from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

import { Canvas, Chat, Container, FlexContainer, Header } from "components";

const socket = io();

function Room() {
    const { chatId } = useParams();
    const username = localStorage.getItem("nickname");

    var room = chatId;
    socket.room = room;
    socket.emit("join room", room);

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    <Canvas socket={socket}></Canvas>
                    <Chat roomId={room} socket={socket} username={username} />
                </FlexContainer>
            </Container>
        </>
    );
}

export default Room;
