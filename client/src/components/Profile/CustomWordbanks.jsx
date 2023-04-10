import React, { useState } from "react";
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
    border-radius: 1rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.3, 0.3, 0, 1);
`;

const WordbankContent = styled.div`
    border-radius: 0 0 1rem 1rem;
    margin-bottom: 0;
    background-color: var(--white);
    transition: all 0.3s cubic-bezier(0.3, 0.3, 0, 1);
`;

function CustomWordbanks(props) {
    const isDesktop = Desktop();
    const { wordbanks } = { ...props };
    const [showContent, setShowContent] = useState(false);

    const handleShowContent = (name) => {
        setShowContent((prev) => {
            return prev === name ? null : name;
        });
    };

    return (
        <WordbankContainer>
            {wordbanks.map((wordbank) => (
                <div key={wordbank.name}>
                    <WordbankSection
                        id={wordbank.name}
                        style={{
                            borderRadius:
                                showContent === wordbank.name
                                    ? "1rem 1rem 0 0"
                                    : "1rem",
                        }}
                        onClick={() => handleShowContent(wordbank.name)}
                    >
                        {wordbank.name}
                    </WordbankSection>
                    <WordbankContent
                        style={{
                            padding:
                                showContent === wordbank.name
                                    ? "1rem"
                                    : "0 1rem",
                            opacity: showContent === wordbank.name ? "1" : "0",
                            height:
                                showContent === wordbank.name ? "100px" : "0",
                        }}
                        id={wordbank.name}
                    >
                        {wordbank.words.toString()}
                    </WordbankContent>
                </div>
            ))}
        </WordbankContainer>
    );
}

export default CustomWordbanks;
