import React, { useState } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { Button } from "components";
import FormInput from "components/FormInput";

const StyledChatFooter = styled.form`
    display: flex;
    margin: 0.5rem 0;
`;

const StyledChatInput = styled(FormInput)`
    font-size: 1rem;
    margin: 0 0.5rem 0 0;
`;

function ChatFooter(props) {
    const username = props.username;
    const [message, setMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit("chat message", {
                message,
                username: username,
                id: `${socket.id}`,
            });
        }
        setMessage("");
    };

    return (
        <StyledChatFooter onSubmit={handleSendMessage}>
            <StyledChatInput
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
