import React from "react";
import styled from "styled-components";
import { MediaQuery } from "service/mediaQuery";

const StyledForm = styled.form`
    background-color: var(--light-beige);
    padding: 2rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
    margin: ${(props) => (props.isBigScreen ? "0 auto" : "0 2rem")};
`;

function Form(props) {
    const { isBigScreen } = MediaQuery();

    return (
        <StyledForm {...props} isBigScreen={isBigScreen}>
            {props.children}
        </StyledForm>
    );
}

export default Form;
