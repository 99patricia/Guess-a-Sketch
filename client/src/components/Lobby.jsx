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
`;

const UserCardList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    grid-template-rows: repeat(auto-fill, 8rem);
    grid-gap: 1rem;
    padding: 0.25rem;
    height: 100%;
    overflow: auto;

    border-radius: 1rem;
    // border: 2px solid var(--primary);
`;

const UserCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.1rem;
    height: 8rem;
    border-radius: 1rem;
`;

const HoverButton = styled.button`
    display: none;
    background-color: red;
    font-family: var(--font);
    font-size: 1.1rem;
    text-transform: uppercase;
    color: var(--white);

    padding: 0.8rem 1.2rem;
    border: 0;
    border-radius: 0.5rem;

    cursor: pointer;
    ${UserCard}:hover & {
        display: inline-block;
        position: absolute;
    }

    :active {
        transform: scale(0.9);
    }
`;

const UserImage = styled.img`
    display: block;
    border-radius: 50%;
    overflow: auto;

    border: 2px solid var(--primary);
`;

const ThisUserImage = styled.img`
    display: block;
    border-radius: 50%;
    overflow: auto;

    border: 2px solid var(--secondary);
`;

const LobbyFooter = styled.div`
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledText = styled.p`
    margin: 0;
    color: ${(props) =>
        props.secondary ? "var(--secondary)" : "var(--primary)"};
`;

function Lobby(props) {
    const { userData, players, host } = { ...props };

    socket.emit("get-players-data");

    function startGame() {
        socket.emit("start-game");
    }

    function kickPlayer(username) {
        socket.emit("kick-player", username);
    }

    if (!players) {
        return (
            <LobbyContainer>
                <h3>No players...</h3>
            </LobbyContainer>
        );
    }
    return (
        <LobbyContainer>
            <UserCardList>
                {players.map(({ username, isHost, avatar }) => (
                    <UserCard key={username}>
                        {host && username !== userData.username && (
                            <HoverButton onClick={() => kickPlayer(username)}>
                                Kick
                            </HoverButton>
                        )}
                        {username === userData.username && (
                            <>
                                <ThisUserImage src={avatar} />
                                <h3 style={{ margin: "5px" }}>
                                    {isHost ? (
                                        <StyledText secondary>
                                            {username} (host)
                                        </StyledText>
                                    ) : (
                                        <StyledText secondary>
                                            {username}
                                        </StyledText>
                                    )}
                                </h3>
                            </>
                        )}
                        {username !== userData.username && (
                            <>
                                <UserImage src={avatar} />
                                <h3 style={{ margin: "5px" }}>
                                    {isHost ? (
                                        <StyledText>
                                            {username} (host)
                                        </StyledText>
                                    ) : (
                                        <StyledText>{username}</StyledText>
                                    )}
                                </h3>
                            </>
                        )}
                    </UserCard>
                ))}
            </UserCardList>
            <LobbyFooter>
                {host && (
                    <Button noShadow onClick={startGame}>
                        Start
                    </Button>
                )}
                {!host && <p>Waiting for the host to start the game...</p>}
            </LobbyFooter>
        </LobbyContainer>
    );
}

export default Lobby;
