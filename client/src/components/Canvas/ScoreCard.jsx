import React from "react";
import styled from "styled-components";

const StyledScoreCard = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 0;

    width: ${(props) => props.width};
    height: 450px;
    margin-top: 80px;
    transition: all 1s cubic-bezier(0.3, 0.3, 0, 1);

    background-color: rgba(0, 0, 0, 0.5);
    transform: ${(props) =>
        props.showScoreCard ? "translateY(0)" : "translateY(-100%)"};
`;

function ScoreCard(props) {
    const { showScoreCard, playersData, width, prevWord } = { ...props };

    return (
        <StyledScoreCard showScoreCard={showScoreCard} width={width}>
            The word was {prevWord}
            {playersData.map((player) => (
                <div key={player.id}>
                    {player.username} +{player.turnScore} points
                </div>
            ))}
        </StyledScoreCard>
    );
}

export default ScoreCard;
