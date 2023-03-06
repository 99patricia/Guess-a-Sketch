import React from "react";
import styled from "styled-components";

const StyledForm = styled.form`
    background-color: var(--light-beige);
    padding: 2rem;
    border-radius: 1.5rem;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
`;

function Form(props) {
    return <StyledForm props={props}>{props.children}</StyledForm>;
}

export default Form;
