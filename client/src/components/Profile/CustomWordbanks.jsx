import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { Button, ErrorMessage, FormInput } from "components";
import axios from "axios";

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

const StyledMessage = styled.div`
    text-align: center;
`;

function CustomWordbanks(props) {
    const { userData } = { ...props };

    const [wordbanks, setWordbanks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newWordsString, setNewWordsString] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setWordbanks([...props.wordbanks]);
    }, [props.wordbanks]);

    const handleCreateWordbank = useCallback(
        (e) => {
            e.preventDefault();

            const words = newWordsString.split(",").map((word) => word.trim());
            const body = { words };
            const options = {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
            };

            if (newCategoryName === "")
                return setError("Category name must not be empty.");

            // Create the wordbank
            axios
                .post(
                    `/wordbank/${newCategoryName}/${userData.id}`,
                    body,
                    options
                )
                .then((res) => {
                    setError("");
                    setMessage(res.data.message);
                    setWordbanks((prev) => [
                        ...prev,
                        { name: newCategoryName, isGlobal: false, words },
                    ]);
                })
                .catch((err) => {
                    setMessage("");
                    setError(err.response.data.error);
                });
        },
        [newCategoryName, newWordsString, userData.id]
    );

    return (
        <WordbankContainer>
            {showCreate ? (
                <>
                    {message && <StyledMessage>{message}</StyledMessage>}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
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
                        value={newWordsString}
                        onChange={(e) => setNewWordsString(e.target.value)}
                        textArea
                    />
                    <div className="buttons">
                        <Button
                            type="button"
                            secondary
                            onClick={() => {
                                setMessage("");
                                setError("");
                                setShowCreate(false);
                            }}
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
                    {wordbanks?.map((wordbank) => (
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
