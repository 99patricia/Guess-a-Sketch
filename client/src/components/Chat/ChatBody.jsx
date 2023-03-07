import React from "react";
import styled from "styled-components";

const StyledMessage = styled.div`
    background-color: var(--beige);
    padding: 0.2rem 0.5rem;

    :nth-child(odd) {
        background-color: var(--light-beige);
        color: var(--secondary);
    }
`;

function ChatBody(props) {
    return (
        <>
            {props.messages.map((msg) => (
                <StyledMessage key={msg.id}>
                    {msg.username}: {msg.message}
                </StyledMessage>
            ))}
        </>
    );
}

export default ChatBody;
