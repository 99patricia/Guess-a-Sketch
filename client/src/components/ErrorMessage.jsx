import React from "react";
import styled from "styled-components";

const StyledErrorMessage = styled.div`
    // background-color: var(--error-bg);
    // padding: 2rem;
    color: var(--error);
    text-align: center;
`;

function ErrorMessage(props) {
    return <StyledErrorMessage>{props.children}</StyledErrorMessage>;
}

export default ErrorMessage;
