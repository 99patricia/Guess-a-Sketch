import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Header, Container, Form, FormInput } from "components";

function Home() {
    const [roomId, setRoomId] = useState("");
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const handleJoinRoom = (e) => {
        e.preventDefault();
        localStorage.setItem("nickname", nickname);
        navigate(`/chat/${roomId}`);
    };

    return (
        <>
            <Header />
            <Container>
                <Form onSubmit={handleJoinRoom}>
                    <FormInput
                        label="Join a room"
                        placeholder="Enter room code"
                        type="text"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                    ></FormInput>
                    <FormInput
                        label="Nickname"
                        placeholder="Enter nickname"
                        type="text"
                        onChange={(e) => setNickname(e.target.value)}
                        value={nickname}
                    ></FormInput>
                    <Button column type="submit">
                        Join
                    </Button>
                    {/* <Button column secondary onclick='location.href="/"'>
                        Create a new room
                    </Button> */}
                </Form>
            </Container>
        </>
    );
}

export default Home;
