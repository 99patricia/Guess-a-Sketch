import React from "react";
import styled from "styled-components";

export const StyledLabel = styled.label`
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
    margin: 1rem 0;

    :focus {
        border: 1px solid var(--primary);
        outline: 0;
    }

    ::placeholder {
        color: var(--beige);
    }
`;

const StyledTextArea = styled.textarea`
    padding: 0.7rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--beige);
    font-size: 1.2rem;
    font-family: var(--font);
    font-weight: 900;
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
            {props.textArea ? (
                <StyledTextArea {...props}></StyledTextArea>
            ) : (
                <StyledInput {...props}></StyledInput>
            )}
        </>
    );
}

export default FormInput;
