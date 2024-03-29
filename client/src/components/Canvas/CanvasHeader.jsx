/**
 * FR12 - Draw.Canvas
 */

import React from "react";
import styled from "styled-components";
import { Desktop } from "service/mediaQueries";

const CanvasHeaderContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    align-items: center;
    justify-items: stretch;
    height: 80px;
    width: ${(props) => props.width};
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    z-index: 2;

    padding: ${(props) => (props.isDesktop ? "0 2rem" : "0 1rem")};
    background-color: var(--light-beige);
`;

const StyledTimer = styled.div`
    padding: 0;
    width: 60px;
    height: 60px;
    background-color: var(--secondary);
    border-radius: 100%;
    color: var(--white);
    display: flex;
    font-size: 1.8rem;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

const StyledWord = styled.div`
    text-align: center;
    text-transform: uppercase;

    div.word {
        font-size: 140%;
        color: var(--secondary);
    }
`;

const StyledRound = styled.div`
    text-align: center;
    text-transform: uppercase;

    div.round {
        color: var(--secondary);
    }
`;

function GameHeader(props) {
    const isDesktop = Desktop();
    const { gameData, isDrawing, timeLeft, word, width } = { ...props };

    const currentTurnID = gameData.currentTurn;
    const currentTurn = gameData.players.find(
        (player) => player.userID == currentTurnID
    )?.username;
    const numRounds = gameData.numberOfRounds;
    const currentRound = gameData.currentRound;

    return (
        <CanvasHeaderContainer isDesktop={isDesktop} width={width}>
            <StyledTimer>{timeLeft}</StyledTimer>
            <StyledWord>
                {isDrawing ? "Your word is:" : `${currentTurn} is drawing...`}
                {isDrawing && <div className="word">{word}</div>}
            </StyledWord>
            <StyledRound>
                Round
                <div className="round">
                    {currentRound} of {numRounds}
                </div>
            </StyledRound>
        </CanvasHeaderContainer>
    );
}

export default GameHeader;
