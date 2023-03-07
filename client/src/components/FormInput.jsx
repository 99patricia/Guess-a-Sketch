import React from "react";
import styled from "styled-components";

const StyledLabel = styled.label`
    text-align: center;
    text-transform: uppercase;
    font-size: 1.5rem;
    line-height: 2rem;
    color: var(--secondary);
`;

const StyledInput = styled.input`
    padding: 0.7rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--beige);
    font-size: 1.2rem;
    color: var(--primary);
    margin-bottom: 2rem;

    :focus {
        border: 1px solid var(--primary);
        outline: 0;
    }

    ::placeholder {
        color: var(--beige);
    }

`;

function FormInput(props) {
    return (
        <>
            <StyledLabel>{props.label}</StyledLabel>
            <StyledInput {...props}></StyledInput>
        </>
    );
}

export default FormInput;
