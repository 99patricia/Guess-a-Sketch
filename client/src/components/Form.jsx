import React from "react";
import styled from "styled-components";
import { Desktop } from "service/mediaQueries";

const StyledForm = styled.form`
    background-color: var(--light-beige);
    padding: 2rem;
    margin: 2rem auto;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
    max-width: 75vw;
`;

function Form(props) {
    const isDesktop = Desktop();
    return (
        <StyledForm {...props} isDesktop={isDesktop}>
            {props.children}
        </StyledForm>
    );
}

export default Form;
