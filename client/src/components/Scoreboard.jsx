import React from "react";
import styled from "styled-components";

import { socket } from "service/socket";
import { Desktop } from "service/mediaQueries";

const ScoreboardContainer = styled.div`
    width: ${(props) => (props.isDesktop ? "220px" : "100%")};
`;

const ScoreboardList = styled.div`
    display: grid;
    grid-template-rows: repeat(auto-fill, 4rem);
    grid-gap: 1.5rem;
    height: 100%;
`;

const StyledScoreboard = styled.div`
    background-color: var(--light-beige);
    height: fit-content;
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    text-align: center;
    padding: 0.5rem 0;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

    outline: ${(props) =>
        (props.currentTurn && "2px solid var(--secondary)") ||
        (props.hasGuessed && "2px solid var(--primary)") ||
        "0"};
`;
const UserImageDiv = styled.div`
    display: flex;
    align-items: center;
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

const HoverButton = styled.button`
    display: none;
    background-color: red;
    font-family: var(--font);
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--white);

    padding: 0.6rem 0.8rem;
    border: 0;
    border-radius: 0.5rem;

    cursor: pointer;
    ${UserImageDiv}:hover & {
        position: absolute;
        display: block;
    }

    :active {
        transform: scale(0.9);
    }
`;

function Scoreboard(props) {
    const isDesktop = Desktop();
    const { userData, gameData, host } = { ...props };

    function kickPlayer(username) {
        socket.emit("kick-player", username);
    }

    return (
        <ScoreboardContainer isDesktop={isDesktop}>
            <ScoreboardList>
                {gameData.players &&
                    gameData.players.map(
                        ({ username, avatar, score, isHost, hasGuessed }) => (
                            <StyledScoreboard
                                key={username}
                                currentTurn={username === gameData.currentTurn}
                                hasGuessed={hasGuessed}
                            >
                                {username === userData.username ? (
                                    <div>
                                        <StyledText secondary>
                                            {username}
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
                                <UserImageDiv>
                                    {host && username !== userData.username && (
                                        <HoverButton
                                            onClick={() => kickPlayer(username)}
                                        >
                                            Kick
                                        </HoverButton>
                                    )}
                                    <UserImage src={avatar} />
                                </UserImageDiv>
                            </StyledScoreboard>
                        )
                    )}
            </ScoreboardList>
        </ScoreboardContainer>
    );
}

export default Scoreboard;
