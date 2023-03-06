import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    background-color: var(--secondary);
    color: var(--white);
    padding: 1rem 1.2rem;
    border: 0;
    border-radius: 0.8rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    font-family: var(--font);
    font-size: 1.1rem;
    text-transform: uppercase;
    font-weight: 900;

    :not(:last-child) {
        margin-right: 1rem;
    }
`;

function Button(props) {
    return <StyledButton>{props.children}</StyledButton>;
}

export default Button;
