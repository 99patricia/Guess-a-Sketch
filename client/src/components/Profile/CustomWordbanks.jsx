import React, { useState } from "react";
import styled from "styled-components";

import { Button, FormInput } from "components";
import { Form } from "react-router-dom";
import axios from 'axios';

const WordbankContainer = styled.div`
    display: grid;
    grid-gap: 1rem;
    margin: 1rem;

    .buttons {
        justify-content: center;
        display: flex;
    }
`;

const WordbankName = styled.div`
    background-color: var(--beige);
    padding: 1rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.3, 0.3, 0, 1);
`;

const WordbankContent = styled.div`
    border-radius: 0 0 0.5rem 0.5rem;
    margin-bottom: 0;
    background-color: var(--white);
    transition: all 0.3s cubic-bezier(0.3, 0.3, 0, 1);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

function CustomWordbanks(props) {
    const { wordbanks } = { ...props };
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newWords, setNewWords] = useState([]);

    const handleCreateWordbank = () => {
        let newWordsArray = newWords.split(",");
        newWordsArray = newWordsArray.map((word) => word.trim());
        setNewWords(newWordsArray);

        
    };

    return (
        <WordbankContainer>
            {showCreate ? (
                <>
                    <FormInput
                        label="Category"
                        placeholder="Enter category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        type="text"
                    />
                    <FormInput
                        label="Words"
                        placeholder="Enter a comma (,) separated list of words"
                        value={newWords}
                        onChange={(e) => setNewWords(e.target.value)}
                        textArea
                    />
                    <div className="buttons">
                        <Button
                            type="button"
                            secondary
                            onClick={() => setShowCreate(false)}
                        >
                            Back
                        </Button>
                        <Button type="button" onClick={handleCreateWordbank}>
                            Submit
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <Button
                        column
                        type="button"
                        onClick={() => setShowCreate(true)}
                    >
                        Create New Wordbank
                    </Button>
                    {wordbanks.map((wordbank) => (
                        <div key={wordbank.name}>
                            <WordbankName
                                id={wordbank.name}
                                style={{
                                    borderRadius:
                                        selectedCategory === wordbank.name
                                            ? "0.5rem 0.5rem 0 0"
                                            : "0.5rem",
                                }}
                                onClick={() =>
                                    setSelectedCategory((prev) =>
                                        prev === wordbank.name
                                            ? null
                                            : wordbank.name
                                    )
                                }
                            >
                                {wordbank.name}
                            </WordbankName>
                            <WordbankContent
                                style={{
                                    padding:
                                        selectedCategory === wordbank.name
                                            ? "1rem"
                                            : "0 1rem",
                                    opacity:
                                        selectedCategory === wordbank.name
                                            ? "1"
                                            : "0",
                                    height:
                                        selectedCategory === wordbank.name
                                            ? "100px"
                                            : "0",
                                }}
                                id={wordbank.name}
                            >
                                {wordbank.words.join(", ")}
                            </WordbankContent>
                        </div>
                    ))}
                </>
            )}
        </WordbankContainer>
    );
}

export default CustomWordbanks;
