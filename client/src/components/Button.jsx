import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    background-color: ${(props) =>
        props.secondary ? "var(--secondary)" : "var(--primary)"};
    color: var(--white);
    padding: 0.8rem 1.2rem;
    display: block;
    border: 0;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    font-family: var(--font);
    font-size: 1.1rem;
    text-transform: uppercase;

    :not(:last-child) {
        margin-right: ${(props) => (props.column ? "0" : "1rem")};
        margin-bottom: ${(props) => (props.column ? "1rem" : "0")};
    }
`;

function Button(props) {
    return (
        <StyledButton secondary={props.secondary} column={props.column}>
            {props.children}
        </StyledButton>
    );
}

export default Button;
