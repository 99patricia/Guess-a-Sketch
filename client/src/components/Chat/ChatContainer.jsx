import React from "react";
import styled from "styled-components";

const StyledChatContainer = styled.div`
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
        font-size: 1.6rem;
        color: var(--secondary);
    }
`;

function ChatContainer(props) {
    return (
        <StyledChatContainer>
            <StyledRoomCode>
                Room code:
                <div className="code">{props.roomId}</div>
            </StyledRoomCode>
            <div>{props.children}</div>
        </StyledChatContainer>
    );
}

export default ChatContainer;
