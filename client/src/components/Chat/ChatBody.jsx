import React from "react";
import styled from "styled-components";

const StyledChatBody = styled.div`
    overflow-y: auto;
    height: 100%;
`;

const StyledScrollableList = styled.div`
    overflow-y: auto;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
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
    return (
        <StyledChatBody ref={ref}>
            <StyledScrollableList>
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
