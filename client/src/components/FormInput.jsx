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

    margin-bottom: 2rem;
    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

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
    width: 100%;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    :focus {
        border: 1px solid var(--primary);
        outline: 0;
    }

    ::placeholder {
        color: var(--beige);
    }
`;

const StyledSelect = styled.select`
    padding: 0.7rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--beige);
    font-size: 1.2rem;
    color: var(--primary);

    width: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    font-family: var(--font);
    font-weight: 900;
    text-transform: capitalize;

    :focus {
        border: 1px solid var(--primary);
        outline: 0;
    }
`;

function FormInput(props) {
    return (
        <>
            <StyledLabel>{props.label}</StyledLabel>
            {props.textArea ? (
                <StyledTextArea {...props}></StyledTextArea>
            ) : props.select ? (
                <StyledSelect>
                    {props.options.map((name) => (
                        <option key={name}>{name}</option>
                    ))}
                </StyledSelect>
            ) : (
                <StyledInput {...props}></StyledInput>
            )}
        </>
    );
}

export default FormInput;
