import FormInput from "components/FormInput";
import React from "react";
import { Desktop } from "service/mediaQueries";
import styled from "styled-components";

const WordbankContainer = styled.div`
    display: grid;
    grid-gap: 1rem;
    margin: 1rem;
`;

const WordbankSection = styled.div`
    background-color: var(--beige);
    padding: 1rem;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
`;

const WordbankContent = styled(FormInput)`
    resize: none;
    border-radius: 0 0 1rem 1rem;
`;

function CustomWordbanks(props) {
    const isDesktop = Desktop();
    const { wordbanks } = { ...props };

    return (
        <WordbankContainer>
            {wordbanks.map((wordbank) => (
                <>
                    {!wordbank.isGlobal && (
                        <div key={wordbank.name}>
                            <WordbankSection>{wordbank.name} </WordbankSection>
                            <WordbankContent
                                textArea
                                defaultValue={wordbank.words}
                            ></WordbankContent>
                        </div>
                    )}
                </>
            ))}
        </WordbankContainer>
    );
}

export default CustomWordbanks;
