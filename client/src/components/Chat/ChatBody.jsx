import React from "react";
import { Desktop } from "service/mediaQueries";
import styled from "styled-components";

const StyledChatBody = styled.div`
    margin-top: auto;
    overflow-y: auto;
`;

const StyledScrollableList = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: auto;
    overflow-y: auto;
`;

const StyledMessage = styled.div`
    background-color: var(--beige);
    padding: 0.2rem 0.5rem;

    :nth-child(odd) {
        background-color: var(--light-beige);
        color: var(--secondary);
    }
`;

const ChatBody = React.forwardRef((props, ref) => {
    const isDesktop = Desktop();
    return (
        <StyledChatBody ref={ref}>
            <StyledScrollableList isDesktop={isDesktop}>
                {props.messages.map((msg) => (
                    <StyledMessage key={msg.id}>
                        {msg.username}: {msg.message}
                    </StyledMessage>
                ))}
            </StyledScrollableList>
        </StyledChatBody>
    );
});

export default ChatBody;
