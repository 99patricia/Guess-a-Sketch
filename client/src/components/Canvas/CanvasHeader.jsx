import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { socket } from "service/socket";

const CanvasHeaderContainer = styled.div`
    display: grid;
    // grid-template-columns: 150px 50px 150px;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    align-items: center;
    // text-align: center;
    margin: 0;
    height: 80px;

    // outline: 1px solid black;
`;

function GameHeader(props) {
    const { gameData, isDrawing, timeLeft, word } = { ...props };

    const currentTurn = gameData.currentTurn;
    const numRounds = gameData.numberOfRounds;
    const currentRound = gameData.currentRound;

    return (
        <CanvasHeaderContainer>
            <p style={{ textAlign: "left" }}>
                Round {currentRound} of {numRounds}
            </p>
            <p style={{ textAlign: "left" }}>Time Left: {timeLeft}</p>
            {isDrawing && (
                <p style={{ textAlign: "right" }}>
                    Your word is
                    <span style={{ color: "var(--secondary)" }}> {word}</span>
                </p>
            )}
            {!isDrawing && (
                <p style={{ textAlign: "right" }}>
                    {currentTurn} is drawing...
                </p>
            )}
        </CanvasHeaderContainer>
    );
}

export default GameHeader;
