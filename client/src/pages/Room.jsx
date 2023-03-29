import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Canvas, Chat, Container, FlexContainer, Header, Lobby, Scoreboard } from "components";
import { socket } from "service/socket";

function Room() {
    const { roomId } = useParams();
    const username = localStorage.getItem("username") || localStorage.getItem("nickname");
    
    const [players, setPlayers] = useState([]);
    const [isHost, setHost]= useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [word, setWord] = useState('');
    const [gameStart, setGameStart] = useState(false);
    const [gameData, setGameData] = useState({});
    const [timeLeft, setTimeLeft] = useState('0');

    useEffect(() => {

        socket.on("game-start", (data) => {
            setGameStart(true);
            setGameData(data);
        });

        socket.on("players-data", (data) => {
            setPlayers(data);
            if (players?.length > 0) {
                setHost(players.find(player => player.username === username).isHost);
            }
        });

        socket.on("timer", (data) => {
            setTimeLeft(data);
        });

        socket.on("turn-start", (word) => {
            setIsDrawing(true);
            setWord(word);
        });

        socket.on("turn-end", () => {
            setIsDrawing(false);
        });


    }, [players, isHost, isDrawing, gameStart, gameData, timeLeft, username, word]);

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    {gameStart && 
                        <>
                        <Scoreboard this_username={username} gameData={gameData} isHost={isHost} />
                        <Canvas timeLeft={timeLeft} currentTurn={gameData.currentTurn} isDrawing={isDrawing} word={word} />
                        </>
                    }
                    {!gameStart && 
                        <Lobby this_username={username} players={players} isHost={isHost} />
                    }
                    <Chat roomId={roomId} username={username} />
                </FlexContainer>
            </Container>
        </>
    );
}

export default Room;
