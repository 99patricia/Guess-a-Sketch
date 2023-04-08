import React from "react";
import { Desktop } from "service/mediaQueries";
import styled from "styled-components";

const LobbyContainer = styled.div`
    background-color: var(--light-beige);
    padding: 1rem;
    border-radius: 1rem;
    width: ${(props) => (props.isDesktop ? "500px" : "inherit")};
    max-height: 70vh;
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
    grid-template-rows: 55% 40%;
    padding: 0.25rem;
    height: 100%;
    border-radius: 1rem;
    overflow: hidden;
`;

const UserCard1 = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
    height: flex;
    border-radius: 1rem;

    grid-column-start: 1;
    grid-column-end: 3;
`;

const UserCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
    height: flex;
    border-radius: 1rem;
`;

const UserImage = styled.img`
    display: block;
    border-radius: 50%;
    overflow: auto;
    max-width: 50%;
    max-height: 50%;

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
    const isDesktop = Desktop();
    const { gameData } = { ...props };

    const sortedPlayers = gameData.players.sort((a, b) => b.score - a.score);
    const top3Players = sortedPlayers.slice(
        0,
        Math.min(3, sortedPlayers.length)
    );
    const leadeboardLabels = ["1st", "2nd", "3rd"];

    return (
        <LobbyContainer isDesktop={isDesktop}>
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
                                <LeaderboardLabel>
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
                                <LeaderboardLabel>
                                    {leadeboardLabels[index]}
                                </LeaderboardLabel>
                                <UserImage src={avatar} />
                                <StyledText secondary>{username}</StyledText>
                                <StyledText>Score: {score}</StyledText>
                            </UserCard>
                        )}
                    </>
                ))}
            </UserCardList>
        </LobbyContainer>
    );
}

export default GameOver;
