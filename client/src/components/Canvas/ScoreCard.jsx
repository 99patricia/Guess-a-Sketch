import React from "react";
import { Desktop } from "service/mediaQueries";
import styled from "styled-components";

const StyledScoreCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    z-index: 0;

    border-radius: ${(props) => (props.isDesktop ? "1rem 1rem 0 0" : "0")};
    width: ${(props) => props.width};
    height: 450px;
    margin-top: 80px;
    transition: all 1s cubic-bezier(0.3, 0.3, 0, 1);

    background-color: rgba(41, 75, 138, 0.2);
    transform: ${(props) =>
        props.showScoreCard ? "translateY(0)" : "translateY(-100%)"};

    .word {
        color: var(--secondary);
        text-transform: uppercase;
        font-size: 180%;
        line-height: 100%;
        margin-bottom: 1rem;
    }

    .score {
        color: var(--secondary);
    }
`;

function ScoreCard(props) {
    const isDesktop = Desktop();
    const { showScoreCard, playersData, width, prevWord } = { ...props };

    return (
        <StyledScoreCard
            isDesktop={isDesktop}
            showScoreCard={showScoreCard}
            width={width}
        >
            The word was <span className="word">{prevWord}</span>
            {playersData.map((player) => (
                <div key={player.username}>
                    {player.username}{" "}
                    <span className="score">+{player.turnScore}</span> points
                </div>
            ))}
        </StyledScoreCard>
    );
}

export default ScoreCard;
