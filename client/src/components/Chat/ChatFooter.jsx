import React, { useState } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { Button } from "components";
import FormInput from "components/FormInput";
import { Desktop } from "service/mediaQueries";

const StyledChatFooter = styled.form`
    display: flex;
    flex-direction: ${(props) => (props.isDesktop ? "row" : "column")};
    margin: 0.5rem 0;
`;

const StyledChatInput = styled(FormInput)`
    font-size: 1rem;
    margin: ${(props) => (props.isDesktop ? "0 0.5rem 0 0" : "0.5rem 0")};
`;

function ChatFooter(props) {
    const isDesktop = Desktop();
    const { timeLeft, username } = { ...props };
    const [message, setMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit("chat-message", {
                message,
                username: username,
                id: `${socket.id}${Math.random()}`,
                timeLeft: timeLeft,
            });
        }
        setMessage("");
    };

    return (
        <StyledChatFooter isDesktop={isDesktop} onSubmit={handleSendMessage}>
            <StyledChatInput
                isDesktop={isDesktop}
                type="text"
                placeholder="Enter guess here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button noShadow>Send</Button>
        </StyledChatFooter>
    );
}

export default ChatFooter;
