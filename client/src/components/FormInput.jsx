import React from "react";
import { Desktop } from "service/mediaQueries";
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
    margin-bottom: ${(props) => (props.isDesktop ? "0" : "2rem")};

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
    const isDesktop = Desktop();

    return (
        <>
            <StyledLabel>{props.label}</StyledLabel>
            {props.textArea ? (
                <StyledTextArea {...props} />
            ) : props.select ? (
                <StyledSelect {...props} isDesktop={isDesktop} />
            ) : (
                <StyledInput {...props} />
            )}
        </>
    );
}

export default FormInput;
