import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Canvas,
    Chat,
    Container,
    FlexContainer,
    Header,
    Lobby,
    Scoreboard,
} from "components";
import { socket } from "service/socket";
import { useUserData } from "hooks";

function Room() {
    const canvasRef = useRef();
    const { roomId } = useParams();
    const { isLoggedIn, loggedInAsGuest, userData } = useUserData();

    const [players, setPlayers] = useState([]);
    const [isHost, setHost] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [word, setWord] = useState("");
    const [gameStart, setGameStart] = useState(false);
    const [gameData, setGameData] = useState({});
    const [colorChoices, setColorChoices] = useState(["black", "red", "blue"]);
    const [penSizeChoices, setPenSizeChoices] = useState([10, 50]);

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

        socket.off("kick-player");
        socket.on("kick-player", (room_id) => {
            socket.emit("leave-room", room_id);
        });
    }, [players, isHost, isDrawing, gameStart, gameData, userData, word]);

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    {gameStart ? (
                        <>
                            <Scoreboard
                                userData={userData}
                                gameData={gameData}
                                isHost={isHost}
                            />
                            <Canvas
                                ref={canvasRef}
                                gameData={gameData}
                                isDrawing={isDrawing}
                                word={word}
                                sendToSocket
                                penSizeChoices={penSizeChoices}
                                colorChoices={colorChoices}
                            />
                        </>
                    ) : (
                        <Lobby
                            userData={userData}
                            players={players}
                            host={isHost}
                        />
                    )}
                    <Chat roomId={roomId} username={userData.username} />
                </FlexContainer>
            </Container>
        </>
    );
}

export default Room;
