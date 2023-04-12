/**
 * FR11 - Request.Profile
 */

import React, { useEffect } from "react";
import styled from "styled-components";

const GamesContainer = styled.div`
    display: grid;
    grid-template-rows: repeat(auto-fill);
    padding: 0.5rem;
    grid-gap: 0.5rem;
    height: 100%;
    overflow-y: auto;
    // border: 1px solid red;
`;

const GameCard = styled.div`
    display: grid;
    grid-template-columns: 1fr 0.5fr;
    align-items: center;
    text-align: center;
    vertical-align: middle;

    background-color: var(--white);
    border-radius: 1rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
`;

function Games(props) {
    const { gameHistory } = { ...props };

    return (
        <>
            <GamesContainer>
                {gameHistory.map(({ room, winner, players }, index) => (
                    <GameCard key={index}>
                        <p>
                            Played a game with {players.length} players in room
                            ({room ? <>{room.toUpperCase()}</> : <>temp</>})
                        </p>
                        <p style={{ color: "var(--secondary)" }}>
                            winner: {winner}
                        </p>
                    </GameCard>
                ))}
            </GamesContainer>
        </>
    );
}

export default Games;
