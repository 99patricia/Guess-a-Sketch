import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    background-color: ${(props) =>
        props.secondary ? "var(--secondary)" : "var(--primary)"};
    font-family: var(--font);
    font-size: 1.1rem;
    text-transform: uppercase;
    color: var(--white);
    cursor: pointer;
    width: ${(props) => (props.fullWidth ? "100%" : "auto")};

    padding: 0.8rem 1.2rem;
    display: block;
    border: 0;
    border-radius: 0.5rem;
    box-shadow: ${(props) =>
        props.noShadow ? "none" : "0px 4px 4px rgba(0, 0, 0, 0.1)"};

    -webkit-transition: background-color 0.05s ease-out;
    -moz-transition: background-color 0.05s ease-out;
    -o-transition: background-color 0.05s ease-out;
    transition: background-color 0.05s ease-out;

    not(:disabled):active {
        background-color: ${(props) =>
            props.secondary ? "var(--primary)" : "var(--secondary)"};
    }

    :not(:last-child) {
        margin: ${(props) => (props.column ? "1rem 0" : "0 1rem")};
    }

    :disabled {
        cursor: default;
        background-color: var(--light-beige);
        color: var(--dark-beige);
    }
`;

const Button = React.forwardRef((props, ref) => {
    return (
        <StyledButton {...props} ref={ref}>
            {props.children}
        </StyledButton>
    );
});

export default Button;
