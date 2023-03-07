import React from "react";
import styled from "styled-components";

const StyledForm = styled.form`
    background-color: var(--light-beige);
    padding: 2rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
`;

function Form(props) {
    return <StyledForm {...props}>{props.children}</StyledForm>;
}

export default Form;
