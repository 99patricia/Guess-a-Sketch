import React from "react";
import styled from "styled-components";

const ScoreboardContainer = styled.div`
    width: 220px;
`;

const ScoreboardList = styled.div`
    display: grid;
    grid-template-rows: repeat(auto-fill, 4rem);
    grid-gap: 0.25rem;
    padding-top: 0.25rem;
    height: 100%;
`;

const StyledScoreboard = styled.div`
    display: grid;
    grid-template-columns: 130px 60px;
    align-items: center;
    text-align: center;
    background-color: var(--light-beige);
    border-radius: 0.25rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

    outline: ${(props) =>
        props.currentTurn ? "2px solid var(--secondary)" : "0"};
`;

const UserImage = styled.img`
    display: block;
    width: 60px;
    border-radius: 50%;
`;

const StyledText = styled.p`
    margin: 0;
    color: ${(props) =>
        props.secondary ? "var(--secondary)" : "var(--primary)"};
`;

function Scoreboard(props) {
    const { userData, gameData, isHost } = { ...props };

    return (
        <ScoreboardContainer>
            <ScoreboardList>
                {gameData.players.map(
                    ({ username, avatar, score, isHost, hasGuessed }) => (
                        <StyledScoreboard
                            key={username}
                            currentTurn={username === gameData.currentTurn}
                        >
                            {username === userData.username ? (
                                <div>
                                    <StyledText secondary>
                                        {username} <br></br>
                                    </StyledText>
                                    <StyledText secondary>
                                        Score: {score}
                                    </StyledText>
                                </div>
                            ) : (
                                <div>
                                    <StyledText>{username}</StyledText>
                                    <StyledText>Score: {score}</StyledText>
                                </div>
                            )}
                            <UserImage src={avatar} />
                        </StyledScoreboard>
                    )
                )}
            </ScoreboardList>
        </ScoreboardContainer>
    );
}

export default Scoreboard;
