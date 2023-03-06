import React from "react";
import styled from "styled-components";

const StyledChat = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    border-radius: 1rem;
    height: 80%;
`;

function Chat(props) {
    return <StyledChat>{props.children}</StyledChat>;
}

export default Chat;
