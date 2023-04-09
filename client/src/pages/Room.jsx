import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Canvas,
    Chat,
    Container,
    FlexContainer,
    Header,
    Lobby,
    Scoreboard,
    GameOver,
} from "components";
import { socket } from "service/socket";
import { useUserData } from "hooks";
import { Desktop } from "service/mediaQueries";
import styled from "styled-components";
const NavBar = styled.div`
    padding-bottom: 1rem;
    // border: 1px solid purple;
`;

const StyledNavLink = styled.a`
    margin: 1rem;
    padding-bottom: 0.2rem;
    color: var(--primary);
    cursor: pointer;
    :hover {
        color: var(--secondary);
    }
    :active {
        color: var(--primary);
    }
`;

const TabContainer = styled.div`
    height: 80vh;
    width: 100vw;
    padding: 0 1rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
`;

const TabContentContainer = styled.div``;

function Room() {
    const isDesktop = Desktop();
    const navigate = useNavigate();
    const canvasRef = useRef();
    const { roomId } = useParams();
    const { userData } = useUserData();

    const [players, setPlayers] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [word, setWord] = useState("");
    const [gameStart, setGameStart] = useState(false);
    const [gameData, setGameData] = useState({});
    const [gameOver, setGameOver] = useState(false);
    const [colorChoices, setColorChoices] = useState(["black", "red", "blue"]);
    const [penSizeChoices, setPenSizeChoices] = useState([10, 50]);
    const [timeLeft, setTimeLeft] = useState("0");

    function openTab(tabName, e) {
        if (!isDesktop) {
            var i, tabcontent, tablinks;

            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            tablinks = document.getElementsByClassName(
                StyledNavLink.styledComponentId
            );
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(
                    " selected",
                    ""
                );
            }

            if (e) {
                document.getElementById(tabName).style.display = "block";
                e.currentTarget.className += " selected";
            } else if (gameStart) {
                document.getElementById("Game").style.display = "block";
            } else if (gameOver) {
                document.getElementById("Results").style.display = "block";
            }
        }
    }

    useEffect(() => {
        const equippedPerk = JSON.parse(localStorage.getItem("equippedPerk"));
        if (equippedPerk) {
            setColorChoices(equippedPerk["colors"]);
            setPenSizeChoices(
                equippedPerk["pen_sizes"].sort(function (a, b) {
                    return a - b;
                })
            );
        }

        if (players?.length === 0) {
            socket.emit("get-players-data");
            socket.emit("get-game-data");
        }

        socket.on("game-start", (data) => {
            setGameStart(true);
            openTab("Game");
            setGameData(data);
        });

        socket.on("game-data", (data) => {
            setGameData(data);
            setGameStart(data.gameStarted);
            setGameOver(data.gameOver);
        });

        socket.on("players-data", (data) => {
            setPlayers(data);
            if (players?.length > 0) {
                setIsHost(
                    players.find(
                        (player) => player.username === userData.username
                    ).isHost
                );
            }
        });

        socket.on("turn-start", (word) => {
            setIsDrawing(true);
            setWord(word);
        });

        socket.on("turn-end", () => {
            setIsDrawing(false);
        });

        socket.on("timer", (data) => {
            setTimeLeft(data);
        });

        socket.on("kick-player", (room_id) => {
            socket.emit("leave-room", room_id);
            window.alert("You were kicked from the server...");
            navigate(`/`);
        });

        socket.on("game-over", () => {
            setGameOver(true);
            openTab("Results");
        });

        socket.on("disconnect", () => {
            window.alert("You disconnected from the server...");
            navigate(`/`);
        });

        return () => {
            // Socket cleanup
            socket.off("game-start");
            socket.off("game-data");
            socket.off("players-data");
            socket.off("turn-start");
            socket.off("turn-end");
            socket.off("timer");
            socket.off("kick-player");
            socket.off("game-over");
            socket.off("disconnect");
        };
    }, [
        players,
        isHost,
        isDrawing,
        gameStart,
        timeLeft,
        userData,
        word,
        gameData,
    ]);

    return (
        <>
            <Header />
            <Container>
                {isDesktop ? (
                    <FlexContainer>
                        {gameOver ? (
                            <GameOver gameData={gameData} />
                        ) : (
                            <>
                                {gameStart ? (
                                    <>
                                        <Scoreboard
                                            userData={userData}
                                            gameData={gameData}
                                            host={isHost}
                                        />
                                        <Canvas
                                            ref={canvasRef}
                                            gameData={gameData}
                                            isDrawing={isDrawing}
                                            word={word}
                                            sendToSocket
                                            penSizeChoices={penSizeChoices}
                                            colorChoices={colorChoices}
                                            timeLeft={timeLeft}
                                            inGame
                                        />
                                    </>
                                ) : (
                                    <Lobby
                                        userData={userData}
                                        players={players}
                                    />
                                )}
                            </>
                        )}
                        <Chat
                            roomId={roomId}
                            timeLeft={timeLeft}
                            username={userData.username}
                        />
                    </FlexContainer>
                ) : (
                    <TabContainer>
                        <NavBar>
                            {gameOver ? (
                                <>
                                    <StyledNavLink
                                        className="selected"
                                        onClick={(e) => {
                                            openTab("Results", e);
                                        }}
                                    >
                                        RESULTS
                                    </StyledNavLink>
                                </>
                            ) : (
                                <>
                                    {gameStart ? (
                                        <>
                                            <StyledNavLink
                                                onClick={(e) => {
                                                    openTab("Players", e);
                                                }}
                                            >
                                                PLAYERS
                                            </StyledNavLink>
                                            <StyledNavLink
                                                className="selected"
                                                onClick={(e) => {
                                                    openTab("Game", e);
                                                }}
                                            >
                                                GAME
                                            </StyledNavLink>
                                        </>
                                    ) : (
                                        <StyledNavLink
                                            className="selected"
                                            onClick={(e) => {
                                                openTab("Lobby", e);
                                            }}
                                        >
                                            LOBBY
                                        </StyledNavLink>
                                    )}
                                </>
                            )}
                            <StyledNavLink
                                onClick={(e) => {
                                    openTab("Chat", e);
                                }}
                            >
                                CHAT
                            </StyledNavLink>
                        </NavBar>

                        <TabContentContainer>
                            {gameOver ? (
                                <div id="Results" className="tabcontent">
                                    <GameOver gameData={gameData} />
                                </div>
                            ) : (
                                <>
                                    {gameStart ? (
                                        <>
                                            <div
                                                id="Players"
                                                className="tabcontent"
                                                style={{ display: "none" }}
                                            >
                                                <Scoreboard
                                                    userData={userData}
                                                    gameData={gameData}
                                                    host={isHost}
                                                />
                                            </div>
                                            <div
                                                id="Game"
                                                className="tabcontent"
                                            >
                                                <Canvas
                                                    noContainer
                                                    ref={canvasRef}
                                                    gameData={gameData}
                                                    isDrawing={isDrawing}
                                                    word={word}
                                                    sendToSocket
                                                    penSizeChoices={
                                                        penSizeChoices
                                                    }
                                                    colorChoices={colorChoices}
                                                    timeLeft={timeLeft}
                                                    inGame
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div id="Lobby" className="tabcontent">
                                            <Lobby
                                                userData={userData}
                                                players={players}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                            <div
                                id="Chat"
                                className="tabcontent"
                                style={{ display: "none" }}
                            >
                                <Chat
                                    roomId={roomId}
                                    timeLeft={timeLeft}
                                    username={userData.username}
                                />
                            </div>
                        </TabContentContainer>
                    </TabContainer>
                )}
            </Container>
        </>
    );
}

export default Room;
