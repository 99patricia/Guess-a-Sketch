import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { ChatBody, ChatFooter } from "components/Chat/";

const StyledChat = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const StyledRoomCode = styled.div`
    text-align: center;
    text-transform: uppercase;
    font-size: 1.2rem;

    div.code {
        font-size: 1.8rem;
        line-height: 2rem;
        color: var(--secondary);
    }
`;

function Chat(props) {
    const { roomId, username } = { ...props };
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("chat-message", (msg) => {
            // Append existing message with incoming message
            setMessages([...messages, msg]);
        });
    }, [messages]);

    return (
        <StyledChat>
            <StyledRoomCode>
                Room code:
                <div className="code">{roomId}</div>
            </StyledRoomCode>
            <div>
                <ChatBody messages={messages} />
                <ChatFooter username={username} />
            </div>
        </StyledChat>
    );
}

export default Chat;
