import React, { useState } from "react";
import styled from "styled-components";

import { Button, FormInput } from "components";

const StyledChatFooter = styled.form``;

function ChatFooter(props) {
    const [message, setMessage] = useState("");

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            props.socket.emit("chat message", {
                message,
                id: `${props.socket.id}${Math.random()}`,
            });
        }
        setMessage("");
    };

    return (
        <StyledChatFooter onSubmit={handleSendMessage}>
            <FormInput
                type="text"
                placeholder="Enter guess here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <Button>Send</Button>
        </StyledChatFooter>
    );
}

export default ChatFooter;
