import React from "react";
import styled from "styled-components";
import { socket } from "service/socket";

import { useUserData } from "hooks";
import { Button } from "components";

import default_user_image from "../images/default_user.png";

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
    padding: 0.1rem;
    height: 8rem;

    // border: 1px solid var(--primary);
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
    margin-top: 2px;
    display: flex;
    alignitems: center;
    justifycontent: center;
    text-align: center;
`;

function Lobby(props) {
    const { userData, players, isHost } = { ...props };
    // const { isLoggedIn, loggedInAsGuest, userData } = useUserData();

    socket.emit("get-players-data");

    function startGame() {
        socket.emit("start-game");
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
                        {username === userData.username && (
                            <>
                                <ThisUserImage src={avatar} />
                                <h3 style={{ margin: "5px" }}>
                                    {isHost && (
                                        <p
                                            style={{
                                                margin: "0",
                                                color: "var(--secondary)",
                                            }}
                                        >
                                            {username} (host)
                                        </p>
                                    )}
                                    {!isHost && (
                                        <p
                                            style={{
                                                margin: "0",
                                                color: "var(--secondary)",
                                            }}
                                        >
                                            {username}
                                        </p>
                                    )}
                                </h3>
                            </>
                        )}
                        {username !== userData.username && (
                            <>
                                <UserImage src={avatar} />
                                <h3 style={{ margin: "5px" }}>
                                    {isHost && (
                                        <p
                                            style={{
                                                margin: "0",
                                                color: "var(--primary)",
                                            }}
                                        >
                                            {username} (host)
                                        </p>
                                    )}
                                    {!isHost && (
                                        <p
                                            style={{
                                                margin: "0",
                                                color: "var(--primary)",
                                            }}
                                        >
                                            {username}
                                        </p>
                                    )}
                                </h3>
                            </>
                        )}
                    </UserCard>
                ))}
            </UserCardList>
            <LobbyFooter>
                {isHost && (
                    <Button
                        style={{ display: "block", margin: "auto" }}
                        noShadow
                        onClick={startGame}
                    >
                        Start
                    </Button>
                )}
            </LobbyFooter>
        </LobbyContainer>
    );
}

export default Lobby;
