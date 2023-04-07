import React from "react";
import { Desktop } from "service/mediaQueries";
import styled from "styled-components";

const StyledChatBody = styled.div`
    overflow-y: auto;
    height: 100%;
`;

const StyledScrollableList = styled.div`
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: ${(props) => (props.isDesktop ? "100%" : "40vh")};
    max-height: ${(props) => (props.isDesktop ? "none" : "40vh")};
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
