import React, { useRef } from "react";
import { useParams } from "react-router-dom";

import { Canvas, Chat, Container, FlexContainer, Header } from "components";

function Room() {
    const canvasRef = useRef();
    const { roomId } = useParams();

    const username =
        localStorage.getItem("username") || localStorage.getItem("nickname");

    return (
        <>
            <Header />
            <Container>
                <FlexContainer>
                    <Canvas ref={canvasRef} sendToSocket={true} />
                    <Chat roomId={roomId} username={username} />
                </FlexContainer>
            </Container>
        </>
    );
}

export default Room;
