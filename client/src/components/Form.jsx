import React from "react";
import styled from "styled-components";
import { Desktop } from "service/mediaQueries";

const StyledForm = styled.form`
    background-color: var(--light-beige);
    padding: 2rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
    margin: ${(props) => (props.isDesktop ? "0 auto" : "0 2rem")};
    max-width: 500px;
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
