import React from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { Button } from "components";

const LobbyContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    border-radius: 1rem;
    width: 500px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-flow: column;
    overflow: hidden;
`;

const GameOverHeader = styled.div`
    text-align: center;
    text-transform: uppercase;
    font-size: 2rem;
    line-height: 4rem;

    div.winner {
        font-size: 1.4rem;
        line-height: 2rem;
        color: var(--secondary);
    }
`;

const UserCardList = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(8rem, 1fr));
    grid-template-rows: 1fr 1fr;
    grid-gap: 1rem;
    padding: 0.25rem;
    height: 100%;
    padding-top: 2rem;
    // overflow: auto;
    border-radius: 1rem;
    overflow: hidden;
    // border: 1px solid black;
`;

const UserCard1 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
    height: 13rem;
    border-radius: 1rem;

    grid-column-start: 1;
    grid-column-end: 3;
    // grid-row-start: 1;
    // grid-row-end: 1;
    // border: 1px solid red;
`;

const UserCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
    height: 11rem;
    border-radius: 1rem;
    // border: 1px solid black;
`;

const UserImage = styled.img`
    display: block;
    border-radius: 50%;
    overflow: auto;

    border: 2px solid var(--primary);
`;

const LeaderboardLabel = styled.div`
    text-align: center;
    font-size: 1.2rem;
    line-height: 1.6rem;

    div.winner {
        font-size: 1.6rem;
        line-height: 2rem;
    }
`;

const StyledText = styled.p`
    margin: 0;
    color: ${(props) =>
        props.secondary ? "var(--secondary)" : "var(--primary)"};
`;

function GameOver(props) {
    const { gameData } = { ...props };

    const sortedPlayers = gameData.players.sort((a, b) => b.score - a.score);
    const top3Players = sortedPlayers.slice(0, Math.min(3, sortedPlayers.length));
    const leadeboardLabels = ["1st", "2nd", "3rd"];

    return (
        <LobbyContainer>
            <GameOverHeader>
                GAME OVER
                <div className="winner">
                    Winner: {sortedPlayers[0].username}
                </div>
            </GameOverHeader>
            <UserCardList>
                {top3Players.map(({ username, score, avatar }, index) => (
                    <>
                    {index === 0 ? (
                        <UserCard1 key={username}>
                            <LeaderboardLabel >
                            <div className="winner">
                                {leadeboardLabels[index]}
                            </div>
                            </LeaderboardLabel>
                            <UserImage src={avatar} />
                            <StyledText secondary>{username}</StyledText>
                            <StyledText>Score: {score}</StyledText>
                        </UserCard1>
                    ) : (
                        <UserCard key={username}>
                            <LeaderboardLabel >{leadeboardLabels[index]}</LeaderboardLabel> 
                            <UserImage src={avatar} />
                            <StyledText secondary>{username}</StyledText>
                            <StyledText>Score: {score}</StyledText>
                        </UserCard>
                    )}
                    </>
                ))}
            </UserCardList>
        </LobbyContainer>
    )
}

export default GameOver;