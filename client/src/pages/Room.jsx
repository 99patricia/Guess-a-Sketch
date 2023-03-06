import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

import { Canvas, Container, FlexContainer, Header } from "components";
import { ChatBody, ChatContainer, ChatFooter } from "components/Chat/";

const socket = io();

function Room() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);

    var room = chatId;
    socket.room = room;
    socket.emit("join room", room);

    useEffect(() => {
        socket.on("chat message", (msg) => {
            // Append existing message with incoming message
            setMessages([...messages, msg]);
        });
    }, [messages]);

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    <Canvas></Canvas>
                    <ChatContainer roomId={room}>
                        <ChatBody messages={messages} />
                        <ChatFooter socket={socket} />
                    </ChatContainer>
                </FlexContainer>
            </Container>
        </>
    );
}

export default Room;
