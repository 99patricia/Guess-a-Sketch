import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Canvas, Chat, Container, FlexContainer, Header, Lobby } from "components";
import { socket } from "service/socket";

function Room() {
    const { roomId } = useParams();
    const username = localStorage.getItem("nickname");
    
    const [gameStart, setGameStart] = useState(false);
    const [gameData, setGameData] = useState({});

    useEffect(() => {
        socket.on("game-start", (data) => {
            setGameStart(true);
            setGameData(data);
        });
    }, [gameStart, gameData]);

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    {gameStart && 
                        <Canvas />
                    }
                    {!gameStart && 
                        <Lobby roomId={roomId} this_username={username} />
                    }
                    <Chat roomId={roomId} username={username} />
                </FlexContainer>
            </Container>
        </>
    );
}

export default Room;
