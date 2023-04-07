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
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import styled from "styled-components";

const StyledTabs = styled(Tabs)`
    height: 85vh;
    width: 90vw;
    margin: 1rem;
`;

const StyledTabList = styled(TabList)`
    list-style: none;
    margin: 0 0 1rem 0;
    padding: 0;
    position: relative;
    display: grid;
    gap: 1rem;
    grid-auto-flow: column;
`;

const StyledTab = styled(Tab)`
    padding: 1rem 0;
    position: relative;
    display: flex;
    justify-content: center;
`;

function Room() {
    const isDesktop = Desktop();
    const navigate = useNavigate();
    const canvasRef = useRef();
    const { roomId } = useParams();
    const { userData } = useUserData();

    const [players, setPlayers] = useState([]);
    const [isHost, setHost] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [word, setWord] = useState("");
    const [gameStart, setGameStart] = useState(false);
    const [gameData, setGameData] = useState({});
    const [gameOver, setGameOver] = useState(false);
    const [colorChoices, setColorChoices] = useState(["black", "red", "blue"]);
    const [penSizeChoices, setPenSizeChoices] = useState([10, 50]);
    const [timeLeft, setTimeLeft] = useState("0");

    useEffect(() => {
        const userPerks = JSON.parse(localStorage.getItem("userPerks"));
        if (userPerks && userPerks.length > 0) {
            // User may have unlocked more than one perk, use their best one
            const bestPerk = userPerks.reduce((prev, current) => {
                return prev.rank > current.rank ? prev : current;
            });
            setColorChoices(bestPerk["colors"]);
            setPenSizeChoices(
                bestPerk["pen_sizes"].sort(function (a, b) {
                    return a - b;
                })
            );
        }

        socket.off("game-start");
        socket.on("game-start", (data) => {
            setGameStart(true);
            setGameData(data);
        });

        socket.off("game-data");
        socket.on("game-data", (data) => {
            setGameData(data);
        });

        socket.off("players-data");
        socket.on("players-data", (data) => {
            setPlayers(data);
            if (players?.length > 0) {
                setHost(
                    players.find(
                        (player) => player.username === userData.username
                    ).isHost
                );
            }
        });

        socket.off("turn-start");
        socket.on("turn-start", (word) => {
            setIsDrawing(true);
            setWord(word);
        });

        socket.off("turn-end");
        socket.on("turn-end", () => {
            setIsDrawing(false);
        });

        socket.off("timer");
        socket.on("timer", (data) => {
            setTimeLeft(data);
        });

        socket.off("kick-player");
        socket.on("kick-player", (room_id) => {
            socket.emit("leave-room", room_id);
            navigate(`/`);
        });

        socket.off("game-over");
        socket.on("game-over", () => {
            setGameOver(true);
        });
    }, [players, isHost, isDrawing, gameStart, timeLeft, userData, word]);

    return (
        <>
            <Header />
            <Container>
                {isDesktop ? (
                    <>
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
                                            />
                                        </>
                                    ) : (
                                        <Lobby
                                            userData={userData}
                                            players={players}
                                            host={isHost}
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
                    </>
                ) : (
                    <StyledTabs>
                        <StyledTabList>
                            <StyledTab>
                                {gameOver ? (
                                    "Game Over"
                                ) : (
                                    <>{gameStart ? "Game" : "Lobby"}</>
                                )}
                            </StyledTab>
                            <StyledTab>Chat</StyledTab>
                        </StyledTabList>

                        <TabPanel>
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
                                            />
                                        </>
                                    ) : (
                                        <Lobby
                                            userData={userData}
                                            players={players}
                                            host={isHost}
                                        />
                                    )}
                                </>
                            )}
                        </TabPanel>
                        <TabPanel>
                            <Chat
                                roomId={roomId}
                                timeLeft={timeLeft}
                                username={userData.username}
                            />
                        </TabPanel>
                    </StyledTabs>
                )}
            </Container>
        </>
    );
}

export default Room;
